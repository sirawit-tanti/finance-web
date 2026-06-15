import { SearchX } from "lucide-react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        className="card"
        style={{ maxWidth: 500, width: "100%", textAlign: "center" }}
      >
        <SearchX
          size={64}
          style={{ marginBottom: 16, color: "var(--accent)" }}
        />

        <h1>404</h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>
          The page you are looking for does not exist.
        </p>

        <Link to="/dashboard" className="btn btn-primary">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
