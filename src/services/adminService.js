import api from "./api";

export async function getUsers(params = {}) {
  const response = await api.get("/admin/users", { params });

  return response.data;
}

export async function createUser(payload) {
  const response = await api.post("/admin/users", payload);

  return response.data;
}

export async function deleteUser(id) {
  const response = await api.delete(`/admin/users/${id}`);

  return response.data;
}

export async function exportUsers() {
  const response = await api.get("/admin/users/export", {
    responseType: "blob",
  });

  return response.data;
}

export async function updateUserRole(id, role) {
  const response = await api.patch(`/admin/users/${id}/role`, { role });

  return response.data;
}
