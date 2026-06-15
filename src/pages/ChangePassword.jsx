import { useState } from "react";
import { LockKeyhole } from "lucide-react";
import toast from "react-hot-toast";
import Layout from "../components/Layout";
import { changePassword } from "../services/profileService";

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await changePassword({
        current_password: currentPassword,
        password,
        password_confirmation: passwordConfirmation,
      });

      setCurrentPassword("");
      setPassword("");
      setPasswordConfirmation("");

      toast.success("Password changed successfully");
    } catch (error) {
      console.log(error.response?.data);
      toast.error(error.response?.data?.message || "Change password failed");
    }
  }

  return (
    <Layout
      title="Change Password"
      subtitle="Update your account security credentials"
    >
      <div className="card" style={{ maxWidth: 620 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: "var(--accent-subtle)",
              color: "var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LockKeyhole size={18} />
          </div>
          <div>
            <div className="section-title" style={{ marginBottom: 2 }}>
              Security
            </div>
            <div style={{ color: "var(--text-muted)", fontSize: 13 }}>
              Use at least 8 characters for your new password.
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gap: 14 }}>
            <input
              className="form-input"
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
              className="form-input"
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              className="form-input"
              type="password"
              placeholder="Confirm new password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button className="btn btn-primary" type="submit">
                Change Password
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default ChangePassword;
