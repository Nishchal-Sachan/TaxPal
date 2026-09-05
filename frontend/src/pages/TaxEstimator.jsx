import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import TaxForm from "../components/tax/TaxForm";
import TaxSummary from "../components/tax/TaxSummary";
import TaxDisclaimer from "../components/tax/TaxDisclaimer";
import PageHeader from "../components/ui/PageHeader";
import apiClient from "../api/apiClient";

export default function TaxEstimator() {
  const { user } = useAuth();
  const toast = useToast();
  const [formData, setFormData] = useState({
    country: user?.country || "India",
    year: new Date().getFullYear(),
    income: "",
    businessExpenses: "",
    retirement: "",
    insurance: "",
    homeOffice: "",
    status: "Single",
    useTrackedIncome: false,
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.country) {
      setFormData((prev) => ({ ...prev, country: user.country }));
    }
  }, [user?.country]);

  const handleCalculate = async () => {
    if (!formData.useTrackedIncome && (!formData.income || parseFloat(formData.income) <= 0)) {
      setError("Please enter a valid annual income or enable tracked income.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        country: formData.country,
        year: Number(formData.year),
        income: Number(formData.income) || 0,
        businessExpenses: Number(formData.businessExpenses) || 0,
        retirement: Number(formData.retirement) || 0,
        insurance: Number(formData.insurance) || 0,
        homeOffice: Number(formData.homeOffice) || 0,
        status: formData.status || "Single",
        useTrackedIncome: Boolean(formData.useTrackedIncome),
      };

      const res = await apiClient.post("/tax/estimate", payload);
      setResult(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Tax calculation failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToCalendar = async () => {
    if (!result?.quarters) return;
    try {
      await apiClient.post("/tax/save-all", {
        year: result.year,
        country: result.country,
        quarters: result.quarters,
      });
      toast.success("Quarterly estimates saved to Tax Calendar");
    } catch {
      toast.error("Failed to save to calendar");
    }
  };

  const handleReset = () => {
    setFormData({
      country: user?.country || "India",
      year: new Date().getFullYear(),
      income: "",
      businessExpenses: "",
      retirement: "",
      insurance: "",
      homeOffice: "",
      status: "Single",
      useTrackedIncome: false,
    });
    setResult(null);
    setError("");
  };

  return (
    <div className="space-y-8 pb-8">
      <PageHeader
        title="Tax Estimator"
        subtitle="Estimate your annual and quarterly taxes"
        action={
          result && (
            <button
              onClick={handleReset}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Reset
            </button>
          )
        }
      />

      <TaxDisclaimer country={formData.country} />

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <TaxForm formData={formData} setFormData={setFormData} />

          <button
            onClick={handleCalculate}
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 py-4 text-lg font-bold text-white shadow-lg disabled:opacity-50"
          >
            {loading ? "Calculating..." : "Calculate Tax"}
          </button>

          {result && (
            <button
              onClick={handleSaveToCalendar}
              className="w-full rounded-2xl border border-indigo-200 bg-indigo-50 py-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
            >
              Save to Tax Calendar
            </button>
          )}

          {error && (
            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        <TaxSummary result={result} />
      </div>
    </div>
  );
}
