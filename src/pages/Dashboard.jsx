import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { getDashboardOverview } from "../services/dashboardService";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { formatCurrency } from "../utils/format";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [monthly, setMonthly] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [period, setPeriod] = useState("month");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, [period]);

  async function loadDashboard() {
    setLoading(true);

    try {
      const data = await getDashboardOverview({ period });

      setDashboard(data.summary);
      setMonthly(data.monthly);
      setRecentTransactions(data.recent_transactions);
    } catch (error) {
      console.log(error.response?.data);
      toast.error("โหลด Dashboard ไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Layout title="Dashboard" subtitle="Overview of your finances">
        <div className="empty-state">Loading...</div>
      </Layout>
    );
  }

  if (!dashboard) {
    return (
      <Layout title="Dashboard" subtitle="Overview of your finances">
        <div className="empty-state">No data found.</div>
      </Layout>
    );
  }

  const chartData = [
    { name: "Income", value: Number(dashboard.income || 0) },
    { name: "Expense", value: Number(dashboard.expense || 0) },
  ];

  const hasChartData = chartData.some((item) => item.value > 0);

  const CHART_COLORS = {
    income: "#16a34a",
    expense: "#dc2626",
    grid: "var(--border)",
    text: "var(--text-muted)",
  };

  const tooltipStyle = {
    background: "var(--bg-surface)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    fontSize: 12,
    color: "var(--text-primary)",
    boxShadow: "var(--shadow-md)",
  };

  return (
    <Layout
      title="Dashboard"
      subtitle="Overview of your income, expenses and balance"
    >
      <div className="card" style={{ marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div className="section-title" style={{ marginBottom: 4 }}>
              Dashboard Period
            </div>
            <div style={{ color: "var(--text-muted)", fontSize: 13 }}>
              Filter dashboard summary by date range
            </div>
          </div>

          <select
            className="form-select"
            style={{ maxWidth: 220 }}
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>
      {/* Stat cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Total Income</span>
            <div className="stat-icon income">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="stat-value income">
            {formatCurrency(dashboard.income)}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Total Expenses</span>
            <div className="stat-icon expense">
              <TrendingDown size={16} />
            </div>
          </div>
          <div className="stat-value expense">
            {formatCurrency(dashboard.expense)}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Net Balance</span>
            <div className="stat-icon balance">
              <Wallet size={16} />
            </div>
          </div>
          <div className="stat-value balance">
            {formatCurrency(dashboard.balance)}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: 14,
          marginBottom: 14,
        }}
      >
        <div className="chart-card">
          <h2>Income vs Expenses</h2>
          <div style={{ height: 240 }}>
            {hasChartData ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={90}
                    innerRadius={48}
                    paddingAngle={3}
                  >
                    <Cell fill={CHART_COLORS.income} />
                    <Cell fill={CHART_COLORS.expense} />
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state">
                No income or expense data for this period.
              </div>
            )}
          </div>
          <div
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "center",
              marginTop: 8,
            }}
          >
            {chartData.map((d, i) => (
              <div
                key={d.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12,
                  color: "var(--text-secondary)",
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background:
                      i === 0 ? CHART_COLORS.income : CHART_COLORS.expense,
                    flexShrink: 0,
                  }}
                />
                {d.name}
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <h2>Monthly Overview</h2>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly} barSize={10} barGap={4}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={CHART_COLORS.grid}
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: CHART_COLORS.text }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: CHART_COLORS.text }}
                  axisLine={false}
                  tickLine={false}
                  width={48}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  cursor={{ fill: "var(--bg-surface-hover)" }}
                />
                <Bar
                  dataKey="income"
                  fill={CHART_COLORS.income}
                  radius={[4, 4, 0, 0]}
                  name="Income"
                />
                <Bar
                  dataKey="expense"
                  fill={CHART_COLORS.expense}
                  radius={[4, 4, 0, 0]}
                  name="Expense"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div className="section-title">Recent Transactions</div>
        {recentTransactions.length === 0 ? (
          <div className="empty-state">No recent transactions.</div>
        ) : (
          <div>
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="recent-txn-row">
                <div>
                  <div className="recent-txn-title">{transaction.title}</div>
                  <div className="recent-txn-cat">
                    {transaction.category?.name}
                  </div>
                </div>
                <div
                  className="recent-txn-amount"
                  style={{
                    color:
                      transaction.type === "income"
                        ? "var(--income-color)"
                        : "var(--expense-color)",
                  }}
                >
                  {transaction.type === "income" ? "+" : "−"}
                  {formatCurrency(transaction.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Dashboard;
