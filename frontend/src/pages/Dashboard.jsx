import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import { FiPlus, FiX } from "react-icons/fi";
import OnboardingBanner from "../components/onboarding/OnboardingBanner";
import PageHeader from "../components/ui/PageHeader";
import SummaryCard from "../components/dashboard/SummaryCard";
import TransactionList from "../components/dashboard/TransactionList";
import apiClient from "../api/apiClient";
import { useCategories } from "../hooks/useCategories";
import { useCurrency } from "../hooks/useCurrency";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const getInitialFormData = () => ({
  category: "",
  amount: "",
  date: new Date().toISOString().split("T")[0],
});

export default function Dashboard() {
  const { format } = useCurrency();
  const { incomeCategories, expenseCategories } = useCategories();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [range, setRange] = useState("all");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState("income");
  const [formData, setFormData] = useState(getInitialFormData());
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get("/dashboard/summary", {
        params: { range },
      });
      setSummary(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load summary");
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const handleTransactionChange = () => {
    setRefreshTrigger((t) => t + 1);
    fetchSummary();
  };

  const openModal = (type) => {
    setTransactionType(type);
    setFormData(getInitialFormData());
    setModalError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalError("");
  };

  const handleModalChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleModalSave = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError("");
    try {
      await apiClient.post("/transactions", {
        type: transactionType,
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: formData.date,
      });
      closeModal();
      handleTransactionChange();
    } catch (err) {
      setModalError(err.response?.data?.message || "Failed to add transaction");
    } finally {
      setModalLoading(false);
    }
  };

  const totalIncome = summary?.totalIncome ?? 0;
  const totalExpense = summary?.totalExpense ?? 0;
  const netBalance = summary?.balance ?? 0;

  const barChartData = useMemo(
    () => ({
      labels: ["Income", "Expense"],
      datasets: [
        {
          label: "Amount",
          data: [totalIncome, totalExpense],
          backgroundColor: ["#10b981", "#f43f5e"],
          borderRadius: 8,
        },
      ],
    }),
    [totalIncome, totalExpense]
  );

  const expenseBreakdown = useMemo(() => {
    const transactions = summary?.last5Transactions ?? [];
    const byCategory = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => {
        const cat = t.category || "Other";
        acc[cat] = (acc[cat] || 0) + Number(t.amount);
        return acc;
      }, {});
    return {
      labels: Object.keys(byCategory),
      data: Object.values(byCategory),
    };
  }, [summary?.last5Transactions]);

  const pieChartData = useMemo(
    () => ({
      labels: expenseBreakdown.labels,
      datasets: [
        {
          data: expenseBreakdown.data,
          backgroundColor: [
            "#6366f1",
            "#10b981",
            "#f59e0b",
            "#ef4444",
            "#8b5cf6",
            "#06b6d4",
          ],
        },
      ],
    }),
    [expenseBreakdown]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-4 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your income, expenses, and recent activity"
        action={
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            >
              <option value="all">All Time</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            <button
              type="button"
              onClick={() => openModal("income")}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              <FiPlus className="h-4 w-4" />
              Add Income
            </button>
            <button
              type="button"
              onClick={() => openModal("expense")}
              className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
            >
              <FiPlus className="h-4 w-4" />
              Add Expense
            </button>
          </div>
        }
      />

      <OnboardingBanner />

      {summary?.budgetAlerts?.length > 0 && (
        <div className="space-y-2">
          {summary.budgetAlerts.map((alert) => (
            <div
              key={alert.category}
              className={`rounded-xl px-4 py-3 text-sm font-medium ${
                alert.level === "exceeded"
                  ? "border border-red-200 bg-red-50 text-red-800"
                  : "border border-amber-200 bg-amber-50 text-amber-800"
              }`}
            >
              {alert.message}
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <FiX className="h-5 w-5" />
            </button>

            <h3 className="mb-5 text-lg font-bold text-slate-900">
              Add {transactionType === "income" ? "Income" : "Expense"}
            </h3>

            {modalError && (
              <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                {modalError}
              </div>
            )}

            <form onSubmit={handleModalSave} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleModalChange}
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="">Select a category</option>
                  {(transactionType === "income"
                    ? incomeCategories
                    : expenseCategories
                  ).map((cat) => (
                    <option key={cat._id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Amount
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleModalChange}
                  step="0.01"
                  min="0"
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleModalChange}
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
                >
                  {modalLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryCard
          title="Total Income"
          value={format(totalIncome)}
          icon="↑"
          variant="income"
        />
        <SummaryCard
          title="Total Expense"
          value={format(totalExpense)}
          icon="↓"
          variant="expense"
        />
        <SummaryCard
          title="Net Balance"
          value={format(netBalance)}
          icon="="
          variant="balance"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-slate-700">
            Income vs Expense
          </h3>
          <div className="h-56">
            <Bar
              data={barChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, grid: { color: "#f1f5f9" } } },
              }}
            />
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-slate-700">
            Expense Breakdown
          </h3>
          <div className="h-56">
            {expenseBreakdown.labels.length > 0 ? (
              <Pie
                data={pieChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: "bottom" } },
                }}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                No expense data yet
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold text-slate-900">
          Recent Transactions
        </h3>
        <TransactionList
          transactions={summary?.last5Transactions || []}
          refreshTrigger={refreshTrigger}
          onTransactionChange={handleTransactionChange}
          hideTitle
          compact
        />
      </div>
    </div>
  );
}
