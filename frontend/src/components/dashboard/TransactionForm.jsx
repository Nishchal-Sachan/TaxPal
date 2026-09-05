import { useState } from "react";
import apiClient from "../../api/apiClient";
import { useCategories } from "../../hooks/useCategories";

const TransactionForm = ({ onSuccess }) => {
  const { incomeCategories, expenseCategories } = useCategories();
  const [formData, setFormData] = useState({
    type: "income",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    isTaxDeductible: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: type === "checkbox" ? checked : value };
      if (name === "type") next.category = "";
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await apiClient.post("/transactions", {
        type: formData.type,
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: formData.date,
        description: formData.description,
        isTaxDeductible: formData.isTaxDeductible,
      });

      setFormData({
        type: "income",
        amount: "",
        category: "",
        date: new Date().toISOString().split("T")[0],
        description: "",
        isTaxDeductible: false,
      });

      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-slate-800">Add Transaction</h2>

      {error && (
        <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <select name="type" value={formData.type} onChange={handleChange} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm">
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <input type="number" name="amount" value={formData.amount} onChange={handleChange} step="0.01" min="0" required placeholder="Amount" className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm" />
          <select name="category" value={formData.category} onChange={handleChange} required className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm">
            <option value="">Select category</option>
            {(formData.type === "income" ? incomeCategories : expenseCategories).map((cat) => (
              <option key={cat._id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm" />
          <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Description (optional)" className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm md:col-span-2" />
        </div>
        {formData.type === "expense" && (
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" name="isTaxDeductible" checked={formData.isTaxDeductible} onChange={handleChange} />
            Tax deductible expense
          </label>
        )}
        <button type="submit" disabled={loading} className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60">
          {loading ? "Adding..." : "Add Transaction"}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
