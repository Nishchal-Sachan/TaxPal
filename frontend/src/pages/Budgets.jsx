import { useEffect, useState, useCallback } from "react";
import apiClient from "../api/apiClient";
import BudgetForm from "../components/budget/BudgetForm";
import BudgetList from "../components/budget/BudgetList";
import SpendingChart from "../components/charts/SpendingChart";
import PageHeader from "../components/ui/PageHeader";
import ConfirmModal from "../components/ui/ConfirmModal";
import { useToast } from "../context/ToastContext";

export default function Budgets() {
  const toast = useToast();
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBudget, setEditingBudget] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const fetchProgress = useCallback(
    async (month) => {
      const m = month ?? selectedMonth;
      try {
        setLoading(true);
        const res = await apiClient.get(`/budgets/progress?month=${m}`);
        setProgressData(res.data.data || []);
      } catch {
        setProgressData([]);
      } finally {
        setLoading(false);
      }
    },
    [selectedMonth]
  );

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const handleDelete = async () => {
    try {
      await apiClient.delete(`/budgets/${deleteId}`);
      toast.success("Budget deleted");
      setDeleteId(null);
      fetchProgress();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Budgets"
        subtitle="Set spending limits and track progress by category"
        action={
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
          />
        }
      />

      <SpendingChart progress={progressData} month={selectedMonth} loading={loading} />

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

      <BudgetList
        progress={progressData}
        loading={loading}
        onEdit={(item) => setEditingBudget(item)}
        onDelete={(id) => setDeleteId(id)}
      />

      <ConfirmModal
        open={!!deleteId}
        title="Delete Budget"
        message="Are you sure you want to delete this budget?"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
