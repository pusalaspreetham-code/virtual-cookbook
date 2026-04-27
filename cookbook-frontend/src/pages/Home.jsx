import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { isLoggedIn } = useAuth();
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-tag">Your Personal Kitchen</div>
          <h1 className="hero-title">Cook something<br/><span className="hero-accent">extraordinary.</span></h1>
          <p className="hero-desc">Discover, share, and organize recipes from cuisines around the world. Your digital cookbook, always with you.</p>
          <div className="hero-cta">
            <Link to="/recipes" className="btn btn-primary btn-lg">Browse Recipes</Link>
            {!isLoggedIn && <Link to="/register" className="btn btn-ghost btn-lg">Get Started Free</Link>}
          </div>
        </div>
        <div className="hero-visual">
          <div className="emoji-ring">
            {["🍜","🥘","🍕","🥗","🍱","🌮","🍛","🥩"].map((e,i)=>(
              <span key={i} className="emoji-float" style={{"--i":i}}>{e}</span>
            ))}
          </div>
          <div className="hero-blob">🍳</div>
        </div>
      </section>
      <section className="features">
        {[
          {icon:"🔍",title:"Smart Search",desc:"Filter by ingredient, cuisine, or cooking time."},
          {icon:"✦",title:"Personalized",desc:"Get recipe recommendations based on what you cook."},
          {icon:"♥",title:"Save Favorites",desc:"Bookmark recipes you love and revisit anytime."},
          {icon:"👥",title:"Community",desc:"Share tips and stories with fellow home chefs."},
          {icon:"📲",title:"WhatsApp Share",desc:"Share recipes instantly with friends and family."},
          {icon:"🛟",title:"24/7 Support",desc:"We're here whenever you need help."},
          {icon:"🔒",title:"Secure Account",desc:"Your data is protected with JWT authentication."},
          {icon:"👨‍🍳",title:"Share Recipes",desc:"Publish your own creations for the community."},
        ].map((f,i)=>(
          <div key={i} className="feature-card">
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
