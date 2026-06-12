import api from "./api";

export async function getActivityLogs() {
  const response = await api.get("/activity-logs");

  return response.data;
}
