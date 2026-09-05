import React, { useState } from 'react';
import apiClient from '../../api/apiClient';
import { useToast } from '../../context/ToastContext';

const DownloadButton = ({ period, format: fileFormat = 'pdf' }) => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleDownload = async () => {
    if (!period) return;

    setLoading(true);
    try {
      const exportRes = await apiClient.get('/reports/export', {
        params: { type: fileFormat, period },
      });

      const { reportId } = exportRes.data.data;

      const downloadRes = await apiClient.get(`/reports/download/${reportId}`, {
        responseType: 'blob',
      });

      const blob = new Blob([downloadRes.data], {
        type: fileFormat === 'pdf' ? 'application/pdf' : 'text/csv',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `taxpal-report-${period}.${fileFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Report downloaded successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to export report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading || !period}
      className={`w-full rounded-2xl px-8 py-4 font-bold text-white shadow-lg transition hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0
        ${fileFormat === 'pdf' ? 'bg-rose-500 hover:bg-rose-600' : 'bg-emerald-600 hover:bg-emerald-700'}`}
    >
      {loading ? `Generating ${fileFormat.toUpperCase()}...` : `Export as ${fileFormat.toUpperCase()}`}
    </button>
  );
};

export default DownloadButton;
