import React, { useState } from "react";
import TaxForm from "../components/tax/TaxForm";
import TaxSummary from "../components/tax/TaxSummary";
import MainLayout from "../layouts/MainLayout";
import apiClient from "../api/apiClient";

export default function TaxEstimator() {
  const [formData, setFormData] = useState({
    country: "India",
    year: new Date().getFullYear(),
    income: "",
    businessExpenses: "",
    retirement: "",
    insurance: "",
    homeOffice: "",
    status: "Single",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const handleCalculate = async () => {
    if (!formData.income || parseFloat(formData.income) <= 0) {
      setError("Please enter a valid annual income.");
      return;
    }

    setLoading(true);
    setError("");
    setSaved(false);

    try {
      const payload = {
        country: formData.country,
        year: Number(formData.year) || new Date().getFullYear(),
        income: Number(formData.income) || 0,
        businessExpenses: Number(formData.businessExpenses) || 0,
        retirement: Number(formData.retirement) || 0,
        insurance: Number(formData.insurance) || 0,
        homeOffice: Number(formData.homeOffice) || 0,
        status: formData.status || "Single",
      };

      const res = await apiClient.post("/tax/estimate", payload);
      const data = res.data.data || res.data;
      setResult(data);

      // Auto-save quarterly estimates to populate the calendar
      if (data.quarters && Array.isArray(data.quarters)) {
        await Promise.all(
          data.quarters.map((q) =>
            apiClient.post("/tax/save", { quarter: q.quarter, amount: q.tax })
          )
        );
        setSaved(true);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Tax calculation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      country: "India",
      year: new Date().getFullYear(),
      income: "",
      businessExpenses: "",
      retirement: "",
      insurance: "",
      homeOffice: "",
      status: "Single",
    });
    setResult(null);
    setError("");
    setSaved(false);
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto pb-20 space-y-10">

        {/* Header */}
        <div className="border-l-4 border-indigo-500 pl-6 py-2 flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Tax Estimator</h1>
            <p className="text-gray-500 mt-1 font-medium">Estimate your annual and quarterly taxes with precision.</p>
          </div>
          {result && (
            <button
              onClick={handleReset}
              className="text-sm text-gray-500 hover:text-gray-800 border border-gray-200 rounded-xl px-4 py-2 hover:border-gray-400 transition-all font-semibold"
            >
              ↺ Reset
            </button>
          )}
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* Left — Form */}
          <div className="space-y-5 sticky top-4">
            <TaxForm formData={formData} setFormData={setFormData} />

            <button
              onClick={handleCalculate}
              disabled={loading}
              className="w-full py-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-extrabold text-lg shadow-xl shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:translate-y-0 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Calculating...
                </>
              ) : (
                <>🧮 Calculate Tax</>
              )}
            </button>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-700 rounded-2xl p-4 text-sm font-semibold flex items-center gap-3">
                <span className="text-xl">⚠️</span> {error}
              </div>
            )}
            {saved && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl p-4 text-sm font-semibold flex items-center gap-3">
                <span className="text-xl">✅</span> Quarterly estimates saved to your Tax Calendar!
              </div>
            )}
          </div>

          {/* Right — Summary */}
          <TaxSummary result={result} />
        </div>

      </div>
    </MainLayout>
  );
}