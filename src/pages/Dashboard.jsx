import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import {
  getDashboard,
  getMonthlyDashboard,
  getRecentTransactions,
} from "../services/dashboardService";
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

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [monthly, setMonthly] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const data = await getDashboard();
      const monthlyData = await getMonthlyDashboard();
      const recentData = await getRecentTransactions();

      setDashboard(data);
      setMonthly(monthlyData);
      setRecentTransactions(recentData.data);
    } catch (error) {
      console.log(error.response?.data);
      toast.error("โหลด Dashboard ไม่สำเร็จ");
    }
  }

  if (!dashboard) {
    return (
      <Layout
        title="Dashboard"
        subtitle="Overview of your income, expense and balance"
      >
        <div
          style={{
            color: "var(--text-muted)",
            padding: "48px 0",
            textAlign: "center",
          }}
        >
          Loading…
        </div>
      </Layout>
    );
  }

  const chartData = [
    {
      name: "Income",
      value: Number(formatCurrency(dashboard.income) || 0),
    },
    {
      name: "Expense",
      value: Number(formatCurrency(dashboard.expense) || 0),
    },
  ];

  return (
    <Layout
      title="Dashboard"
      subtitle="Overview of your income, expense and balance"
    >
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon income">💚</div>
          <div className="stat-label">Total Income</div>
          <div className="stat-value income">
            {formatCurrency(dashboard.income)}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon expense">💛</div>
          <div className="stat-label">Total Expense</div>
          <div className="stat-value expense">
            {formatCurrency(dashboard.expense)}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon balance">💜</div>
          <div className="stat-label">Net Balance</div>
          <div className="stat-value balance">
            {formatCurrency(dashboard.balance)}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold">Income vs Expense</h2>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={120}
                  label
                >
                  <Cell fill="#22c55e" />
                  <Cell fill="#f59e0b" />
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold">Monthly Income / Expense</h2>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />

                <Bar dataKey="income" fill="#22c55e" />
                <Bar dataKey="expense" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold">Recent Transactions</h2>

        <div className="space-y-3">
          {recentTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between rounded-2xl bg-slate-50 p-4"
            >
              <div>
                <p className="font-semibold">{transaction.title}</p>

                <p className="text-sm text-slate-500">
                  {transaction.category?.name}
                </p>
              </div>

              <p>{formatCurrency(transaction.amount)}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
