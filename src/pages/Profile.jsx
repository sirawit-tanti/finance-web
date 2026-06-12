import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getMe } from "../services/userService";

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
        Loading...
      </Layout>
    );
  }

  return (
    <Layout title="Profile" subtitle="Your account information">
      <div className="card">
        <h2 className="section-title">Account</h2>

        <div style={{ marginTop: 16 }}>
          <p>
            <strong>Name:</strong> {user.name}
          </p>

          <p>
            <strong>Email:</strong> {user.email}
          </p>

          <p>
            <strong>User ID:</strong> {user.id}
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default Profile;
