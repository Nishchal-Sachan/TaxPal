import React from 'react';
import { useCurrency } from '../../hooks/useCurrency';
import CategoryBreakdown from './CategoryBreakdown';

const ReportPreview = ({ summary }) => {
  const { format } = useCurrency();

  if (!summary) return null;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h2 className="text-2xl font-bold text-slate-900">{summary.period} Summary</h2>
        <span className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-700">
          Report Preview
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Income
          </p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">
            {format(summary.totalIncome)}
          </p>
        </div>
        <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Expenses
          </p>
          <p className="mt-2 text-3xl font-bold text-rose-600">
            {format(summary.totalExpense)}
          </p>
        </div>
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Net Savings
          </p>
          <p className={`mt-2 text-3xl font-bold ${summary.net >= 0 ? 'text-indigo-600' : 'text-orange-500'}`}>
            {format(summary.net)}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">
          Expense Breakdown by Category
        </h3>
        <CategoryBreakdown categories={summary.categories} />
      </div>
    </div>
  );
};

export default ReportPreview;
