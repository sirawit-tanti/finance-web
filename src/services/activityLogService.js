import api from "./api";

export async function getActivityLogs(params = {}) {
  const response = await api.get("/activity-logs", { params });

  return response.data;
}

export async function exportActivityLogs() {
  const response = await api.get("/activity-logs/export", {
    responseType: "blob",
  });

  return response.data;
}
