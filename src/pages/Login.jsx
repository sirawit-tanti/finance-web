import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { useTheme } from "../components/ThemeContext";

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
      <button
        onClick={toggle}
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          background: "var(--bg-surface)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-md)",
          padding: "8px 14px",
          color: "var(--text-secondary)",
          cursor: "pointer",
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        {dark ? "☀ Light" : "◑ Dark"}
      </button>

      <form onSubmit={handleSubmit} className="login-card">
        <div className="login-logo">F</div>
        <h1>Welcome back</h1>
        <p>Sign in to your finance dashboard</p>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            className="form-input"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group" style={{ marginBottom: 24 }}>
          <label className="form-label">Password</label>
          <input
            className="form-input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: "100%", padding: "12px" }}
        >
          Sign in
        </button>
      </form>
    </div>
  );
}

export default Login;
