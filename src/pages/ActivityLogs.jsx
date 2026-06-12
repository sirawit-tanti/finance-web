import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { getActivityLogs } from "../services/activityLogService";

const ACTION_COLORS = {
  create: { bg: "rgba(16,185,129,0.1)", color: "#10b981" },
  update: { bg: "rgba(99,102,241,0.1)", color: "#6366f1" },
  delete: { bg: "rgba(239,68,68,0.1)", color: "#ef4444" },
};

function ActionBadge({ action }) {
  const style = ACTION_COLORS[action?.toLowerCase()] || {
    bg: "var(--bg-surface-hover)",
    color: "var(--text-secondary)",
  };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.3px",
        textTransform: "uppercase",
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

  useEffect(() => {
    loadActivityLogs();
  }, []);

  async function loadActivityLogs() {
    try {
      const data = await getActivityLogs();
      setLogs(data.data);
    } catch (error) {
      console.log(error.response?.data);
      alert("Load activity logs failed");
    }
  }

  function renderLogDetails(log) {
    const properties = log.properties;

    if (!properties) {
      return "-";
    }

    if (log.action === "updated") {
      return (
        <div style={{ fontSize: 13 }}>
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
      <div style={{ fontSize: 13 }}>
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

  return (
    <Layout title="Activity Logs" subtitle="Audit trail of all changes">
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "20px 24px 0" }}>
          <div className="section-title">Recent Activity</div>
        </div>

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
                      }}
                    >
                      {log.id}
                    </td>
                    <td>
                      <ActionBadge action={log.action} />
                    </td>
                    <td style={{ fontWeight: 500 }}>{log.model}</td>
                    <td
                      style={{ color: "var(--text-secondary)", maxWidth: 280 }}
                    >
                      {log.description}
                    </td>
                    <td>{renderLogDetails(log)}</td>
                    <td
                      style={{
                        color: "var(--text-muted)",
                        fontSize: 13,
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
    </Layout>
  );
}

export default ActivityLogs;
