import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import { useCategories } from "../hooks/useCategories";
import { useToast } from "../context/ToastContext";
import PageHeader from "../components/ui/PageHeader";
import ConfirmModal from "../components/ui/ConfirmModal";
import EmptyState from "../components/ui/EmptyState";
import { useCurrency } from "../hooks/useCurrency";

export default function Recurring() {
  const { format } = useCurrency();
  const toast = useToast();
  const { incomeCategories, expenseCategories } = useCategories();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({
    type: "expense",
    category: "",
    amount: "",
    description: "",
    frequency: "monthly",
    nextDate: new Date().toISOString().split("T")[0],
    isTaxDeductible: false,
  });

  const fetchItems = async () => {
    try {
      const res = await apiClient.get("/recurring");
      setItems(res.data.data || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post("/recurring", {
        ...form,
        amount: Number(form.amount),
      });
      toast.success("Recurring transaction created");
      setForm({
        type: "expense",
        category: "",
        amount: "",
        description: "",
        frequency: "monthly",
        nextDate: new Date().toISOString().split("T")[0],
        isTaxDeductible: false,
      });
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create");
    }
  };

  const handleProcess = async () => {
    try {
      const res = await apiClient.post("/recurring/process");
      toast.success(res.data.message);
      fetchItems();
    } catch {
      toast.error("Processing failed");
    }
  };

  const handleDelete = async () => {
    try {
      await apiClient.delete(`/recurring/${deleteId}`);
      toast.success("Deleted");
      setDeleteId(null);
      fetchItems();
    } catch {
      toast.error("Delete failed");
    }
  };

  const categories =
    form.type === "income" ? incomeCategories : expenseCategories;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Recurring Transactions"
        subtitle="Automate salary, rent, and subscription entries"
        action={
          <button
            onClick={handleProcess}
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Process Due Now
          </button>
        }
      />

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <select
            value={form.type}
            onChange={(e) =>
              setForm({ ...form, type: e.target.value, category: "" })
            }
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
          >
            <option value="">Category</option>
            {categories.map((c) => (
              <option key={c._id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            required
            min="1"
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
          />
          <select
            value={form.frequency}
            onChange={(e) => setForm({ ...form, frequency: e.target.value })}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <input
            type="date"
            value={form.nextDate}
            onChange={(e) => setForm({ ...form, nextDate: e.target.value })}
            required
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
          />
          <input
            type="text"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
          />
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={form.isTaxDeductible}
            onChange={(e) =>
              setForm({ ...form, isTaxDeductible: e.target.checked })
            }
          />
          Tax deductible expense
        </label>
        <button
          type="submit"
          className="mt-4 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Add Recurring
        </button>
      </form>

      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : items.length === 0 ? (
        <EmptyState
          title="No recurring transactions"
          description="Set up salary, rent, or subscriptions to automate tracking."
        />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item._id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4"
            >
              <div>
                <p className="font-semibold text-slate-800">
                  {item.category} — {format(item.amount)}
                </p>
                <p className="text-sm text-slate-500">
                  {item.type} · {item.frequency} · Next:{" "}
                  {new Date(item.nextDate).toLocaleDateString()}
                  {item.isTaxDeductible && " · Tax deductible"}
                </p>
              </div>
              <button
                onClick={() => setDeleteId(item._id)}
                className="text-sm text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!deleteId}
        title="Delete Recurring Transaction"
        message="This will stop future automatic entries."
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
