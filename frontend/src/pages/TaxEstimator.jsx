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
    homeOffice: "",
    status: "Single"
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

      // 1️⃣ Calculate tax
      const payload = {
        country: formData.country,
        year: Number(formData.year) || new Date().getFullYear(),
        income: Number(formData.income) || 0,
        businessExpenses: Number(formData.businessExpenses) || 0,
        retirement: Number(formData.retirement) || 0,
        insurance: Number(formData.insurance) || 0,
        homeOffice: Number(formData.homeOffice) || 0,
        status: formData.status || "Single"
      };

      const res = await apiClient.post("/tax/estimate", payload);

      const data = res.data.data || res.data;

      setResult(data);

      // 2️⃣ Save quarterly tax estimates (for calendar)
      if (data.quarters && Array.isArray(data.quarters)) {
        await Promise.all(
          data.quarters.map((q) =>
            apiClient.post("/tax/save", {
              quarter: q.quarter,
              amount: q.tax
            })
          )
        );
      }

    } catch (err) {

      console.error(err);
      setError("Tax calculation failed");

    } finally {

      setLoading(false);

    }
  };

  const yearlyTax = result?.estimatedTax || result?.yearlyTax || 0;
  const quarterlyTax = result?.quarterlyTax ?? yearlyTax / 4;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto p-6">

        <h1 className="text-2xl font-bold mb-8">
          Tax Estimator
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* FORM */}
          <div className="space-y-6">

            <TaxForm
              formData={formData}
              setFormData={setFormData}
            />

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

          {/* SUMMARY */}
          <TaxSummary result={result} />

        </div>

        {/* EXTRA BREAKDOWN */}
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