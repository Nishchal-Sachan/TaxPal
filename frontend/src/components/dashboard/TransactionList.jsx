import { useState, useEffect, useCallback } from "react";
import apiClient from "../../api/apiClient";
import { useCategories } from "../../hooks/useCategories";
import { useCurrency } from "../../hooks/useCurrency";
import { useToast } from "../../context/ToastContext";
import ConfirmModal from "../ui/ConfirmModal";

const TransactionList = ({
  refreshTrigger,
  onTransactionChange,
  hideTitle,
  compact = false,
  transactions: propTransactions,
}) => {
  const { format } = useCurrency();
  const toast = useToast();
  const { incomeCategories, expenseCategories } = useCategories();
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(!compact);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    search: "",
    type: "",
    category: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ amount: "", category: "", date: "", description: "", isTaxDeductible: false });
  const [deleteId, setDeleteId] = useState(null);

  const fetchTransactions = useCallback(async () => {
    if (compact && propTransactions) {
      setTransactions(propTransactions);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get("/transactions", { params: filters });
      setTransactions(response.data.data.data || []);
      setPagination(response.data.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }, [compact, propTransactions, filters]);

  useEffect(() => {
    fetchTransactions();
  }, [refreshTrigger, fetchTransactions]);

  useEffect(() => {
    if (compact && propTransactions) {
      setTransactions(propTransactions);
    }
  }, [compact, propTransactions]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.put(`/transactions/${editingId}`, {
        amount: parseFloat(editForm.amount),
        category: editForm.category,
        date: editForm.date,
        description: editForm.description,
        isTaxDeductible: editForm.isTaxDeductible,
      });
      setEditingId(null);
      fetchTransactions();
      onTransactionChange?.();
      toast.success("Transaction updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const handleDelete = async () => {
    try {
      await apiClient.delete(`/transactions/${deleteId}`);
      setDeleteId(null);
      fetchTransactions();
      onTransactionChange?.();
      toast.success("Transaction deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {!hideTitle && <h2 className="mb-4 text-lg font-semibold">Transactions</h2>}
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {!hideTitle && (
        <h2 className="mb-4 text-lg font-semibold text-slate-800">Transactions</h2>
      )}

      {!compact && (
        <div className="mb-4 grid gap-3 sm:grid-cols-4">
          <input
            placeholder="Search..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value, page: 1 })}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <button
            onClick={() => fetchTransactions()}
            className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
          >
            Apply Filters
          </button>
        </div>
      )}

      {transactions.length === 0 ? (
        <p className="py-8 text-center text-slate-500">No transactions yet.</p>
      ) : (
        <div className="space-y-2">
          {transactions.map((transaction) => (
            <div
              key={transaction._id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 p-4 hover:bg-slate-50"
            >
              {editingId === transaction._id ? (
                <form onSubmit={handleEditSubmit} className="flex flex-1 flex-wrap gap-2">
                  <input type="number" value={editForm.amount} onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })} className="w-24 rounded border px-2 py-1 text-sm" required />
                  <select value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} className="rounded border px-2 py-1 text-sm" required>
                    {(transaction.type === "income" ? incomeCategories : expenseCategories).map((c) => (
                      <option key={c._id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                  <input type="date" value={editForm.date} onChange={(e) => setEditForm({ ...editForm, date: e.target.value })} className="rounded border px-2 py-1 text-sm" required />
                  <button type="submit" className="rounded bg-indigo-600 px-3 py-1 text-sm text-white">Save</button>
                  <button type="button" onClick={() => setEditingId(null)} className="rounded bg-slate-200 px-3 py-1 text-sm">Cancel</button>
                </form>
              ) : (
                <>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${transaction.type === "income" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                      {transaction.type}
                    </span>
                    <span className="font-medium text-slate-700">{transaction.category}</span>
                    {transaction.isTaxDeductible && (
                      <span className="rounded bg-violet-100 px-2 py-0.5 text-xs text-violet-700">Tax deductible</span>
                    )}
                    <span className="text-sm text-slate-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">{format(transaction.amount)}</span>
                    {!compact && (
                      <>
                        <button
                          onClick={() => {
                            setEditingId(transaction._id);
                            setEditForm({
                              amount: String(transaction.amount),
                              category: transaction.category,
                              date: new Date(transaction.date).toISOString().split("T")[0],
                              description: transaction.description || "",
                              isTaxDeductible: transaction.isTaxDeductible || false,
                            });
                          }}
                          className="text-sm text-indigo-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button onClick={() => setDeleteId(transaction._id)} className="text-sm text-red-600 hover:underline">
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {!compact && pagination && pagination.pages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <button
            disabled={filters.page <= 1}
            onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
            className="rounded-lg border px-3 py-1 text-sm disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-slate-500">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            disabled={filters.page >= pagination.pages}
            onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
            className="rounded-lg border px-3 py-1 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      <ConfirmModal
        open={!!deleteId}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction?"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default TransactionList;
