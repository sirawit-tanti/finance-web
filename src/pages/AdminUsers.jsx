import { useEffect, useState } from "react";
import {
  getUsers,
  updateUserRole,
  createUser,
  deleteUser,
  exportUsers,
} from "../services/adminService";
import { Shield, User, Plus } from "lucide-react";
import Layout from "../components/Layout";
import toast from "react-hot-toast";
import CardHeader from "../components/CardHeader";
import FilterToolbar from "../components/FilterToolbar";
import Pagination from "../components/Pagination";
import { getPaginationMeta } from "../utils/pagination";

const ROLE_STYLES = {
  admin: { bg: "var(--accent-subtle)", color: "var(--accent)", icon: Shield },
  user: {
    bg: "var(--bg-surface-2)",
    color: "var(--text-secondary)",
    icon: User,
  },
};

function RoleBadge({ role }) {
  const style = ROLE_STYLES[role] ?? ROLE_STYLES.user;
  const Icon = style.icon;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "2px 8px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 600,
        background: style.bg,
        color: style.color,
      }}
    >
      <Icon size={10} />
      {role}
    </span>
  );
}

function AdminUsers() {
  const [users, setUsers] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [searchField, setSearchField] = useState("name");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    loadUsers(search);
  }, [search, searchField, page, perPage]);

  async function loadUsers(searchValue = search) {
    try {
      const data = await getUsers({
        search: searchValue,
        field: searchField,
        page,
        per_page: perPage,
      });
      setUsers(data.data);
      setMeta(getPaginationMeta(data));
    } catch (error) {
      console.log(error.response?.data);
      toast.error("Load users failed");
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

  async function handleCreateUser(e) {
    e.preventDefault();

    try {
      await createUser({ name, email, password, role });

      setName("");
      setEmail("");
      setPassword("");
      setRole("user");

      await loadUsers();
      toast.success("User created");
    } catch (error) {
      console.log(error.response?.data);
      toast.error("Create user failed");
    }
  }

  async function handleDeleteUser(userId) {
    if (!confirm("Delete this user?")) {
      return;
    }

    try {
      await deleteUser(userId);
      toast.success("User deleted");
      await loadUsers();
    } catch (error) {
      console.log(error.response?.data);
      toast.error("Delete user failed");
    }
  }

  async function handleExportUsersCsv() {
    try {
      const blob = await exportUsers();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "users.csv";

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Export users success");
    } catch (error) {
      console.log(error.response?.data);
      toast.error("Export users failed");
    }
  }

  const initials = (name) =>
    name
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "?";

  return (
    <Layout
      title="User Management"
      subtitle="Manage roles and access for all members"
    >
      <form
        onSubmit={handleCreateUser}
        className="card"
        style={{ marginBottom: 20 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 16,
          }}
        >
          <Plus size={16} color="var(--accent)" />

          <div className="section-title" style={{ marginBottom: 0 }}>
            Create User
          </div>
        </div>

        <div className="form-grid">
          <input
            className="form-input"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="form-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="form-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <select
            className="form-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <button className="btn btn-primary" type="submit">
            Create User
          </button>
        </div>
      </form>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <CardHeader title="All Users">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleExportUsersCsv}
          >
            Export CSV
          </button>
        </CardHeader>

        <FilterToolbar>
          <select
            className="form-select"
            value={searchField}
            onChange={(e) => {
              setSearchField(e.target.value);
              setSearch("");
            }}
          >
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="role">Role</option>
          </select>

          {searchField === "role" ? (
            <select
              className="form-select"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            >
              <option value="">All roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          ) : (
            <input
              className="form-input"
              type="text"
              placeholder={
                searchField === "name"
                  ? "Search by name..."
                  : "Search by email..."
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          )}

          <button
            type="button"
            className="btn"
            onClick={() => {
              setSearchField("name");
              setSearch("");
            }}
          >
            Clear
          </button>
        </FilterToolbar>

        {users.length === 0 ? (
          <div className="empty-state">No users found.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Current Role</th>
                  <th style={{ textAlign: "right" }}>Change Role</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            background: "var(--accent-subtle)",
                            color: "var(--accent)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 11,
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {initials(user.name)}
                        </div>

                        <div>
                          <div
                            style={{
                              fontWeight: 600,
                              fontSize: 13,
                              color: "var(--text-primary)",
                            }}
                          >
                            {user.name}
                          </div>

                          <div
                            style={{
                              fontSize: 11.5,
                              color: "var(--text-muted)",
                            }}
                          >
                            #{user.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td
                      style={{ color: "var(--text-secondary)", fontSize: 13 }}
                    >
                      {user.email}
                    </td>

                    <td>
                      <RoleBadge role={user.role} />
                    </td>

                    <td style={{ textAlign: "right" }}>
                      <select
                        className="role-select"
                        value={user.role}
                        onChange={(e) =>
                          handleChangeRole(user.id, e.target.value)
                        }
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        className="btn btn-danger-ghost"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Pagination
        meta={meta}
        page={page}
        perPage={perPage}
        onPageChange={setPage}
        onPerPageChange={(value) => {
          setPerPage(value);
          setPage(1);
        }}
      />
    </Layout>
  );
}

export default AdminUsers;
