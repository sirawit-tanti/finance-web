import { useEffect, useState } from "react";
import { Plus, Tags } from "lucide-react";
import Layout from "../components/Layout";
import CardHeader from "../components/CardHeader";
import FilterToolbar from "../components/FilterToolbar";
import Pagination from "../components/Pagination";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  exportCategories,
} from "../services/categoryService";
import { getPaginationMeta } from "../utils/pagination";
import toast from "react-hot-toast";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    loadCategories();
  }, [search, page, perPage]);

  async function loadCategories() {
    try {
      const data = await getCategories({ search, page, per_page: perPage });

      setCategories(data.data);
      setMeta(getPaginationMeta(data));
    } catch (error) {
      console.log(error.response?.data);
      toast.error("Load categories failed");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      if (editingId === null) {
        await createCategory({ name });
        toast.success("Category created");
      } else {
        await updateCategory(editingId, { name });
        toast.success("Category updated");
      }

      setName("");
      setEditingId(null);
      setPage(1);
      await loadCategories();
    } catch (error) {
      console.log(error.response?.data);
      toast.error(error.response?.data?.message || "Save category failed");
    }
  }

  function handleEdit(category) {
    setEditingId(category.id);
    setName(category.name);
  }

  function handleCancelEdit() {
    setEditingId(null);
    setName("");
  }

  async function handleDelete(categoryId) {
    if (!confirm("Delete this category?")) {
      return;
    }

    try {
      await deleteCategory(categoryId);

      toast.success("Category deleted");
      await loadCategories();
    } catch (error) {
      console.log(error.response?.data);
      toast.error(error.response?.data?.message || "Delete category failed");
    }
  }

  async function handleExportCsv() {
    try {
      const blob = await exportCategories();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "categories.csv";

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Export categories success");
    } catch (error) {
      console.log(error.response?.data);
      toast.error("Export categories failed");
    }
  }

  return (
    <Layout title="Categories" subtitle="Manage transaction categories">
      <form
        onSubmit={handleSubmit}
        className="card"
        style={{ marginBottom: 20 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 16,
          }}
        >
          <Plus size={16} color="var(--accent)" />

          <div className="section-title" style={{ marginBottom: 0 }}>
            {editingId === null ? "Create Category" : "Edit Category"}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto auto",
            gap: 12,
            alignItems: "center",
          }}
        >
          <input
            className="form-input"
            type="text"
            placeholder="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {editingId !== null && (
            <button type="button" className="btn" onClick={handleCancelEdit}>
              Cancel
            </button>
          )}

          <button className="btn btn-primary" type="submit">
            {editingId === null ? "Create Category" : "Update Category"}
          </button>
        </div>
      </form>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <CardHeader title="All Categories">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleExportCsv}
          >
            Export CSV
          </button>
        </CardHeader>

        <FilterToolbar>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "var(--text-muted)",
              fontSize: 13,
            }}
          >
            <Tags size={16} />
            Search
          </div>

          <input
            className="form-input"
            type="text"
            placeholder="Search category..."
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
              setPage(1);
            }}
          >
            Clear
          </button>
        </FilterToolbar>

        {categories.length === 0 ? (
          <div className="empty-state">No categories found.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Created At</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>

              <tbody>
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td
                      style={{
                        color: "var(--text-muted)",
                        fontVariantNumeric: "tabular-nums",
                        fontSize: 12,
                      }}
                    >
                      #{category.id}
                    </td>

                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            background: "var(--accent-subtle)",
                            color: "var(--accent)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <Tags size={14} />
                        </div>

                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: 13,
                            color: "var(--text-primary)",
                          }}
                        >
                          {category.name}
                        </div>
                      </div>
                    </td>

                    <td
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: 13,
                      }}
                    >
                      {new Date(category.created_at).toLocaleString()}
                    </td>

                    <td style={{ textAlign: "right" }}>
                      <div
                        style={{
                          display: "inline-flex",
                          gap: 8,
                        }}
                      >
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => handleEdit(category)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="btn btn-danger-ghost"
                          onClick={() => handleDelete(category.id)}
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

export default Categories;
