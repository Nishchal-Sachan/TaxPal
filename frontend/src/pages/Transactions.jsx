import { useState, useRef } from "react";
import TransactionForm from "../components/dashboard/TransactionForm";
import TransactionList from "../components/dashboard/TransactionList";
import PageHeader from "../components/ui/PageHeader";
import apiClient from "../api/apiClient";
import { useToast } from "../context/ToastContext";

export default function Transactions() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const fileRef = useRef(null);
  const toast = useToast();

  const handleTransactionChange = () => {
    setRefreshTrigger((t) => t + 1);
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const lines = text.trim().split("\n").slice(1);
    const rows = [];

    for (const line of lines) {
      const [date, type, category, amount, description] = line.split(",").map((s) => s.trim().replace(/^"|"$/g, ""));
      if (date && type && category && amount) {
        rows.push({
          date,
          type: type.toLowerCase(),
          category,
          amount: parseFloat(amount),
          description: description || "",
        });
      }
    }

    if (rows.length === 0) {
      toast.error("No valid rows found. Use: date,type,category,amount,description");
      return;
    }

    try {
      const res = await apiClient.post("/transactions/import", { rows });
      toast.success(`Imported ${res.data.data.created} transactions`);
      if (res.data.data.errors?.length) {
        toast.error(`${res.data.data.errors.length} rows failed`);
      }
      handleTransactionChange();
    } catch (err) {
      toast.error(err.response?.data?.message || "Import failed");
    }

    e.target.value = "";
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Transactions"
        subtitle="Record, search, and import your income and expenses"
        action={
          <div className="flex gap-2">
            <input ref={fileRef} type="file" accept=".csv" onChange={handleImport} className="hidden" />
            <button
              onClick={() => fileRef.current?.click()}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Import CSV
            </button>
          </div>
        }
      />

      <TransactionForm onSuccess={handleTransactionChange} />
      <TransactionList
        refreshTrigger={refreshTrigger}
        onTransactionChange={handleTransactionChange}
      />
    </div>
  );
}
