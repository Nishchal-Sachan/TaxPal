import React from 'react';
import { useCurrency } from '../../hooks/useCurrency';

const CategoryBreakdown = ({ categories }) => {
  const { format } = useCurrency();

  if (!categories || categories.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 py-8 text-center text-sm text-slate-500">
        No expense data available for this period
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50">
            <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-600">
              Category
            </th>
            <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
              Amount
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {categories.map((cat, idx) => (
            <tr key={idx} className="hover:bg-slate-50">
              <td className="px-6 py-4 text-sm font-medium text-slate-700">
                {cat.category}
              </td>
              <td className="px-6 py-4 text-right text-sm font-semibold text-slate-900">
                {format(cat.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryBreakdown;
