// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function Login() {
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password) {
      setError("Please enter both username and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/api/login", { username, password });
      const token = res.data.token;
      if (!token) throw new Error("No token returned");
      localStorage.setItem("token", token);
      nav("/");
    } catch (err) {
      setError(err?.response?.data?.error || "Login failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ paddingTop: 36, paddingBottom: 36 }}>
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <div
          className="page-card"
          style={{
            padding: 22,
            display: "grid",
            gap: 14,
            borderRadius: 14,
            alignItems: "start",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div className="kicker">Welcome back</div>
              <h2 className="h1" style={{ fontSize: 22, marginTop: 4 }}>
                Sign in
              </h2>
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div
                style={{
                  background: "linear-gradient(135deg,#38bdf8,#0ea5e9)",
                  width: 46,
                  height: 46,
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  color: "#041124",
                  boxShadow: "0 8px 30px rgba(14,165,233,0.12)",
                }}
                aria-hidden
              >
                TB
              </div>
            </div>
          </div>

          {error && (
            <div style={{ background: "rgba(239,68,68,0.06)", color: "#ffdede", padding: 10, borderRadius: 8 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
            <label style={{ color: "var(--muted)", fontSize: 13 }}>Username</label>
            <input
              className="input"
              placeholder="your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              aria-label="username"
              autoComplete="username"
            />

            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <label style={{ color: "var(--muted)", fontSize: 13 }}>Password</label>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input
                    className="input"
                    type={showPwd ? "text" : "password"}
                    placeholder="your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-label="password"
                    autoComplete="current-password"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((s) => !s)}
                    className="icon-btn"
                    aria-pressed={showPwd}
                    title={showPwd ? "Hide password" : "Show password"}
                    style={{ minWidth: 44 }}
                  >
                    {showPwd ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <input id="remember" type="checkbox" style={{ accentColor: "var(--accent)" }} />
                <label htmlFor="remember" style={{ color: "var(--muted)" }}>
                  Remember
                </label>
              </div>

              <Link to="/register" style={{ color: "var(--accent)", textDecoration: "none" }}>
                Create account
              </Link>
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                aria-disabled={loading}
                style={{ display: "inline-flex", alignItems: "center", gap: 10 }}
              >
                {loading ? <span style={{ transform: "scale(.9)" }}>Signing in…</span> : <span>Sign in</span>}
              </button>

              <button
                type="button"
                className="icon-btn"
                onClick={() => {
                  setUsername("demo");
                  setPassword("demo");
                }}
                title="Fill demo"
              >
                Demo
              </button>
            </div>
          </form>

          <div style={{ marginTop: 4, color: "var(--muted)", fontSize: 13 }}>
            By signing in you agree to the app terms. <Link to="/register" style={{ color: "var(--accent)" }}>Create an account</Link> if you don't have one.
          </div>
        </div>
      </div>
    </div>
  );
}
