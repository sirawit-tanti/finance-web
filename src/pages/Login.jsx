import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { useTheme } from "../components/ThemeContext";
import { Moon, Sun } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const { dark, toggle } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const data = await login(email, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (error) {
      console.log(error.response?.data);
      alert("Login failed");
    }
  }

  return (
    <div className="login-page">
      {/* Theme toggle */}
      <button
        onClick={toggle}
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--r-md)",
          padding: "6px 12px",
          color: "var(--text-secondary)",
          cursor: "pointer",
          fontSize: 12,
          fontWeight: 600,
          fontFamily: "inherit",
          boxShadow: "var(--shadow-xs)",
          transition: "all var(--ease)",
        }}
      >
        {dark ? <Sun size={13} /> : <Moon size={13} />}
        {dark ? "Light" : "Dark"}
      </button>

      <form onSubmit={handleSubmit} className="login-card">
        <div className="login-logo">F</div>
        <h1>Welcome back</h1>
        <p className="login-sub">Sign in to your finance dashboard</p>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            className="form-input"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group" style={{ marginBottom: 20 }}>
          <label className="form-label">Password</label>
          <input
            className="form-input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "10px" }}>
          Sign in
        </button>
      </form>
    </div>
  );
}

export default Login;
