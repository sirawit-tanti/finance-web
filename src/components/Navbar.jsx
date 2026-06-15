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
  LockKeyhole,
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
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/transactions", label: "Transactions", icon: ArrowLeftRight },
    { to: "/activity-logs", label: "Activity Logs", icon: History },
    { to: "/profile", label: "Profile", icon: User },
    { to: "/change-password", label: "Change Password", icon: LockKeyhole },
  ];

  if (user?.role === "admin") {
    navItems.push({ to: "/admin/users", label: "Users", icon: Users });
  }

  return (
    <nav className="sidebar-nav">
      <div className="sidebar-section-label">Menu</div>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.to;
        return (
          <Link key={item.to} to={item.to} className={isActive ? "active" : ""}>
            <span className="nav-icon">
              <Icon size={16} strokeWidth={isActive ? 2.2 : 1.8} />
            </span>
            {item.label}
          </Link>
        );
      })}

      <div style={{ flex: 1 }} />

      <div className="sidebar-footer">
        <button className="theme-toggle" onClick={toggle}>
          <span className="nav-icon">
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </span>
          <span>{dark ? "Light mode" : "Dark mode"}</span>
          <div className={`toggle-pill ${dark ? "active" : ""}`}>
            <div className="toggle-thumb" />
          </div>
        </button>

        <button className="sidebar-nav-btn danger" onClick={handleLogout}>
          <span className="nav-icon">
            <LogOut size={15} />
          </span>
          Sign out
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
