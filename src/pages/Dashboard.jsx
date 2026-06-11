import { useEffect, useState } from "react";
import { getDashboard } from "../services/dashboardService";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const data = await getDashboard();
      setDashboard(data);
    } catch (error) {
      console.log(error.response?.data);
      alert("โหลด Dashboard ไม่สำเร็จ");
    }
  }

  if (!dashboard) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>

      <div>
        <p>Income: {dashboard.income}</p>
        <p>Expense: {dashboard.expense}</p>
        <p>Balance: {dashboard.balance}</p>
      </div>
    </div>
  );
}

export default Dashboard;
