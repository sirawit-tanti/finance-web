import api from "./api";

export async function getTransactions(params = {}) {
  const response = await api.get("/transaction", {
    params,
  });

  return response.data;
}

export async function createTransaction(payload) {
  const response = await api.post("/transaction", payload);

  return response.data;
}

export async function updateTransaction(id, payload) {
  const response = await api.put(`/transaction/${id}`, payload);

  return response.data;
}

export async function deleteTransaction(id) {
  const response = await api.delete(`/transaction/${id}`);

  return response.data;
}

export async function exportTransaction() {
  const response = await api.get("/transaction/export", {
    responseType: "blob",
  });

  return response.data;
}
