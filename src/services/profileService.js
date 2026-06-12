import api from "./api";

export async function changePassword(payload) {
  const response = await api.post("/change-password", payload);

  return response.data;
}
