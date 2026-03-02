import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import BudgetForm from "../components/budget/BudgetForm";
import BudgetList from "../components/budget/BudgetList";
import SpendingChart from "../components/charts/SpendingChart";

export default function Budgets() {
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7),
  );

  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBudget, setEditingBudget] = useState(null);

  const fetchProgress = async (month) => {
    const m = month ?? selectedMonth;
    try {
      setLoading(true);

      const res = await apiClient.get(
        `/budgets/progress?month=${m}`,
      );

      const progress = res.data.data || [];
      setProgressData(progress);
    } catch (err) {
      console.error("Progress fetch failed:", err.response?.data?.message);
      setProgressData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [selectedMonth]);

  // 🔥 Delete Handler
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this budget?")) return;

    try {
      await apiClient.delete(`/budgets/${id}`);
      fetchProgress();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>Budgets</h1>

      {/* Month Selector */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ fontWeight: "600", marginRight: "10px" }}>
          Select Month:
        </label>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />
      </div>

      {/* Chart */}
      <SpendingChart progress={progressData} month={selectedMonth} loading={loading} />

      {/* Form */}
      <BudgetForm
        editData={editingBudget}
        clearEdit={() => setEditingBudget(null)}
        onBudgetAdded={(month) => {
          setSelectedMonth(month);
          fetchProgress(month);
        }}
        onBudgetUpdated={(month) => {
          setSelectedMonth(month);
          fetchProgress(month);
        }}
      />

      {/* Card List */}
      <div style={{ marginTop: "40px" }}>
        <BudgetList
          progress={progressData}
          loading={loading}
          onEdit={(item) => setEditingBudget(item)}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
