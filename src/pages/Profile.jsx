import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getMe } from "../services/userService";
import { User, Mail, Hash, Shield } from "lucide-react";

function ProfileField({ icon: Icon, label, value }) {
  return (
    <div className="profile-field">
      <div className="profile-field-label">{label}</div>
      <div
        style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}
      >
        <Icon size={14} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
        <span className="profile-field-value">{value}</span>
      </div>
    </div>
  );
}

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const data = await getMe();
      setUser(data);
    } catch (error) {
      console.log(error.response?.data);
    }
  }

  if (!user) {
    return (
      <Layout title="Profile" subtitle="Your account information">
        <div
          style={{
            color: "var(--text-muted)",
            padding: "64px 0",
            textAlign: "center",
            fontSize: 13,
          }}
        >
          Loading…
        </div>
      </Layout>
    );
  }

  const initials = user.name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Layout title="Profile" subtitle="Your account information">
      <div style={{ maxWidth: 480 }}>
        <div className="card" style={{ marginBottom: 14 }}>
          {/* Avatar + name header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              paddingBottom: 20,
              marginBottom: 4,
              borderBottom: "1px solid var(--border)",
            }}
          >
            <div className="profile-avatar">{initials}</div>
            <div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  letterSpacing: "-0.3px",
                }}
              >
                {user.name}
              </div>
              <div
                style={{
                  fontSize: 12.5,
                  color: "var(--text-muted)",
                  marginTop: 2,
                }}
              >
                {user.role === "admin" ? "Administrator" : "Member"}
              </div>
            </div>
            {user.role === "admin" && (
              <span
                style={{
                  marginLeft: "auto",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "3px 10px",
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 600,
                  background: "var(--accent-subtle)",
                  color: "var(--accent)",
                }}
              >
                <Shield size={11} />
                Admin
              </span>
            )}
          </div>

          <ProfileField icon={User} label="Full Name" value={user.name} />
          <ProfileField icon={Mail} label="Email Address" value={user.email} />
          <ProfileField icon={Hash} label="User ID" value={`#${user.id}`} />
          <ProfileField
            icon={Shield}
            label="Role"
            value={user.role ?? "user"}
          />
        </div>
      </div>
    </Layout>
  );
}

export default Profile;
