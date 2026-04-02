import React, { useState } from 'react';
import apiClient from '../../api/apiClient';

const DownloadButton = ({ reportType, period, format = 'pdf' }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleDownload = async () => {
    if (!reportType || !period) return;
    
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // The API endpoint is /reports/export?type=pdf&period=2026-03
      // For quarterly it might be period=Q1-2026
      const response = await apiClient.get('/reports/export', {
        params: { type: format, period }
      });
      
      const { fileUrl } = response.data.data;
      
      // Since backend is on port 5000 and frontend on 3000
      const fullUrl = `http://localhost:5000${fileUrl}`;
      
      // Trigger download
      const link = document.createElement('a');
      link.href = fullUrl;
      link.download = `report-${period}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to export report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <button
        onClick={handleDownload}
        disabled={loading}
        className={`w-full py-4 px-8 rounded-2xl font-bold text-white transition-all transform flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none
          ${format === 'pdf' ? 'bg-rose-500 hover:bg-rose-600' : 'bg-green-600 hover:bg-green-700'}`}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating {format.toUpperCase()}...
          </span>
        ) : (
          <>
            <span className="text-xl">⤓</span>
            Export as {format.toUpperCase()}
          </>
        )}
      </button>

      {error && <p className="text-sm text-red-600 font-medium px-4 py-2 bg-red-50 rounded-lg border border-red-100 animate-bounce">⚠️ {error}</p>}
      {success && <p className="text-sm text-emerald-600 font-medium px-4 py-2 bg-emerald-50 rounded-lg border border-emerald-100 italic animate-pulse">✓ Report downloaded successfully!</p>}
    </div>
  );
};

export default DownloadButton;