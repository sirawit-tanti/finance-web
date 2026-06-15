import { ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

function Forbidden() {
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
        <ShieldAlert
          size={64}
          style={{ marginBottom: 16, color: "var(--danger)" }}
        />
        <h1>403</h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: 24 }}>
          You do not have permission to access this page.
        </p>
        <Link to="/dashboard" className="btn btn-primary">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default Forbidden;
