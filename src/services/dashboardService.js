import api from "./api";

export async function getDashboard(params = {}) {
  const response = await api.get("/dashboard", { params });

  return response.data;
}

export async function getMonthlyDashboard(params = {}) {
  const response = await api.get("/dashboard/monthly", { params });

  return response.data;
}

export async function getRecentTransactions(params = {}) {
  const response = await api.get("/transaction", {
    params: {
      per_page: 5,
    },
  });

  return response.data;
}
