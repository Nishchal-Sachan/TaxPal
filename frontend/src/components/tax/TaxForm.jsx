import React from "react";
import { getCurrencySymbol } from "../../utils/format";

const InputField = ({
  label,
  name,
  type = "number",
  value,
  onChange,
  placeholder = "0",
  hint,
  country,
}) => {
  const symbol = getCurrencySymbol(country);

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-slate-600">{label}</label>
      <div className="relative">
        {type === "number" && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
            {symbol}
          </span>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          min={type === "number" ? "0" : undefined}
          className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white ${
            type === "number" ? "pl-10" : ""
          }`}
        />
      </div>
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  );
};

export default function TaxForm({ formData, setFormData }) {
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const currentYear = new Date().getFullYear();
  const country = formData.country || "United States";
  const symbol = getCurrencySymbol(country);

  const totalDeductions =
    Number(formData.businessExpenses) +
    Number(formData.retirement) +
    Number(formData.insurance) +
    Number(formData.homeOffice);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5">
        <h2 className="text-lg font-bold text-white">Tax Calculator</h2>
        <p className="text-sm text-indigo-200">
          Enter income and deductions for an estimate
        </p>
      </div>

      <div className="space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-600">
              Country
            </label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
            >
              <option value="India">India</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Australia">Australia</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-600">
              Tax Year
            </label>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
            >
              {[currentYear, currentYear - 1, currentYear - 2].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-600">
            Filing Status
          </label>
          <div className="grid grid-cols-3 gap-2">
            {["Single", "Married", "Business"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, status: s }))}
                className={`rounded-xl py-2.5 text-sm font-semibold border transition ${
                  formData.status === s
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-slate-200 bg-slate-50 text-slate-500"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Married applies a simplified adjustment. Business adds a 5% surcharge in this estimator.
          </p>
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            name="useTrackedIncome"
            checked={formData.useTrackedIncome || false}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                useTrackedIncome: e.target.checked,
              }))
            }
          />
          Use tracked income & tax-deductible expenses from transactions
        </label>

        <InputField
          label="Annual Income"
          name="income"
          value={formData.income}
          onChange={handleChange}
          country={country}
          hint="Your total gross income for the year"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <InputField label="Business Expenses" name="businessExpenses" value={formData.businessExpenses} onChange={handleChange} country={country} />
          <InputField label="Retirement" name="retirement" value={formData.retirement} onChange={handleChange} country={country} />
          <InputField label="Health Insurance" name="insurance" value={formData.insurance} onChange={handleChange} country={country} />
          <InputField label="Home Office" name="homeOffice" value={formData.homeOffice} onChange={handleChange} country={country} />
        </div>

        {totalDeductions > 0 && (
          <div className="flex items-center justify-between rounded-xl bg-violet-50 px-4 py-3">
            <p className="text-sm font-semibold text-violet-700">Total Deductions</p>
            <p className="text-lg font-bold text-violet-700">
              {symbol}
              {totalDeductions.toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
