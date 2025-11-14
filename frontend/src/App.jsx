// src/App.jsx
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useState } from "react";

/* Avatar UI moved here for global top-right placement */
function AvatarProfile({ onLogout }) {
  const [open, setOpen] = useState(false);

  function getUsername() {
    const stored = localStorage.getItem("username");
    if (stored) return stored;

    const token = localStorage.getItem("token");
    if (!token) return "User";

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.username || payload.name || "User";
    } catch {
      return "User";
    }
  }

  const username = getUsername();
  const initials = username.slice(0, 2).toUpperCase();

  return (
    <div style={{ position: "relative" }}>
      <button
        className="avatar"
        type="button"
        onClick={() => setOpen((o) => !o)}
      >
        {initials}
      </button>

      {open && (
        <div className="avatar-menu" style={{ right: 0 }}>
          <div style={{ padding: "8px 12px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
            <div style={{ fontWeight: 800 }}>{username}</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>Productivity user</div>
          </div>

          <a href="#" onClick={(e) => e.preventDefault()} role="menuitem">
            Profile
          </a>
          <a href="#" onClick={(e) => e.preventDefault()} role="menuitem">
            Settings
          </a>
          <a
            href="#"
            role="menuitem"
            style={{ color: "var(--danger)" }}
            onClick={(e) => {
              e.preventDefault();
              onLogout();
            }}
          >
            Logout
          </a>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const navigate = useNavigate();
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  }

  return (
    <>
      {/* 🔥 Global Fixed Top Bar */}
      <div
        style={{
          position: "fixed",
          top: 18,
          right: 28,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <AvatarProfile onLogout={logout} />
      </div>

      {/* Page Layout */}
      <div className="container">
        <div className="layout">
          <aside className="sidebar">
            <div className="sidebar-title">Workspace</div>

            <nav className="nav">
              <NavLink to="/" className="nav-link">🏠 Dashboard</NavLink>
              <NavLink to="/login" className="nav-link">🔑 Login</NavLink>
              <NavLink to="/register" className="nav-link">✨ Register</NavLink>
            </nav>
          </aside>

          <main>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
        </div>
      </div>
    </>
  );
}
