import React, { useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
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
      } else if (filter.type === 'quarterly') {
        endpoint = '/reports/quarterly';
        params = { quarter: filter.quarter, year: filter.year };
      } else {
        endpoint = '/reports/tax-year';
        params = { year: filter.year };
      }

      const response = await apiClient.get(endpoint, { params });
      setSummary(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const getExportPeriod = () => {
    if (filter.type === 'monthly') return `${filter.year}-${filter.month}`;
    if (filter.type === 'quarterly') return `${filter.quarter}-${filter.year}`;
    return filter.year;
  };

  return (
    <div className="space-y-8 pb-8">
      <PageHeader
        title="Financial Reports"
        subtitle="Generate insights into your income, expenses, and financial health"
      />

      <ReportForm filter={filter} setFilter={setFilter} onGenerate={fetchReport} loading={loading} />

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {summary ? (
        <>
          <ReportPreview summary={summary} />
          <div className="border-t border-slate-100 pt-8">
            <h3 className="mb-4 text-center text-lg font-semibold text-slate-900">
              Export Your Report
            </h3>
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-4 md:grid-cols-2">
              <DownloadButton period={getExportPeriod()} format="pdf" />
              <DownloadButton period={getExportPeriod()} format="csv" />
            </div>
          </div>
        </>
      ) : (
        !loading &&
        !error && (
          <EmptyState
            title="Reports Dashboard Empty"
            description='Select a period above and click "Generate Report" to view your financial summary.'
          />
        )
      )}
    </div>
  );
};

export default Reports;
