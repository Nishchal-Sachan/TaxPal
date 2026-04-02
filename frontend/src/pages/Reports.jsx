import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import ReportForm from '../components/reports/ReportForm';
import ReportPreview from '../components/reports/ReportPreview';
import DownloadButton from '../components/reports/DownloadButton';
import apiClient from '../api/apiClient';

const Reports = () => {
  const [filter, setFilter] = useState({
    type: 'monthly',
    month: '',
    quarter: '',
    year: new Date().getFullYear().toString(),
  });

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    setSummary(null);

    try {
      let endpoint = '';
      let params = {};

      if (filter.type === 'monthly') {
        endpoint = '/reports/monthly';
        params = { month: `${filter.year}-${filter.month}` };
      } else {
        endpoint = '/reports/quarterly';
        params = { quarter: filter.quarter, year: filter.year };
      }

      const response = await apiClient.get(endpoint, { params });
      setSummary(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate report summary');
    } finally {
      setLoading(false);
    }
  };

  const getExportPeriod = () => {
    if (filter.type === 'monthly') {
      return `${filter.year}-${filter.month}`;
    } else {
      return `${filter.quarter}-${filter.year}`;
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-12 pb-20">
        <div className="flex flex-col gap-2 border-l-4 border-blue-600 pl-6 py-2">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Financial Reports</h1>
          <p className="text-gray-500 font-medium">Generate detailed insights into your income, expenses, and overall financial health.</p>
        </div>

        <ReportForm 
          filter={filter} 
          setFilter={setFilter} 
          onGenerate={fetchReport} 
          loading={loading} 
        />

        {error && (
          <div className="bg-red-50 p-6 rounded-2xl border border-red-100 flex items-center gap-4 text-red-700 animate-in fade-in zoom-in-95 duration-300">
            <span className="text-2xl">⚠️</span>
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {summary ? (
          <>
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
               <ReportPreview summary={summary} />
            </div>

            <div className="border-t border-gray-100 pt-16 flex flex-col items-center gap-8 animate-in fade-in duration-1000 delay-300">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-gray-900">Export Your Report</h3>
                <p className="text-gray-500">Pick a format to save your records for tax or record-keeping purposes.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl px-4">
                <DownloadButton reportType={filter.type} period={getExportPeriod()} format="pdf" />
                <DownloadButton reportType={filter.type} period={getExportPeriod()} format="csv" />
              </div>
            </div>
          </>
        ) : !loading && !error && (
           <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-dashed border-gray-200 rounded-3xl p-24 flex flex-col items-center justify-center text-center gap-6 opacity-80 group hover:opacity-100 hover:scale-[1.02] transition-all">
              <div className="w-24 h-24 rounded-full bg-blue-50 text-blue-300 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform shadow-inner">📄</div>
              <div>
                <h3 className="text-xl font-bold text-gray-700">Reports Dashboard Empty</h3>
                <p className="text-gray-400 max-w-xs mx-auto mt-2">Select a period above and click "Generate Report" to view your financial summary.</p>
              </div>
           </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Reports;
