import React from 'react';
import CategoryBreakdown from './CategoryBreakdown';

const ReportPreview = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="space-y-8 mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between border-b pb-4 border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900">{summary.period} Summary</h2>
        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider border border-blue-100 shadow-sm">Report Preview</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><span className="text-4xl">↑</span></div>
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-1">Total Income</p>
          <p className="text-3xl font-extrabold text-emerald-600">${summary.totalIncome?.toLocaleString() || 0}</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><span className="text-4xl text-rose-600">↓</span></div>
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-1">Total Expenses</p>
          <p className="text-3xl font-extrabold text-rose-600">${summary.totalExpense?.toLocaleString() || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><span className="text-4xl text-blue-600">±</span></div>
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-1">Net Savings</p>
          <p className={`text-3xl font-extrabold ${summary.net >= 0 ? 'text-blue-600' : 'text-orange-500'}`}>
            ${summary.net?.toLocaleString() || 0}
          </p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">▤</span>
          Expense Breakdown by Category
        </h3>
        <CategoryBreakdown categories={summary.categories} />
      </div>
    </div>
  );
};

export default ReportPreview;
