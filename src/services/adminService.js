import api from "./api";

export async function getUsers() {
  const response = await api.get("/admin/users");

  return response.data;
}

export async function updateUserRole(id, role) {
  const response = await api.patch(`/admin/users/${id}/role`, { role });

  return response.data;
}
