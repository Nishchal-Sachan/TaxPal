import React from 'react';

const CategoryBreakdown = ({ categories }) => {
  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed">
        No expense data available for this period
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
            <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {categories.map((cat, idx) => (
            <tr key={idx} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-sm text-gray-700 font-medium">{cat.category}</td>
              <td className="px-6 py-4 text-sm text-gray-900 text-right font-mono">${cat.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryBreakdown;
