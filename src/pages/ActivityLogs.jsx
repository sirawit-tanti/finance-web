import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import {
  getActivityLogs,
  exportActivityLogs,
} from "../services/activityLogService";
import toast from "react-hot-toast";
import CardHeader from "../components/CardHeader";
import Pagination from "../components/Pagination";
import { getPaginationMeta } from "../utils/pagination";

const ACTION_STYLES = {
  create: { bg: "rgba(22,163,74,0.09)", color: "#16a34a" },
  created: { bg: "rgba(22,163,74,0.09)", color: "#16a34a" },
  update: { bg: "rgba(91,94,244,0.09)", color: "#5b5ef4" },
  updated: { bg: "rgba(91,94,244,0.09)", color: "#5b5ef4" },
  delete: { bg: "rgba(220,38,38,0.09)", color: "#dc2626" },
  deleted: { bg: "rgba(220,38,38,0.09)", color: "#dc2626" },
};

function ActionBadge({ action }) {
  const style = ACTION_STYLES[action?.toLowerCase()] ?? {
    bg: "var(--bg-surface-2)",
    color: "var(--text-secondary)",
  };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 8px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 600,
        background: style.bg,
        color: style.color,
      }}
    >
      {action}
    </span>
  );
}

function ActivityLogs() {
  const [logs, setLogs] = useState([]);

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    loadActivityLogs();
  }, [page, perPage]);

  async function loadActivityLogs() {
    try {
      const data = await getActivityLogs({ page, per_page: perPage });
      setLogs(data.data);
      setMeta(getPaginationMeta(data));
    } catch (error) {
      console.log(error.response?.data);
      alert("Load activity logs failed");
    }
  }

  function renderLogDetails(log) {
    const properties = log.properties;
    if (!properties)
      return <span style={{ color: "var(--text-muted)" }}>�</span>;

    if (log.action === "updated") {
      return (
        <div className="log-details">
          <div>
            <strong>Before:</strong> {properties.before?.title} /{" "}
            {properties.before?.amount} / {properties.before?.type}
          </div>
          <div>
            <strong>After:</strong> {properties.after?.title} /{" "}
            {properties.after?.amount} / {properties.after?.type}
          </div>
        </div>
      );
    }

    return (
      <div className="log-details">
        <div>
          <strong>Title:</strong> {properties.title}
        </div>
        <div>
          <strong>Amount:</strong> {properties.amount}
        </div>
        <div>
          <strong>Type:</strong> {properties.type}
        </div>
      </div>
    );
  }

  async function handleExportActivityLogsCsv() {
    try {
      const blob = await exportActivityLogs();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "activity_logs.csv";

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Export activity logs success");
    } catch (error) {
      console.log(error.response?.data);
      toast.error("Export activity logs failed");
    }
  }

  return (
    <Layout title="Activity Logs" subtitle="Audit trail of all changes">
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <CardHeader title="Recent Activity">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleExportActivityLogsCsv}
          >
            Export CSV
          </button>
        </CardHeader>

        {logs.length === 0 ? (
          <div className="empty-state">No activity logs found.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Action</th>
                  <th>Model</th>
                  <th>Description</th>
                  <th>Details</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td
                      style={{
                        color: "var(--text-muted)",
                        fontVariantNumeric: "tabular-nums",
                        fontSize: 12,
                      }}
                    >
                      {log.id}
                    </td>
                    <td>
                      <ActionBadge action={log.action} />
                    </td>
                    <td style={{ fontWeight: 500 }}>{log.model}</td>
                    <td
                      style={{
                        color: "var(--text-secondary)",
                        maxWidth: 260,
                        fontSize: 12.5,
                      }}
                    >
                      {log.description}
                    </td>
                    <td>{renderLogDetails(log)}</td>
                    <td
                      style={{
                        color: "var(--text-muted)",
                        fontSize: 12,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {log.created_at}
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

export default ActivityLogs;
