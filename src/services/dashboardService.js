import api from "./api";

export async function getDashboard() {
  const response = await api.get("/dashboard");

  return response.data;
}

export async function getMonthlyDashboard() {
  const response = await api.get("/dashboard/monthly");

  return response.data;
}

export async function getRecentTransactions() {
  const response = await api.get("/transaction", {
    params: {
      per_page: 5,
    },
  });

  return response.data;
}
