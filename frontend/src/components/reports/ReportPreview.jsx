import { useMemo } from "react";
import CategoryBreakdown from "./CategoryBreakdown";
import DownloadButton from "./DownloadButton";
const formatCurrency = (value) => {
  if (typeof value !== "number" || Number.isNaN(value)) return "-";
  return `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
};

/**
 * ReportPreview
 *
 * Props:
 * - report?: {
 *     month?: string,
 *     quarter?: string,
 *     year?: number,
 *     totalIncome?: number,
 *     totalExpense?: number,
 *     net?: number,
 *     categories?: [{ category: string, amount: number }]
 *   }
 * - transactions?: [{ type: "income"|"expense", category, amount, date }]
 * - totals?: { income: number, expense: number, net: number }
 * - showCategoryVariant?: "cards" | "table"
 * - showTransactions?: boolean (default true)
 */
const ReportPreview = ({
  report,
  transactions = [],
  totals,
  showCategoryVariant = "cards",
  showTransactions = true,
}) => {
  const periodTitle = useMemo(() => {
    if (!report) return null;
    if (typeof report.month === "string" && report.month.trim()) return report.month;
    if (typeof report.quarter === "string" && report.quarter.trim()) {
      const y = report.year ? ` ${report.year}` : "";
      return `${report.quarter}${y}`;
    }
    return "Report";
  }, [report]);

  const computedTotals = useMemo(() => {
    if (report) {
      const income = Number(report.totalIncome) || 0;
      const expense = Number(report.totalExpense) || 0;
      const net =
        typeof report.net === "number" ? report.net : Number(income - expense);
      return { income, expense, net };
    }

    if (totals) return totals;

    let income = 0;
    let expense = 0;

    for (let i = 0; i < transactions.length; i++) {
      const t = transactions[i];
      const amount = Number(t?.amount) || 0;
      if (t?.type === "income") income += amount;
      if (t?.type === "expense") expense += amount;
    }

    return { income, expense, net: income - expense };
  }, [report, totals, transactions]);

  const netColor =
    computedTotals.net >= 0 ? "text-emerald-700" : "text-rose-700";

  return (
    <div className="space-y-4">
      {periodTitle && (
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{periodTitle}</h2>
              <p className="text-sm text-slate-500 mt-1">
                Summary of income, expense, and category breakdown.
              </p>
            </div>
            <div className="flex items-center gap-2">
            <DownloadButton
    type="pdf"
    period={
      report?.month
        ? report.month
        : report?.quarter && report?.year
        ? `${report.quarter}-${report.year}`
        : ""
    }
  />

  
            <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600">
              Preview
            </span>
          </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <div className="text-sm text-slate-500">Total income</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {formatCurrency(computedTotals.income)}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <div className="text-sm text-slate-500">Total expense</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {formatCurrency(computedTotals.expense)}
          </div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <div className="text-sm text-slate-500">Net</div>
          <div className={`mt-2 text-2xl font-bold ${netColor}`}>
            {formatCurrency(computedTotals.net)}
          </div>
        </div>
      </div>

      <CategoryBreakdown
        title="Expense breakdown"
        transactions={transactions}
        categories={report?.categories}
        type="expense"
        variant={showCategoryVariant}
      />

      {showTransactions && (
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">
                Transactions
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Recent income and expense entries.
              </p>
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600">
              {transactions.length} items
            </span>
          </div>

          {transactions.length === 0 ? (
            <div className="text-slate-500 text-sm py-6 text-center">
              {report
                ? "This report response does not include transaction rows."
                : "No transactions available."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500">
                    <th className="py-2 pr-3 font-medium">Type</th>
                    <th className="py-2 px-3 font-medium">Category</th>
                    <th className="py-2 px-3 font-medium">Date</th>
                    <th className="py-2 pl-3 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t, idx) => {
                    const tType = t?.type || "-";
                    const badgeClasses =
                      tType === "income"
                        ? "bg-emerald-100 text-emerald-800"
                        : tType === "expense"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-slate-100 text-slate-700";

                    const dateText = t?.date
                      ? new Date(t.date).toLocaleDateString()
                      : "-";

                    return (
                      <tr
                        key={t?._id || `${tType}-${t?.category || "cat"}-${idx}`}
                        className="border-t border-slate-100"
                      >
                        <td className="py-3 pr-3">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${badgeClasses}`}
                          >
                            {tType}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-700">
                          {t?.category || "Other"}
                        </td>
                        <td className="py-3 px-3 text-slate-600">{dateText}</td>
                        <td className="py-3 pl-3 text-right font-semibold text-slate-800">
                          {formatCurrency(Number(t?.amount) || 0)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportPreview;

