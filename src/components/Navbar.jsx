import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../services/authService";
import { useTheme } from "./ThemeContext";
import {
  LayoutDashboard,
  ArrowLeftRight,
  History,
  User,
  Users,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { dark, toggle } = useTheme();
  const user = JSON.parse(localStorage.getItem("user"));

  async function handleLogout() {
    try {
      await logout();
    } catch {}
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  const navItems = [
    { to: "/profile", label: "Profile", icon: User },
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/transactions", label: "Transactions", icon: ArrowLeftRight },
    { to: "/activity-logs", label: "Activity Logs", icon: History },
  ];

  if (user?.role === "admin") {
    navItems.push({
      to: "/admin/users",
      label: "User Management",
      icon: Users,
    });
  }

  return (
    <nav className="sidebar-nav">
      {navItems.map((item) => {
        const Icon = item.icon;

        return (
          <Link
            key={item.to}
            to={item.to}
            className={location.pathname === item.to ? "active" : ""}
          >
            <Icon size={18} strokeWidth={2} />

            {item.label}
          </Link>
        );
      })}

      <div style={{ flex: 1 }} />

      <button className="theme-toggle" onClick={toggle}>
        {dark ? <Sun size={18} /> : <Moon size={18} />}
        <span>{dark ? "Light mode" : "Dark mode"}</span>
        <div style={{ marginLeft: "auto" }}>
          <div className={`toggle-pill ${dark ? "active" : ""}`}>
            <div className="toggle-thumb" />
          </div>
        </div>
      </button>

      <button className="sidebar-nav-btn danger" onClick={handleLogout}>
        <span style={{ fontSize: 15, width: 18, textAlign: "center" }}>⏻</span>
        Logout
      </button>
    </nav>
  );
}

export default Navbar;
