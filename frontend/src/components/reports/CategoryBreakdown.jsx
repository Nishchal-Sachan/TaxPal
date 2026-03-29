import { useMemo } from "react";

const formatCurrency = (value) => {
  if (typeof value !== "number" || Number.isNaN(value)) return "-";
  return `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
};

/**
 * CategoryBreakdown
 * - Provide either:
 *   - transactions: [{ type, category, amount }, ...] (recommended)
 *   - categories: [{ category, amount }, ...] (from reports API)
 *   - or data: { [categoryName]: amountNumber }
 *
 * Props:
 * - title?: string
 * - transactions?: array
 * - categories?: array
 * - data?: object
 * - type?: "expense" | "income" | "all" (default: "expense")
 * - variant?: "cards" | "table" (default: "cards")
 * - maxItems?: number (default: 8)
 */
const CategoryBreakdown = ({
  title = "Category Breakdown",
  transactions,
  categories,
  data,
  type = "expense",
  variant = "cards",
  maxItems = 8,
}) => {
  const rows = useMemo(() => {
    let entries = [];

    if (Array.isArray(categories)) {
      entries = categories.map((c) => ({
        category: (c?.category || "Other").trim() || "Other",
        amount: Number(c?.amount) || 0,
      }));
    } else if (data && typeof data === "object") {
      entries = Object.entries(data).map(([category, amount]) => ({
        category: category || "Other",
        amount: Number(amount) || 0,
      }));
    } else if (Array.isArray(transactions)) {
      const map = transactions.reduce((acc, t) => {
        const tType = t?.type;
        if (type !== "all" && tType !== type) return acc;

        const category = (t?.category || "Other").trim() || "Other";
        const amount = Number(t?.amount) || 0;
        acc[category] = (acc[category] || 0) + amount;
        return acc;
      }, {});

      entries = Object.entries(map).map(([category, amount]) => ({
        category,
        amount,
      }));
    }

    entries.sort((a, b) => b.amount - a.amount);

    const limited = entries.slice(0, Math.max(0, maxItems));
    const total = entries.reduce((sum, r) => sum + r.amount, 0);

    return { total, items: limited };
  }, [categories, data, transactions, type, maxItems]);

  const hasItems = rows.items.length > 0;

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
          <p className="text-sm text-slate-500 mt-1">
            Total:{" "}
            <span className="font-semibold text-slate-800">
              {formatCurrency(rows.total)}
            </span>
          </p>
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600">
          {type === "all" ? "All" : type}
        </span>
      </div>

      {!hasItems ? (
        <div className="text-slate-500 text-sm py-6 text-center">
          No category data available.
        </div>
      ) : variant === "table" ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="py-2 pr-3 font-medium">Category</th>
                <th className="py-2 pl-3 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {rows.items.map((r) => (
                <tr key={r.category} className="border-t border-slate-100">
                  <td className="py-3 pr-3 text-slate-700">{r.category}</td>
                  <td className="py-3 pl-3 text-right font-semibold text-slate-800">
                    {formatCurrency(r.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {rows.items.map((r) => (
            <div
              key={r.category}
              className="rounded-lg border border-slate-200 p-4 hover:bg-slate-50"
            >
              <div className="text-sm font-medium text-slate-700">
                {r.category}
              </div>
              <div className="mt-1 text-base font-semibold text-slate-900">
                {formatCurrency(r.amount)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryBreakdown;

