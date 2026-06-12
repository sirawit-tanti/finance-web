import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getUsers, updateUserRole } from "../services/adminService";
import toast from "react-hot-toast";

function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const data = await getUsers();

      setUsers(data.data);
    } catch (error) {
      console.log(error.response?.data);
    }
  }

  async function handleChangeRole(userId, role) {
    try {
      await updateUserRole(userId, role);

      toast.success("Role updated");

      await loadUsers();
    } catch (error) {
      console.log(error.response?.data);
      toast.error("Update role failed");
    }
  }

  return (
    <Layout title="Admin Users" subtitle="Manage system users">
      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleChangeRole(user.id, e.target.value)}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default AdminUsers;
