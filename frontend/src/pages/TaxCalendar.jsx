import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import apiClient from "../api/apiClient";
import TaxReminderCard from "../components/tax/TaxReminderCard";

const QUARTER_MONTHS = {
  Q1: "Jan – Mar",
  Q2: "Apr – Jun",
  Q3: "Jul – Sep",
  Q4: "Oct – Dec",
};

const TaxCalendar = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReminders = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await apiClient.get("/tax/calendar");
      setReminders(res.data?.data || []);
    } catch (err) {
      console.error("Tax calendar fetch failed:", err);
      setError("Failed to load tax reminders.");
      setReminders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleToggle = async (id) => {
    await apiClient.patch(`/tax/calendar/${id}/toggle`);
    setReminders((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: r.status === "paid" ? "unpaid" : "paid" } : r
      )
    );
  };

  const paidCount = reminders.filter((r) => r.status === "paid").length;
  const totalAmount = reminders.reduce((s, r) => s + Number(r.amount || 0), 0);
  const paidAmount = reminders
    .filter((r) => r.status === "paid")
    .reduce((s, r) => s + Number(r.amount || 0), 0);

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto pb-20 space-y-10">

        {/* Page header */}
        <div className="border-l-4 border-indigo-500 pl-6 py-2">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Tax Calendar</h1>
          <p className="text-gray-500 mt-1 font-medium">Track quarterly estimated tax deadlines and mark payments as completed.</p>
        </div>

        {/* Summary bar (only when data exists) */}
        {!loading && reminders.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">Total Due This Year</p>
              <p className="text-3xl font-extrabold text-gray-900">₹{totalAmount.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6">
              <p className="text-xs uppercase tracking-widest text-emerald-500 font-bold mb-1">Amount Paid</p>
              <p className="text-3xl font-extrabold text-emerald-600">₹{paidAmount.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6">
              <p className="text-xs uppercase tracking-widest text-orange-500 font-bold mb-1">Remaining</p>
              <p className="text-3xl font-extrabold text-orange-600">₹{(totalAmount - paidAmount).toLocaleString()}</p>
            </div>
          </div>
        )}

        {/* Progress bar */}
        {!loading && reminders.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm font-bold text-gray-700">Quarterly Payment Progress</p>
              <span className="text-sm font-bold text-indigo-600">{paidCount} / {reminders.length} paid</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-700"
                style={{ width: `${reminders.length > 0 ? (paidCount / reminders.length) * 100 : 0}%` }}
              />
            </div>
            <div className="flex justify-between mt-2">
              {["Q1", "Q2", "Q3", "Q4"].map((q) => (
                <span key={q} className="text-xs text-gray-400 font-medium">{q}<br/><span className="text-gray-300">{QUARTER_MONTHS[q]}</span></span>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-50 rounded-2xl border border-gray-100 h-48 animate-pulse" />
            ))}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-100 text-red-700 rounded-2xl p-6 flex items-center gap-4">
            <span className="text-2xl">⚠️</span>
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && reminders.length === 0 && (
          <div className="bg-gradient-to-br from-indigo-50 to-white border-2 border-dashed border-indigo-100 rounded-3xl p-24 flex flex-col items-center gap-6 text-center">
            <div className="text-6xl">📅</div>
            <div>
              <h3 className="text-xl font-bold text-gray-700">No Tax Reminders Yet</h3>
              <p className="text-gray-400 max-w-xs mx-auto mt-2">
                Use the Tax Calculator to estimate your tax and your quarterly reminders will appear here automatically.
              </p>
            </div>
          </div>
        )}

        {/* Cards grid */}
        {!loading && !error && reminders.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reminders.map((reminder) => (
              <TaxReminderCard
                key={reminder.id || reminder.quarter}
                reminder={reminder}
                onToggle={handleToggle}
              />
            ))}
          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default TaxCalendar;