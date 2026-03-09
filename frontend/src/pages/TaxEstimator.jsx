import React, { useState, useCallback } from "react";
import TaxForm from "../components/tax/TaxForm";
import MainLayout from "../layouts/MainLayout";

export default function TaxEstimator() {
  const [formData, setFormData] = useState({
    region: "India",
    stateProvince: "",
    status: "Single",
    quarter: "Q1",
    income: "",
    businessExpenses: "",
    retirement: "",
    insurance: "",
    homeOffice: ""
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCalculate = useCallback(async () => {
    if (!formData.income || parseFloat(formData.income) <= 0) {
      setError("Enter valid income");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/tax/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error("API failed");

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError("Calculation failed - check backend");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [formData]);

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-8">Tax Estimator</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT SIDE: Form + Calculate Button */}
          <div className="space-y-6">
            <TaxForm formData={formData} setFormData={setFormData} />
            
            <div className="pt-4">
              <button
                onClick={handleCalculate}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Calculating..." : "Calculate Tax"}
              </button>
              
              {error && (
                <div className="mt-3 bg-red-100 text-red-800 p-3 rounded text-sm">{error}</div>
              )}
            </div>
          </div>

          {/* RIGHT SIDE: Tax Summary Card */}
          <div className="space-y-6">
            {result ? (
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-8 rounded-2xl shadow-2xl h-fit">
                <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-center">
                  ₹{result.estimatedTax?.toLocaleString() || '0'}
                </h2>
                <div className="space-y-4 text-center">
                  <p className="text-xl opacity-90">Your Estimated Tax</p>
                  <p className="text-blue-100 text-lg">
                    {result.effectiveRate ? `${result.effectiveRate}% effective rate` : ''}
                  </p>
                  <div className="grid grid-cols-2 gap-4 mt-8 text-sm">
                    <div>
                      <div className="text-blue-200">Taxable Income</div>
                      <div className="font-bold">₹{result.taxableIncome?.toLocaleString() || '0'}</div>
                    </div>
                    <div>
                      <div className="text-blue-200">Deductions</div>
                      <div className="font-bold">₹{result.deductions?.toLocaleString() || '0'}</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-8 rounded-2xl shadow-lg h-fit text-center">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Tax Summary</h3>
                <p className="text-gray-600">Enter your income and deduction details to calculate your estimated quarterly tax</p>
              </div>
            )}
          </div>
        </div>

        {/* Detail Cards - Below both columns */}
        {result && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ResultCard title="Estimated Tax" value={`₹${result.estimatedTax?.toLocaleString() || '0'}`} />
            <ResultCard title="Effective Rate" value={`${result.effectiveRate || 0}%`} />
            <ResultCard title="Taxable Income" value={`₹${result.taxableIncome?.toLocaleString() || '0'}`} />
            <ResultCard title="Total Deductions" value={`₹${result.deductions?.toLocaleString() || '0'}`} />
          </div>
        )}
      </div>
    </MainLayout>
  );
}

function ResultCard({ title, value }) {
  return (
    <div className="bg-white p-6 shadow-lg rounded-xl border hover:shadow-xl transition-shadow">
      <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
    </div>
  );
}