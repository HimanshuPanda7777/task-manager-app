// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    if (!username.trim() || !password) {
      setMsg("Please complete all fields.");
      return;
    }
    if (password !== confirmPwd) {
      setMsg("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/api/register", { username, password });
      setMsg("Registered successfully. Redirecting to login…");
      setTimeout(() => nav("/login"), 900);
    } catch (err) {
      setMsg(err?.response?.data?.error || "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ paddingTop: 36, paddingBottom: 36 }}>
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <div className="page-card" style={{ padding: 22, borderRadius: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div className="kicker">Create account</div>
              <h2 className="h1" style={{ fontSize: 22, marginTop: 4 }}>
                Register
              </h2>
            </div>

            <div
              style={{
                background: "linear-gradient(135deg,#fcd34d,#fb7185)",
                width: 46,
                height: 46,
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                color: "#041124",
                boxShadow: "0 8px 30px rgba(250,130,130,0.08)",
              }}
              aria-hidden
            >
              ✨
            </div>
          </div>

          {msg && (
            <div style={{ background: "rgba(255,255,255,0.02)", padding: 10, borderRadius: 8, color: "var(--text)" }}>
              {msg}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, marginTop: 8 }}>
            <label style={{ color: "var(--muted)", fontSize: 13 }}>Username</label>
            <input className="input" placeholder="choose a username" value={username} onChange={(e) => setUsername(e.target.value)} />

            <label style={{ color: "var(--muted)", fontSize: 13 }}>Password</label>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input className="input" type={showPwd ? "text" : "password"} placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="button" className="icon-btn" onClick={() => setShowPwd((s) => !s)}>{showPwd ? "🙈" : "👁️"}</button>
            </div>

            <label style={{ color: "var(--muted)", fontSize: 13 }}>Confirm password</label>
            <input className="input" type={showPwd ? "text" : "password"} placeholder="confirm password" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} />

            <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 6 }}>
              <button className="btn-primary" type="submit" disabled={loading}>
                {loading ? "Signing up…" : "Register"}
              </button>

              <Link to="/login" style={{ color: "var(--muted)", textDecoration: "none" }}>Back to login</Link>
            </div>
          </form>

          <div style={{ marginTop: 12, color: "var(--muted)", fontSize: 13 }}>
            By creating an account you agree to the <span style={{ color: "var(--accent)" }}>Terms</span>.
          </div>
        </div>
      </div>
    </div>
  );
}
