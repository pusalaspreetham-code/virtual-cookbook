import { useState } from "react";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";

// ─── PASTE YOUR EMAILJS KEYS HERE ───────────────────────────────
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_FEEDBACK_TEMPLATE = import.meta.env.VITE_EMAILJS_FEEDBACK_TEMPLATE;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
// ────────────────────────────────────────────────────────────────

const SUPPORT_EMAIL = "pusalaspeetham@gmail.com";

const TYPES = [
  "Bug Report 🐛",
  "Feature Request ✨",
  "Recipe Suggestion 🍳",
  "Praise 🙌",
  "Other 💬",
];

export default function Feedback() {
  const { addToast } = useToast();
  const { user }     = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [form, setForm] = useState({
    name:          user?.name || "",
    email:         "",
    feedback_type: "",
    rating:        0,
    message:       "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.feedback_type)         { addToast("Please select a feedback type", "warning"); return; }
    if (form.rating === 0)           { addToast("Please select a star rating", "warning"); return; }
    if (form.message.trim().length < 10) { addToast("Please write a more detailed message", "warning"); return; }

    setLoading(true);
    try {
      const emailjs = await import("@emailjs/browser");
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_FEEDBACK_TEMPLATE,
        {
          name:          form.name,
          email:         form.email,
          feedback_type: form.feedback_type,
          rating:        form.rating,
          message:       form.message,
        },
        EMAILJS_PUBLIC_KEY
      );
      setSubmitted(true);
      addToast("Thank you for your feedback! 🙏", "success");
    } catch (err) {
      console.error("EmailJS error:", err);
      addToast("Failed to send feedback. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const RATING_LABELS = ["", "Poor 😕", "Fair 😐", "Good 🙂", "Great 😊", "Excellent! 🤩"];
  const RATING_COLORS = { 1:"#ef4444", 2:"#f59e0b", 3:"#3b82f6", 4:"#22c55e", 5:"#16a085" };

  if (submitted) return (
    <div className="page page-narrow">
      <div className="feedback-success">
        <div className="feedback-success-icon">🎉</div>
        <h2>Thank You!</h2>
        <p>
          Your feedback has been sent to <strong>{SUPPORT_EMAIL}</strong>.<br/>
          We read every single message — it truly helps us improve CookBook.
        </p>
        <button
          className="btn btn-primary"
          onClick={() => { setSubmitted(false); setForm({name:user?.name||"",email:"",feedback_type:"",rating:0,message:""}); }}
        >
          Send More Feedback
        </button>
      </div>
    </div>
  );

  return (
    <div className="page page-narrow">
      <div className="page-header">
        <h1 className="page-title">💬 Share Feedback</h1>
        <p className="page-subtitle">
          Tell us what you think. Your feedback goes directly to our team at{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} style={{color:"var(--primary)"}}>{SUPPORT_EMAIL}</a>
        </p>
      </div>

      <form className="feedback-form" onSubmit={handleSubmit}>

        {/* Name & Email */}
        <div className="form-section">
          <h2 className="section-title">Your Details</h2>
          <div className="form-row">
            <div className="field">
              <label>Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({...form, name:e.target.value})}
                required
                placeholder="Your name"
              />
            </div>
            <div className="field">
              <label>Email * (for our reply)</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({...form, email:e.target.value})}
                required
                placeholder="your@email.com"
              />
            </div>
          </div>
        </div>

        {/* Feedback Type */}
        <div className="form-section">
          <h2 className="section-title">What's on your mind? *</h2>
          <div className="feedback-types">
            {TYPES.map(t => (
              <button
                key={t} type="button"
                className={`type-btn ${form.feedback_type === t ? "selected" : ""}`}
                onClick={() => setForm({...form, feedback_type:t})}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Star Rating */}
        <div className="form-section">
          <h2 className="section-title">How would you rate CookBook? *</h2>
          <div className="star-row">
            {[1,2,3,4,5].map(r => (
              <button
                key={r} type="button"
                className={`star-btn ${form.rating >= r ? "filled" : ""}`}
                onClick={() => setForm({...form, rating:r})}
                style={form.rating >= r ? {color: RATING_COLORS[form.rating]} : {}}
              >★</button>
            ))}
            {form.rating > 0 && (
              <span className="rating-label" style={{color: RATING_COLORS[form.rating]}}>
                {RATING_LABELS[form.rating]}
              </span>
            )}
          </div>
        </div>

        {/* Message */}
        <div className="form-section">
          <h2 className="section-title">Your Message *</h2>
          <div className="field">
            <textarea
              rows={6}
              value={form.message}
              onChange={e => setForm({...form, message:e.target.value})}
              required
              placeholder="Tell us anything — bugs, ideas, what you love, what could be better..."
              maxLength={1000}
            />
            <div style={{display:"flex",justifyContent:"space-between",marginTop:".3rem"}}>
              <span style={{fontSize:".8rem",color:"var(--text-3)"}}>Minimum 10 characters</span>
              <span className="char-count">{form.message.length}/1000</span>
            </div>
          </div>
        </div>

        <div className="form-submit">
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? <><span className="spinner"/> Sending...</> : "Send Feedback"}
          </button>
        </div>

        <p className="form-note" style={{textAlign:"center",marginTop:"1rem"}}>
          📧 Your feedback will be sent directly to <strong>{SUPPORT_EMAIL}</strong>
        </p>
      </form>
    </div>
  );
}
