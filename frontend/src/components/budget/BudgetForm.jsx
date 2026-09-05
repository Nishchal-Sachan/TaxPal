import { useEffect, useState } from "react";
import apiClient from "../../api/apiClient";
import { useCategories } from "../../hooks/useCategories";

export default function BudgetForm({
  onBudgetAdded,
  onBudgetUpdated,
  editData,
  clearEdit,
}) {
  const { expenseCategories } = useCategories();
  const [formData, setFormData] = useState({
    category: "",
    limit: "",
    month: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setFormData({
        category: editData.category,
        limit: editData.limit,
        month: editData.month,
      });
    }
  }, [editData]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleReset = () => {
    setFormData({ category: "", limit: "", month: "" });
    if (editData) clearEdit();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        category: formData.category,
        limit: Number(formData.limit),
        month: formData.month,
      };

      if (editData) {
        await apiClient.put(`/budgets/${editData._id}`, payload);
        onBudgetUpdated?.(payload.month);
      } else {
        await apiClient.post("/budgets", payload);
        onBudgetAdded?.(payload.month);
      }

      handleReset();
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-5 text-lg font-semibold text-slate-900">
        {editData ? "Update Budget" : "Create New Budget"}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="">Select a category</option>
              {[
                ...expenseCategories,
                ...(formData.category &&
                !expenseCategories.some((c) => c.name === formData.category)
                  ? [{ _id: "legacy", name: formData.category }]
                  : []),
              ].map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Budget Amount
            </label>
            <input
              type="number"
              name="limit"
              value={formData.limit}
              onChange={handleChange}
              required
              min="1"
              placeholder="0"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        <div className="sm:w-1/2">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Month
          </label>
          <input
            type="month"
            name="month"
            value={formData.month}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading
              ? "Processing..."
              : editData
                ? "Update Budget"
                : "Create Budget"}
          </button>
        </div>
      </form>
    </div>
  );
}
