import React, { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider, facebookProvider } from "./firebase";

// ── Styles ────────────────────────────────────────────────────────────────
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;1,9..144,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`;

const CSS = `
:root {
  --saffron: #E8650A; --gold: #F0A500;
  --teal: #0A7C6E;    --teal-light: #14B8A6;
  --ink: #0D1117;     --ink-soft: #1C2333;
  --surface: #F6F8FA; --card: #FFFFFF;
  --border: #E1E7EF;  --muted: #6B7280;
  --success: #059669; --danger: #DC2626;
  --r-sm: 12px; --r-md: 18px; --r-lg: 24px;
  --shadow-md: 0 8px 32px rgba(0,0,0,0.10);
  --shadow-lg: 0 20px 60px rgba(0,0,0,0.14);
}
*, *::before, *::after { box-sizing: border-box; margin:0; padding:0; }

.auth-root {
  min-height: 100vh;
  display: flex;
  font-family: 'Plus Jakarta Sans', sans-serif;
  background: var(--surface);
  color: var(--ink);
}

/* ── LEFT PANEL ── */
.auth-left {
  width: 48%;
  background: var(--ink);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 48px;
  position: relative;
  overflow: hidden;
}
.auth-left::before {
  content: '';
  position: absolute; top: -80px; right: -80px;
  width: 320px; height: 320px;
  background: radial-gradient(circle, rgba(232,101,10,0.15), transparent 70%);
}
.auth-left::after {
  content: '';
  position: absolute; bottom: -60px; left: -60px;
  width: 240px; height: 240px;
  background: radial-gradient(circle, rgba(10,124,110,0.15), transparent 70%);
}
.auth-logo {
  font-family: 'Fraunces', serif;
  font-size: 26px; font-weight: 700;
  color: white; letter-spacing: -0.5px;
  position: relative; z-index: 1;
}
.auth-logo span { color: var(--gold); font-style: italic; }
.auth-logo-sub {
  font-size: 11px; color: rgba(255,255,255,0.3);
  font-weight: 600; letter-spacing: 1.5px;
  text-transform: uppercase; margin-top: 4px;
}
.auth-hero {
  position: relative; z-index: 1;
}
.auth-hero h1 {
  font-family: 'Fraunces', serif;
  font-size: clamp(30px, 3.5vw, 46px);
  font-weight: 700; color: white;
  line-height: 1.12; letter-spacing: -1px;
  margin-bottom: 16px;
}
.auth-hero h1 em { font-style: italic; color: var(--gold); }
.auth-hero p {
  font-size: 15px; color: rgba(255,255,255,0.5);
  line-height: 1.7; max-width: 380px; font-weight: 400;
}
.auth-trust {
  display: flex; flex-direction: column; gap: 10px;
  position: relative; z-index: 1;
}
.auth-trust-item {
  display: flex; align-items: center; gap: 12px;
  font-size: 13px; color: rgba(255,255,255,0.55);
  font-weight: 500;
}
.auth-trust-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--teal-light); flex-shrink: 0;
}

/* ── RIGHT PANEL ── */
.auth-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 32px;
  overflow-y: auto;
}
.auth-card {
  background: white;
  border-radius: var(--r-lg);
  padding: 44px 40px;
  width: 100%;
  max-width: 460px;
  box-shadow: var(--shadow-lg);
  border: 1.5px solid var(--border);
}
.auth-tabs {
  display: flex; gap: 0;
  background: var(--surface);
  border-radius: var(--r-sm);
  padding: 4px;
  margin-bottom: 32px;
}
.auth-tab {
  flex: 1; padding: 11px;
  border: none; background: transparent;
  border-radius: 10px;
  font-size: 14px; font-weight: 700;
  color: var(--muted);
  cursor: pointer;
  font-family: 'Plus Jakarta Sans', sans-serif;
  transition: all 0.2s;
}
.auth-tab.active {
  background: white;
  color: var(--ink);
  box-shadow: 0 1px 6px rgba(0,0,0,0.08);
}

/* Social buttons */
.social-btn {
  width: 100%;
  padding: 13px 20px;
  border-radius: var(--r-sm);
  font-size: 14px; font-weight: 700;
  cursor: pointer;
  font-family: 'Plus Jakarta Sans', sans-serif;
  transition: all 0.2s;
  display: flex; align-items: center; justify-content: center;
  gap: 10px; margin-bottom: 10px;
}
.social-btn-google {
  background: white;
  border: 1.5px solid var(--border);
  color: var(--ink);
}
.social-btn-google:hover { border-color: #4285F4; background: #F8FBFF; }
.social-btn-facebook {
  background: #1877F2;
  border: none; color: white;
}
.social-btn-facebook:hover { background: #166FE5; }

.auth-divider {
  display: flex; align-items: center; gap: 12px;
  margin: 20px 0;
}
.auth-divider-line {
  flex: 1; height: 1px; background: var(--border);
}
.auth-divider-text {
  font-size: 12px; color: var(--muted); font-weight: 600;
}

/* Form fields */
.auth-field { margin-bottom: 16px; }
.auth-label {
  display: block; font-size: 13px; font-weight: 700;
  color: var(--ink-soft); margin-bottom: 6px;
}
.auth-input {
  width: 100%; padding: 13px 16px;
  border: 1.5px solid var(--border);
  border-radius: var(--r-sm);
  font-size: 15px; font-family: 'Plus Jakarta Sans', sans-serif;
  color: var(--ink); outline: none; background: white;
  transition: border-color 0.2s;
}
.auth-input:focus {
  border-color: var(--saffron);
  box-shadow: 0 0 0 3px rgba(232,101,10,0.08);
}
.auth-input.error { border-color: var(--danger); }
.auth-input-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
}
.auth-select {
  width: 100%; padding: 13px 16px;
  border: 1.5px solid var(--border);
  border-radius: var(--r-sm);
  font-size: 15px; font-family: 'Plus Jakarta Sans', sans-serif;
  color: var(--ink); outline: none; background: white;
  transition: border-color 0.2s; cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%236B7280' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  padding-right: 36px;
}
.auth-select:focus {
  border-color: var(--saffron);
  box-shadow: 0 0 0 3px rgba(232,101,10,0.08);
}

/* Submit button */
.auth-submit {
  width: 100%; padding: 15px;
  background: linear-gradient(135deg, var(--saffron), var(--gold));
  border: none; border-radius: 50px;
  font-size: 15px; font-weight: 800;
  color: white; cursor: pointer;
  font-family: 'Plus Jakarta Sans', sans-serif;
  box-shadow: 0 6px 20px rgba(232,101,10,0.3);
  transition: all 0.25s; margin-top: 8px;
  display: flex; align-items: center;
  justify-content: center; gap: 10px;
}
.auth-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(232,101,10,0.4);
}
.auth-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

/* Error & info messages */
.auth-error {
  background: #FEE2E2; border: 1px solid #FECDD3;
  color: #991B1B; padding: 12px 16px;
  border-radius: var(--r-sm); font-size: 13px;
  font-weight: 600; margin-bottom: 16px;
  display: flex; align-items: center; gap: 8px;
}
.auth-success {
  background: #D1FAE5; border: 1px solid #A7F3D0;
  color: #065F46; padding: 12px 16px;
  border-radius: var(--r-sm); font-size: 13px;
  font-weight: 600; margin-bottom: 16px;
}

/* Spinner */
.auth-spinner {
  width: 18px; height: 18px;
  border: 3px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Password strength */
.pw-strength {
  height: 4px; border-radius: 4px;
  margin-top: 6px; overflow: hidden;
  background: var(--border);
}
.pw-strength-fill {
  height: 100%; border-radius: 4px;
  transition: all 0.3s;
}

/* Terms */
.auth-terms {
  font-size: 12px; color: var(--muted);
  text-align: center; line-height: 1.6;
  margin-top: 16px; font-weight: 500;
}
.auth-terms a { color: var(--saffron); text-decoration: none; font-weight: 700; }

/* Mobile */
@media (max-width: 768px) {
  .auth-left { display: none; }
  .auth-right { padding: 24px 16px; }
  .auth-card { padding: 32px 24px; }
  .auth-input-grid { grid-template-columns: 1fr; }
}
`;

// ── Helpers ──────────────────────────────────────────────────────────────

const CLASS_LEVELS = [
  "Class 8", "Class 9", "Class 10",
  "Class 11 (Science)", "Class 11 (Commerce)", "Class 11 (Arts)",
  "Class 12 (Science)", "Class 12 (Commerce)", "Class 12 (Arts)",
  "1st Year UG", "2nd Year UG", "3rd Year UG", "4th Year UG",
  "Postgraduate", "Working Professional",
];

const STREAMS = [
  "Science (PCM)", "Science (PCB)", "Science (PCMB)",
  "Commerce", "Arts & Humanities",
  "Vocational", "Undergraduate", "Postgraduate",
];

const GENDERS = ["Male", "Female", "Non-binary", "Prefer not to say"];

const STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Delhi","Jammu & Kashmir","Ladakh","Puducherry","Chandigarh",
];

function getPasswordStrength(pw) {
  if (!pw) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { label: "", color: "" },
    { label: "Weak", color: "#DC2626" },
    { label: "Fair", color: "#D97706" },
    { label: "Good", color: "#059669" },
    { label: "Strong", color: "#0A7C6E" },
  ];
  return { score, ...map[score] };
}

async function createUserProfile(uid, data) {
  await setDoc(doc(db, "users", uid), {
    ...data,
    createdAt: serverTimestamp(),
    profileComplete: false,
    assessmentDone: false,
    xp: 10,
    level: "Level 1 - Explorer",
  });
}

// ── Main Component ────────────────────────────────────────────────────────

export default function AuthPage({ onAuthSuccess }) {
  const [tab, setTab] = useState("register"); // register | login
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Register fields
  const [reg, setReg] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    gender: "", classLevel: "", state: "", stream: "", aspiration: "",
  });

  // Login fields
  const [login, setLogin] = useState({ email: "", password: "" });

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = FONTS + CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const clearMessages = () => { setError(""); setSuccess(""); };

  // ── Social Login (Restored to Popup for stability) ──
  const handleSocialLogin = async (provider) => {
    setLoading(true); clearMessages();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const snap = await getDoc(doc(db, "users", user.uid));
      if (!snap.exists()) {
        const track = sessionStorage.getItem("pendingTrack") || "hybrid";
        await createUserProfile(user.uid, {
          name: user.displayName || "",
          email: user.email || "",
          photo: user.photoURL || "",
          gender: "", classLevel: "", state: "", stream: "", aspiration: "",
          track,
          loginMethod: "social",
          isNewUser: true,
        });
      }
      onAuthSuccess(user, !snap.exists());
    } catch (err) {
      console.error(err);
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  // ── Email Register ──
  const handleRegister = async (e) => {
    e.preventDefault(); clearMessages();
    const { name, email, password, confirmPassword, gender, classLevel, state, stream } = reg;
    if (!name.trim()) return setError("Please enter your full name.");
    if (!email.trim()) return setError("Please enter your email address.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirmPassword) return setError("Passwords do not match.");
    if (!gender) return setError("Please select your gender.");
    if (!classLevel) return setError("Please select your class/level.");
    if (!state) return setError("Please select your state.");
    if (!stream) return setError("Please select your stream.");

    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name.trim() });
      const track = sessionStorage.getItem("pendingTrack") || "hybrid";
      await createUserProfile(cred.user.uid, {
        name: name.trim(), email: email.trim(),
        gender, classLevel, state, stream,
        aspiration: reg.aspiration.trim(),
        track,
        loginMethod: "email",
        isNewUser: true,
      });
      onAuthSuccess(cred.user, true);
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  // ── Email Login ──
  const handleLogin = async (e) => {
    e.preventDefault(); clearMessages();
    if (!login.email || !login.password) return setError("Please fill in all fields.");
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, login.email, login.password);
      onAuthSuccess(cred.user, false);
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const pwStrength = getPasswordStrength(reg.password);

  return (
    <div className="auth-root">
      {/* ── LEFT PANEL ── */}
      <div className="auth-left">
        <div>
          <div className="auth-logo">Vidya<span>Vantage</span></div>
          <div className="auth-logo-sub">By Secret Sharz</div>
        </div>

        <div className="auth-hero">
          <h1>
            Discover the career<br />
            that was <em>made for you</em>
          </h1>
          <p>
            Answer 25 questions. Get your RIASEC personality code. See your best career matches and top colleges — all powered by AI, completely free.
          </p>
        </div>

        <div className="auth-trust">
          {[
            "Free forever for students",
            "Personalised AI career analysis",
            "500+ Indian colleges in database",
            "Holland's RIASEC theory based",
            "Safe & anonymous — no judgement",
          ].map((t, i) => (
            <div key={i} className="auth-trust-item">
              <div className="auth-trust-dot" />
              {t}
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="auth-right">
        <div className="auth-card">
          {/* Tabs */}
          <div className="auth-tabs">
            <button className={`auth-tab ${tab === "register" ? "active" : ""}`} onClick={() => { setTab("register"); clearMessages(); }}>
              Create Account
            </button>
            <button className={`auth-tab ${tab === "login" ? "active" : ""}`} onClick={() => { setTab("login"); clearMessages(); }}>
              Sign In
            </button>
          </div>

          {/* Error / Success */}
          {error && <div className="auth-error">⚠️ {error}</div>}
          {success && <div className="auth-success">✅ {success}</div>}

          {/* Social Buttons */}
          <button className="social-btn social-btn-google" disabled={loading}
            onClick={() => handleSocialLogin(googleProvider)}>
            <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/></svg>
            Continue with Google
          </button>

          <button className="social-btn social-btn-facebook" disabled={loading}
            onClick={() => handleSocialLogin(facebookProvider)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Continue with Facebook
          </button>

          <div className="auth-divider">
            <div className="auth-divider-line" />
            <div className="auth-divider-text">or with email</div>
            <div className="auth-divider-line" />
          </div>

          {/* ── REGISTER FORM ── */}
          {tab === "register" && (
            <form onSubmit={handleRegister}>
              <div className="auth-field">
                <label className="auth-label">Full Name *</label>
                <input className="auth-input" placeholder="e.g. Priya Sharma"
                  value={reg.name} onChange={e => setReg({ ...reg, name: e.target.value })} />
              </div>

              <div className="auth-field">
                <label className="auth-label">Email Address *</label>
                <input type="email" className="auth-input" placeholder="your@email.com"
                  value={reg.email} onChange={e => setReg({ ...reg, email: e.target.value })} />
              </div>

              <div className="auth-input-grid">
                <div className="auth-field">
                  <label className="auth-label">Password *</label>
                  <input type="password" className="auth-input" placeholder="Min. 8 characters"
                    value={reg.password} onChange={e => setReg({ ...reg, password: e.target.value })} />
                  {reg.password && (
                    <div>
                      <div className="pw-strength">
                        <div className="pw-strength-fill" style={{ width: `${pwStrength.score * 25}%`, background: pwStrength.color }} />
                      </div>
                      <div style={{ fontSize: "11px", color: pwStrength.color, fontWeight: "700", marginTop: "3px" }}>{pwStrength.label}</div>
                    </div>
                  )}
                </div>
                <div className="auth-field">
                  <label className="auth-label">Confirm Password *</label>
                  <input type="password" className={`auth-input ${reg.confirmPassword && reg.password !== reg.confirmPassword ? "error" : ""}`}
                    placeholder="Repeat password"
                    value={reg.confirmPassword} onChange={e => setReg({ ...reg, confirmPassword: e.target.value })} />
                </div>
              </div>

              <div className="auth-input-grid">
                <div className="auth-field">
                  <label className="auth-label">Gender *</label>
                  <select className="auth-select" value={reg.gender} onChange={e => setReg({ ...reg, gender: e.target.value })}>
                    <option value="">Select gender</option>
                    {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div className="auth-field">
                  <label className="auth-label">Class / Level *</label>
                  <select className="auth-select" value={reg.classLevel} onChange={e => setReg({ ...reg, classLevel: e.target.value })}>
                    <option value="">Select class</option>
                    {CLASS_LEVELS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="auth-input-grid">
                <div className="auth-field">
                  <label className="auth-label">State *</label>
                  <select className="auth-select" value={reg.state} onChange={e => setReg({ ...reg, state: e.target.value })}>
                    <option value="">Select state</option>
                    {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="auth-field">
                  <label className="auth-label">Stream *</label>
                  <select className="auth-select" value={reg.stream} onChange={e => setReg({ ...reg, stream: e.target.value })}>
                    <option value="">Select stream</option>
                    {STREAMS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label">Career Dream <span style={{ color: "var(--muted)", fontWeight: "500" }}>(Optional)</span></label>
                <input className="auth-input" placeholder="e.g. I want to become a psychologist"
                  value={reg.aspiration} onChange={e => setReg({ ...reg, aspiration: e.target.value })} />
              </div>

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? <><div className="auth-spinner" /> Creating your account...</> : "Create My Account 🚀"}
              </button>

              <div className="auth-terms">
                By creating an account you agree to our{" "}
                <a href="#">Terms of Service</a> and{" "}
                <a href="#">Privacy Policy</a>
              </div>
            </form>
          )}

          {/* ── LOGIN FORM ── */}
          {tab === "login" && (
            <form onSubmit={handleLogin}>
              <div className="auth-field">
                <label className="auth-label">Email Address</label>
                <input type="email" className="auth-input" placeholder="your@email.com"
                  value={login.email} onChange={e => setLogin({ ...login, email: e.target.value })} />
              </div>
              <div className="auth-field">
                <label className="auth-label">Password</label>
                <input type="password" className="auth-input" placeholder="Your password"
                  value={login.password} onChange={e => setLogin({ ...login, password: e.target.value })} />
              </div>
              <div style={{ textAlign: "right", marginBottom: "20px" }}>
                <a href="#" style={{ fontSize: "13px", color: "var(--saffron)", fontWeight: "700", textDecoration: "none" }}>
                  Forgot password?
                </a>
              </div>
              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? <><div className="auth-spinner" /> Signing in...</> : "Sign In →"}
              </button>

              <div className="auth-terms" style={{ marginTop: "20px" }}>
                Don't have an account?{" "}
                <a href="#" onClick={(e) => { e.preventDefault(); setTab("register"); clearMessages(); }}>
                  Create one free →
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Friendly Firebase error messages ─────────────────────────────────────
function friendlyError(code) {
  const map = {
    "auth/email-already-in-use":    "This email is already registered. Try signing in instead.",
    "auth/invalid-email":           "Please enter a valid email address.",
    "auth/weak-password":           "Password is too weak. Use at least 8 characters.",
    "auth/user-not-found":          "No account found with this email. Please register first.",
    "auth/wrong-password":          "Incorrect password. Please try again.",
    "auth/too-many-requests":       "Too many attempts. Please wait a few minutes and try again.",
    "auth/popup-closed-by-user":    "Login popup was closed. Please try again.",
    "auth/network-request-failed":  "Network error. Please check your internet connection.",
    "auth/user-disabled":           "This account has been disabled. Contact support.",
  };
  return map[code] || "Something went wrong. Please try again.";
}
