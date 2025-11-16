// src/App.jsx
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useState, useEffect, useRef } from "react";
import api from "./api/axios"; // axios instance used elsewhere

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
          <div style={{ padding: "8px 12px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
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

/* helper: check if date is same local day */
function isSameLocalDay(isoDate) {
  if (!isoDate) return false;
  const d = new Date(isoDate);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
}

export default function App() {
  const navigate = useNavigate();
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  }

  // --- Paap ka Ghada count state ---
  const [paapCount, setPaapCount] = useState(0);
  const [pulse, setPulse] = useState(false);
  const prevCountRef = useRef(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    async function fetchCount() {
      try {
        const res = await api.get("/api/tasks");
        if (!mountedRef.current) return;
        const tasks = res.data.tasks || [];
        const count = tasks.filter(t => !isSameLocalDay(t.createdAt) && t.status !== "completed").length;

        // trigger pulse when count increases
        if (count > prevCountRef.current) {
          setPulse(true);
          // auto-clear pulse shortly after
          setTimeout(() => setPulse(false), 650);
        }

        prevCountRef.current = count;
        setPaapCount(count);
      } catch (err) {
        // silent fail
        console.error("Paap count fetch error:", err);
      }
    }

    // initial fetch
    fetchCount();
    // poll every 45 seconds
    const id = setInterval(fetchCount, 45000);
    return () => { mountedRef.current = false; clearInterval(id); };
  }, []);

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

            {/* Paap ka Ghada pot placed under the Workspace nav inside the sidebar.
                Purpose: visually distinct reminder showing only the numeric count of older undone tasks.
                This is intentionally simple — no actions, no task details. */}
            <div className={`paap-pot ${pulse ? 'pulse' : ''}`} title="Paap ka Ghada — pending tasks from previous days">
              <div className="paap-label">Paap ka Ghada</div>
              <div className="paap-count" aria-hidden>{paapCount}</div>
              <div className="paap-sub">old undone</div>
            </div>
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
