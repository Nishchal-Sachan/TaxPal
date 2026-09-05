import React, { useState } from "react";
import { useCurrency } from "../../hooks/useCurrency";

const QUARTER_COLORS = {
  Q1: { bg: "bg-violet-50", accent: "bg-violet-500", text: "text-violet-700", border: "border-violet-200", badge: "bg-violet-100 text-violet-700" },
  Q2: { bg: "bg-sky-50",    accent: "bg-sky-500",    text: "text-sky-700",    border: "border-sky-200",    badge: "bg-sky-100 text-sky-700"    },
  Q3: { bg: "bg-amber-50",  accent: "bg-amber-500",  text: "text-amber-700",  border: "border-amber-200",  badge: "bg-amber-100 text-amber-700" },
  Q4: { bg: "bg-rose-50",   accent: "bg-rose-500",   text: "text-rose-700",   border: "border-rose-200",   badge: "bg-rose-100 text-rose-700"   },
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const getDaysUntil = (dateStr) => {
  const due = new Date(dateStr);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diff = Math.round((due - now) / (1000 * 60 * 60 * 24));
  return diff;
};

const TaxReminderCard = ({ reminder, onToggle }) => {
  const { format } = useCurrency();
  const [toggling, setToggling] = useState(false);
  if (!reminder) return null;

  const c = QUARTER_COLORS[reminder.quarter] || QUARTER_COLORS.Q1;
  const isPaid = reminder.status === "paid";
  const daysUntil = getDaysUntil(reminder.dueDate);
  const isOverdue = daysUntil < 0 && !isPaid;
  const isDueSoon = daysUntil >= 0 && daysUntil <= 14 && !isPaid;

  const handleToggle = async () => {
    if (!reminder.id || toggling) return;
    setToggling(true);
    try {
      await onToggle(reminder.id);
    } finally {
      setToggling(false);
    }
  };

  return (
    <div
      className={`relative rounded-2xl border-2 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1
        ${isPaid ? "border-emerald-200 bg-emerald-50 opacity-90" : `${c.border} ${c.bg}`}
      `}
    >
      {/* Top accent bar */}
      <div className={`h-1.5 w-full ${isPaid ? "bg-emerald-400" : c.accent}`} />

      <div className="p-6 flex flex-col gap-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${isPaid ? "bg-emerald-100 text-emerald-700" : c.badge}`}>
                {reminder.quarter}
              </span>
              {isOverdue && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 animate-pulse">
                  OVERDUE
                </span>
              )}
              {isDueSoon && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700">
                  DUE SOON
                </span>
              )}
              {isPaid && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                  ✓ PAID
                </span>
              )}
            </div>
            <h3 className="text-base font-bold text-gray-900">{reminder.title}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{reminder.description}</p>
          </div>

          {/* Amount */}
          <div className="text-right shrink-0">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Amount</p>
            <p className={`text-2xl font-extrabold ${isPaid ? "text-emerald-600" : c.text}`}>
              {format(Number(reminder.amount))}
            </p>
          </div>
        </div>

        {/* Due date row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">📅</span>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest">Due</p>
              <p className={`text-sm font-semibold ${isOverdue ? "text-red-600" : "text-gray-700"}`}>
                {formatDate(reminder.dueDate)}
              </p>
            </div>
          </div>
          {!isPaid && (
            <p className={`text-xs font-bold ${isOverdue ? "text-red-500" : isDueSoon ? "text-orange-500" : "text-gray-400"}`}>
              {isOverdue ? `${Math.abs(daysUntil)} days overdue` : `${daysUntil} days left`}
            </p>
          )}
        </div>

        {/* Toggle button */}
        <button
          onClick={handleToggle}
          disabled={toggling || !reminder.id}
          className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed
            ${isPaid
              ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
              : "bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-100 hover:shadow-emerald-200"
            }`}
        >
          {toggling ? "Updating..." : isPaid ? "↩ Mark as Unpaid" : "✓ Mark as Paid"}
        </button>
      </div>
    </div>
  );
};

export default TaxReminderCard;
