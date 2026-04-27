import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getCommunityPosts, createPost, likePost, deletePost } from "../api/api";
import { Link } from "react-router-dom";

const CUISINE_TAG_COLORS = {
  Indian:"#f39c12", Italian:"#e74c3c", American:"#2980b9",
  Chinese:"#27ae60", Thai:"#d35400", Mexican:"#8e44ad",
  French:"#16a085", Japanese:"#c0392b", General:"#6c5ce7",
};

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60)   return "just now";
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  return `${Math.floor(diff/86400)}d ago`;
}

export default function Community() {
  const { isLoggedIn, user } = useAuth();
  const { addToast } = useToast();
  const [posts, setPosts]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [posting, setPosting]   = useState(false);
  const [newPost, setNewPost]   = useState("");
  const [cuisine, setCuisine]   = useState("General");
  const [filter, setFilter]     = useState("All");
  const [error, setError]       = useState("");

  const CUISINES = ["General","Italian","Indian","Chinese","Mexican","American","French","Japanese","Thai"];

  const load = useCallback(async () => {
    try {
      const data = await getCommunityPosts();
      setPosts(data);
    } catch (e) {
      setError("Could not load posts. Is the server running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handlePost = async () => {
    if (!newPost.trim()) return;
    if (newPost.trim().length < 5) { addToast("Post is too short", "warning"); return; }
    setPosting(true);
    try {
      const post = await createPost({ content: newPost.trim(), cuisine });
      setPosts(prev => [post, ...prev]);
      setNewPost("");
      addToast("Post shared with the community! 🎉", "success");
    } catch (e) {
      addToast(e.message, "error");
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (id) => {
    if (!isLoggedIn) { addToast("Sign in to like posts", "warning"); return; }
    try {
      const updated = await likePost(id);
      setPosts(prev => prev.map(p => p._id === id ? updated : p));
    } catch (e) {
      addToast(e.message, "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await deletePost(id);
      setPosts(prev => prev.filter(p => p._id !== id));
      addToast("Post deleted", "info");
    } catch (e) {
      addToast(e.message, "error");
    }
  };

  const shareToWhatsApp = (post) => {
    const text = `💬 From CookBook Community:\n\n"${post.content}"\n— ${post.userId?.name || "A chef"}\n\n🍳 CookBook App`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const allCuisines = ["All", ...new Set(posts.map(p => p.cuisine).filter(Boolean))];
  const filtered = filter === "All" ? posts : posts.filter(p => p.cuisine === filter);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">👥 Community</h1>
        <p className="page-subtitle">Real tips and stories from CookBook chefs</p>
      </div>

      {/* Compose Box */}
      {isLoggedIn ? (
        <div className="compose-box">
          <div className="compose-avatar">{(user?.name || "U")[0].toUpperCase()}</div>
          <div className="compose-right">
            <textarea
              value={newPost}
              onChange={e => setNewPost(e.target.value.slice(0, 500))}
              placeholder="Share a tip, recipe story, or kitchen hack..."
              rows={3}
            />
            <div className="compose-actions">
              <select
                value={cuisine}
                onChange={e => setCuisine(e.target.value)}
                className="compose-cuisine"
              >
                {CUISINES.map(c => <option key={c}>{c}</option>)}
              </select>
              <span className="char-count">{newPost.length}/500</span>
              <button
                className="btn btn-primary"
                onClick={handlePost}
                disabled={!newPost.trim() || posting}
              >
                {posting ? <span className="spinner"/> : "Post"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="community-cta">
          <span>🍳</span>
          <div>
            <strong>Join the conversation</strong>
            <p>Sign in to share tips and interact with the community.</p>
          </div>
          <Link to="/login" className="btn btn-primary">Sign In</Link>
        </div>
      )}

      {/* Cuisine filters */}
      <div className="tag-filters">
        {allCuisines.map(c => (
          <button
            key={c}
            className={`tag-filter ${filter === c ? "active" : ""}`}
            onClick={() => setFilter(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Feed */}
      {loading ? (
        <div className="loading-grid">
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton-card" style={{height:"140px"}}/>)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💬</div>
          <p>{filter === "All" ? "No posts yet. Be the first to share something!" : `No posts tagged ${filter} yet.`}</p>
        </div>
      ) : (
        <div className="community-feed">
          {filtered.map(post => {
            const authorName  = post.userId?.name || "Chef";
            const authorInit  = authorName[0].toUpperCase();
            const isOwner     = user && post.userId?._id === user.id;
            const hasLiked    = user && post.likes?.includes(user.id);
            const likeCount   = post.likes?.length || 0;

            return (
              <div key={post._id} className="community-post">
                <div className="post-header">
                  <div className="post-avatar">{authorInit}</div>
                  <div>
                    <div className="post-author">{authorName}</div>
                    <div className="post-time">{timeAgo(post.createdAt)}</div>
                  </div>
                  {post.cuisine && (
                    <span className="post-tag" style={{background: CUISINE_TAG_COLORS[post.cuisine] || "#666"}}>
                      {post.cuisine}
                    </span>
                  )}
                  {isOwner && (
                    <button className="post-delete" onClick={() => handleDelete(post._id)} title="Delete post">🗑</button>
                  )}
                </div>
                <p className="post-content">{post.content}</p>
                <div className="post-actions">
                  <button
                    className={`post-action ${hasLiked ? "liked" : ""}`}
                    onClick={() => handleLike(post._id)}
                  >
                    {hasLiked ? "❤️" : "🤍"} {likeCount}
                  </button>
                  <button className="post-action" onClick={() => shareToWhatsApp(post)}>
                    📲 Share
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
