import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getTransactions,
  createTransaction,
  deleteTransaction,
  updateTransaction,
  exportTransaction,
} from "../services/transactionService";
import { getCategories } from "../services/categoryService";
import Layout from "../components/Layout";
import { formatCurrency } from "../utils/format";
import { Search, Download } from "lucide-react";
import CardHeader from "../components/CardHeader";
import FilterToolbar from "../components/FilterToolbar";
import Pagination from "../components/Pagination";
import { getPaginationMeta } from "../utils/pagination";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [editingId, setEditingId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    loadTransactions();
    loadCategories();
  }, [page, search, filterType, perPage]);

  async function loadTransactions() {
    try {
      const data = await getTransactions({
        search,
        type: filterType,
        page,
        per_page: perPage,
      });
      setTransactions(data.data);
      setMeta(getPaginationMeta(data));
    } catch (error) {
      console.log(error.response?.data);
    }
  }

  async function loadCategories() {
    try {
      const data = await getCategories();
      setCategories(data.data);
    } catch (error) {
      console.log(error.response?.data);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = { title, amount, type, category_id: Number(categoryId) };
    try {
      if (editingId === null) {
        await createTransaction(payload);
        toast.success("Transaction added");
      } else {
        await updateTransaction(editingId, payload);
        toast.success("Transaction updated");
      }
      resetForm();
      await loadTransactions();
      await loadCategories();
    } catch (error) {
      console.log(error.response?.data);
      toast.error(editingId === null ? "Add failed" : "Update failed");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this transaction?")) return;
    try {
      await deleteTransaction(id);
      await loadTransactions();
      await loadCategories();
      toast.success("Delete success");
    } catch (error) {
      console.log(error.response?.data);
      toast.error("Delete failed");
    }
  }

  function handleEdit(transaction) {
    setEditingId(transaction.id);
    setTitle(transaction.title);
    setAmount(formatCurrency(transaction.amount));
    setType(transaction.type);
    setCategoryId(transaction.category.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setAmount("");
    setType("expense");
    setCategoryId("");
  }

  async function handleExportCsv() {
    try {
      const blob = await exportTransaction();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "transations.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error.response?.data);
      toast.error("Export CSV failed");
    }
  }

  return (
    <Layout
      title="Transactions"
      subtitle="Add, edit and manage your transactions"
    >
      {/* Form card */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="section-title" style={{ marginBottom: 16 }}>
          {editingId ? "Edit Transaction" : "New Transaction"}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Title</label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g. Coffee, Salary…"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Amount</label>
              <input
                className="form-input"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
              >
                <option value="">Select category…</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Type</label>
              <div className="type-toggle">
                <button
                  type="button"
                  className={`type-btn ${type === "income" ? "active-income" : ""}`}
                  onClick={() => setType("income")}
                >
                  ↑ Income
                </button>
                <button
                  type="button"
                  className={`type-btn ${type === "expense" ? "active-expense" : ""}`}
                  onClick={() => setType("expense")}
                >
                  ↓ Expense
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button type="submit" className="btn btn-primary">
              {editingId ? "Update" : "Save Transaction"}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Table card */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <CardHeader title="All Transactions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleExportCsv}
          >
            Export CSV
          </button>
        </CardHeader>

        <FilterToolbar>
          <select
            className="form-select"
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <input
            className="form-input"
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <button
            type="button"
            className="btn"
            onClick={() => {
              setSearch("");
              setFilterType("");
              setPage(1);
            }}
          >
            Clear
          </button>
        </FilterToolbar>
        {transactions.length === 0 ? (
          <div className="empty-state">
            No transactions yet — add one above.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Amount</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 500 }}>{t.title}</td>
                    <td
                      style={{
                        fontVariantNumeric: "tabular-nums",
                        fontWeight: 600,
                        color:
                          t.type === "income"
                            ? "var(--income-color)"
                            : "var(--expense-color)",
                      }}
                    >
                      {t.type === "income" ? "+" : "−"}
                      {formatCurrency(t.amount)}
                    </td>
                    <td>
                      <span className={`badge badge-${t.type}`}>{t.type}</span>
                    </td>
                    <td style={{ color: "var(--text-secondary)" }}>
                      {t.category?.name}
                    </td>
                    <td>
                      <div
                        className="table-actions"
                        style={{ justifyContent: "flex-end" }}
                      >
                        <button
                          className="btn btn-sm btn-icon-edit"
                          onClick={() => handleEdit(t)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger-ghost"
                          onClick={() => handleDelete(t.id)}
                        >
                          Delete
                        </button>
                      </div>
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

export default Transactions;
