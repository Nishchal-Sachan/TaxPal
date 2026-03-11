import React, { useState } from "react";
import TaxForm from "../components/tax/TaxForm";
import MainLayout from "../layouts/MainLayout";
import apiClient from "../api/apiClient";
import TaxSummary from "../components/tax/TaxSummary";

export default function TaxEstimator() {
  const [formData, setFormData] = useState({
    country: "India",
    year: new Date().getFullYear(),
    income: "",
    businessExpenses: "",
    retirement: "",
    insurance: "",
    homeOffice: ""
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCalculate = async () => {
    if (!formData.income || parseFloat(formData.income) <= 0) {
      setError("Enter valid income");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await apiClient.post("/tax/estimate", formData);

      const data = res.data.data || res.data;
      setResult(data);

    } catch (err) {
      console.error(err);
      setError("Tax calculation failed");
    } finally {
      setLoading(false);
    }
  };

  const yearlyTax = result?.estimatedTax || 0;
  const quarterlyTax = yearlyTax / 4;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-8">Tax Estimator</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* LEFT SIDE - FORM */}
          <div className="space-y-6">
            <TaxForm formData={formData} setFormData={setFormData} />

            <button
              onClick={handleCalculate}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Calculating..." : "Calculate Tax"}
            </button>

            {error && (
              <div className="bg-red-100 text-red-800 p-3 rounded text-sm">
                {error}
              </div>
            )}
          </div>

          {/* RIGHT SIDE - SUMMARY */}
          <TaxSummary result={result} />
        </div>

        {/* EXTRA BREAKDOWN CARDS */}

        {result && (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            <ResultCard
              title="Estimated Tax"
              value={`₹${yearlyTax.toLocaleString()}`}
            />

            <ResultCard
              title="Quarterly Tax"
              value={`₹${quarterlyTax.toLocaleString()}`}
            />

            <ResultCard
              title="Taxable Income"
              value={`₹${result.taxableIncome?.toLocaleString() || 0}`}
            />

            <ResultCard
              title="Total Deductions"
              value={`₹${result.deductions?.toLocaleString() || 0}`}
            />

          </div>
        )}

      </div>
    </MainLayout>
  );
}

function ResultCard({ title, value }) {
  return (
    <div className="bg-white p-6 shadow-lg rounded-xl border hover:shadow-xl transition-shadow">
      <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
        {title}
      </h3>
      <p className="text-2xl font-bold text-gray-900 mt-2">
        {value}
      </p>
    </div>
  );
}