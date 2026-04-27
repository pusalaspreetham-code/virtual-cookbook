import { useState } from "react";
import { useToast } from "../context/ToastContext";

// ─── PASTE YOUR EMAILJS KEYS HERE ───────────────────────────────
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_SUPPORT_TEMPLATE = import.meta.env.VITE_EMAILJS_SUPPORT_TEMPLATE;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;;
// ────────────────────────────────────────────────────────────────

const SUPPORT_EMAIL = "pusalaspeetham@gmail.com";

const FAQS = [
  { q:"How do I add a recipe?", a:"Sign in and click 'Add Recipe' in the navbar. Fill in the title, cuisine, cooking time, ingredients, and steps, then click Publish." },
  { q:"Can I edit my recipe after posting?", a:"Yes! Open your recipe and if you're the author you'll see an Edit option in the detail view." },
  { q:"How do favorites work?", a:"Open any recipe and click '♥ Save'. It'll appear in your Favorites section." },
  { q:"What does 'For You' show?", a:"Recipes that share ingredients with your own posted recipes — personalized just for you." },
  { q:"I forgot my password. What do I do?", a:"Click 'Forgot password?' on the login page. Enter your email and we'll send a reset link." },
  { q:"Is CookBook free?", a:"Yes! CookBook is completely free to use. Browse, post, and save recipes at no cost." },
  { q:"How do I share a recipe on WhatsApp?", a:"Open any recipe and tap 'Share on WhatsApp' in the detail view." },
  { q:"How do I delete my account?", a:"Go to Profile → Account tab → Delete Account, or contact us via the form below." },
];

export default function Support() {
  const { addToast } = useToast();
  const [openFaq, setOpenFaq]     = useState(null);
  const [search, setSearch]       = useState("");
  const [loading, setLoading]     = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketRef]               = useState(() => Math.random().toString(36).slice(2,8).toUpperCase());
  const [ticket, setTicket]       = useState({ name:"", email:"", subject:"", message:"" });

  const filtered = FAQS.filter(f =>
    f.q.toLowerCase().includes(search.toLowerCase()) ||
    f.a.toLowerCase().includes(search.toLowerCase())
  );

  const handleTicket = async (e) => {
    e.preventDefault();
    if (!ticket.subject) { addToast("Please select a subject", "warning"); return; }
    if (ticket.message.trim().length < 10) { addToast("Please write a more detailed message", "warning"); return; }
    setLoading(true);
    try {
      const emailjs = await import("@emailjs/browser");
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_SUPPORT_TEMPLATE,
        {
          name:    ticket.name,
          email:   ticket.email,
          subject: ticket.subject,
          message: ticket.message,
        },
        EMAILJS_PUBLIC_KEY
      );
      setSubmitted(true);
      addToast("Ticket sent! We'll reply within 24h ✅", "success");
    } catch (err) {
      console.error("EmailJS error:", err);
      addToast("Failed to send email. Please contact us on WhatsApp.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">🛟 Customer Support</h1>
        <p className="page-subtitle">We're here to help. Find answers fast or reach us directly.</p>
      </div>

      {/* Contact Channels */}
      <div className="support-channels">
        <div className="channel-card">
          <div className="channel-icon">📧</div>
          <h3>Email Support</h3>
          <a href={`mailto:${SUPPORT_EMAIL}`} className="channel-email">{SUPPORT_EMAIL}</a>
          <span className="channel-time">Replies within 24 hours</span>
        </div>
        <div className="channel-card">
          <div className="channel-icon">📲</div>
          <h3>WhatsApp</h3>
          <p>Chat with us directly</p>
          <a
            href={`https://wa.me/919999999999?text=${encodeURIComponent("Hi CookBook Support, I need help!")}`}
            target="_blank" rel="noreferrer"
            className="btn btn-whatsapp"
            style={{marginTop:".6rem",display:"inline-flex"}}
          >
            Chat Now
          </a>
          <span className="channel-time">Mon–Fri · 9am–6pm IST</span>
        </div>
        <div className="channel-card">
          <div className="channel-icon">💬</div>
          <h3>Community Forum</h3>
          <p>Get help from fellow chefs</p>
          <a href="/community" className="btn btn-outline" style={{marginTop:".6rem",display:"inline-flex"}}>
            Visit Forum
          </a>
        </div>
      </div>

      {/* FAQ */}
      <div className="faq-section">
        <h2 className="section-heading">Frequently Asked Questions</h2>
        <input
          type="text"
          className="faq-search"
          placeholder="🔍 Search FAQs..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="faq-list">
          {filtered.map((f, i) => (
            <div key={i} className={`faq-item ${openFaq === i ? "open" : ""}`}>
              <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span>{f.q}</span>
                <span className="faq-arrow">{openFaq === i ? "▲" : "▼"}</span>
              </button>
              {openFaq === i && <div className="faq-answer">{f.a}</div>}
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="no-results">No FAQs match your search. Use the contact form below!</p>
          )}
        </div>
      </div>

      {/* Support Ticket Form */}
      <div className="support-form-section">
        <h2 className="section-heading">Still need help?</h2>
        <p style={{color:"var(--text-2)",marginBottom:"1.5rem",fontSize:".95rem"}}>
          Fill in the form below and we'll reply to your email address within 24 hours.
        </p>

        {submitted ? (
          <div className="ticket-success-big">
            <div className="ticket-success-icon">📬</div>
            <h3>Ticket Received!</h3>
            <p>
              Your message has been sent to <strong>{SUPPORT_EMAIL}</strong>.<br/>
              We'll reply to <strong>{ticket.email}</strong> within 24 hours.
            </p>
            <div className="ticket-ref">Ticket Ref: #{ticketRef}</div>
            <button
              className="btn btn-outline"
              onClick={() => { setSubmitted(false); setTicket({name:"",email:"",subject:"",message:""}); }}
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form className="support-form" onSubmit={handleTicket}>
            <div className="form-row">
              <div className="field">
                <label>Your Name *</label>
                <input
                  type="text"
                  value={ticket.name}
                  onChange={e => setTicket({...ticket, name:e.target.value})}
                  required
                  placeholder="Your name"
                />
              </div>
              <div className="field">
                <label>Your Email *</label>
                <input
                  type="email"
                  value={ticket.email}
                  onChange={e => setTicket({...ticket, email:e.target.value})}
                  required
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="field">
              <label>Subject *</label>
              <select
                value={ticket.subject}
                onChange={e => setTicket({...ticket, subject:e.target.value})}
                required
              >
                <option value="">Select a topic</option>
                <option>Account / Login Issue</option>
                <option>Recipe Problem</option>
                <option>Feature Request</option>
                <option>Bug Report</option>
                <option>Account Deletion Request</option>
                <option>Other</option>
              </select>
            </div>

            <div className="field">
              <label>Message *</label>
              <textarea
                rows={6}
                value={ticket.message}
                onChange={e => setTicket({...ticket, message:e.target.value})}
                required
                placeholder="Describe your issue in detail..."
                maxLength={1000}
              />
              <div style={{display:"flex",justifyContent:"space-between",marginTop:".3rem"}}>
                <span style={{fontSize:".8rem",color:"var(--text-3)"}}>Minimum 10 characters</span>
                <span className="char-count">{ticket.message.length}/1000</span>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              style={{padding:".85rem",fontSize:"1rem"}}
              disabled={loading}
            >
              {loading ? <><span className="spinner"/> Sending your ticket...</> : "Submit Ticket"}
            </button>

            <p className="form-note">
              📧 After submitting, check your inbox for a confirmation.
              Your ticket will be sent to <strong>{SUPPORT_EMAIL}</strong>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
