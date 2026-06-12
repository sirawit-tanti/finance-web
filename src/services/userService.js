import api from "./api";

export async function getMe() {
  const response = await api.get("/me");

  return response.data;
}
