import React from 'react';

const ReportForm = ({ filter, setFilter, onGenerate, loading }) => {
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1, currentYear - 2];
  
  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  const isFormValid = () => {
    if (filter.type === 'monthly') {
      return filter.month && filter.year;
    }
    if (filter.type === 'quarterly') {
      return filter.quarter && filter.year;
    }
    return filter.year;
  };

  return (
    <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-xl overflow-hidden relative group">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-500 opacity-80"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-end">
        <div className="space-y-3">
          <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest pl-1">Report Type</label>
          <select
            name="type"
            value={filter.type}
            onChange={handleChange}
            className="w-full px-6 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all text-gray-700 font-semibold shadow-inner"
          >
            <option value="monthly">Monthly Report</option>
            <option value="quarterly">Quarterly Report</option>
            <option value="tax-year">Tax Year Summary</option>
          </select>
        </div>

        {filter.type === 'monthly' ? (
          <div className="space-y-3">
            <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest pl-1">Select Month</label>
            <select
              name="month"
              value={filter.month}
              onChange={handleChange}
              className="w-full px-6 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all text-gray-700 font-semibold shadow-inner appearance-none bg-no-repeat bg-[right_1.5rem_center]"
            >
              <option value="">Month</option>
              {months.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
        ) : filter.type === 'quarterly' ? (
          <div className="space-y-3">
            <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest pl-1">Select Quarter</label>
            <select
              name="quarter"
              value={filter.quarter}
              onChange={handleChange}
              className="w-full px-6 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all text-gray-700 font-semibold shadow-inner"
            >
              <option value="">Quarter</option>
              {quarters.map((q) => (
                <option key={q} value={q}>{q}</option>
              ))}
            </select>
          </div>
        ) : (
          <div className="hidden md:block" />
        )}

        <div className="space-y-3">
          <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest pl-1">Select Year</label>
          <select
            name="year"
            value={filter.year}
            onChange={handleChange}
            className="w-full px-6 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all text-gray-700 font-semibold shadow-inner"
          >
            <option value="">Year</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <button
          onClick={onGenerate}
          disabled={!isFormValid() || loading}
          className="w-full py-4 px-8 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed font-bold text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 overflow-hidden group"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Gathering...
            </span>
          ) : (
            <>
              ✨ Generate Report
              <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all">➔</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ReportForm;
