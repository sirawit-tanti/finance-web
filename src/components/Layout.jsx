import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import { Menu, X } from "lucide-react";

function Layout({
  children,
  title = "Finance Dashboard",
  subtitle = "Manage your money smarter",
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div className="app-shell">
      {/* Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <div className="sidebar-logo">F</div>
          <div>
            <div className="sidebar-brand-text">Finance</div>
            <div className="sidebar-brand-sub">Personal tracker</div>
          </div>
          <button
            className="sidebar-close-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={16} />
          </button>
        </div>
        <Navbar />
      </aside>

      {/* Main */}
      <main className="main-content">
        {/* Mobile topbar */}
        <div className="mobile-topbar">
          <button
            className="hamburger-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              className="sidebar-logo"
              style={{ width: 24, height: 24, fontSize: 10 }}
            >
              F
            </div>
            <span
              style={{
                fontWeight: 700,
                fontSize: 14,
                color: "var(--text-primary)",
                letterSpacing: "-0.3px",
              }}
            >
              Finance
            </span>
          </div>
          <div style={{ width: 36 }} /> {/* spacer */}
        </div>

        <div className="page-header">
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {children}
      </main>
    </div>
  );
}

export default Layout;
