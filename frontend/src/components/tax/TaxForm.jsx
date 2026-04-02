import React from "react";

const InputField = ({ label, name, type = "number", value, onChange, placeholder = "0", hint }) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-semibold text-gray-600">{label}</label>
    <div className="relative">
      {type === "number" && (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm select-none">₹</span>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={type === "number" ? "0" : undefined}
        className={`w-full rounded-xl bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all text-gray-800 font-semibold
          ${type === "number" ? "pl-8 pr-4 py-3.5" : "px-4 py-3.5"}`}
      />
    </div>
    {hint && <p className="text-xs text-gray-400">{hint}</p>}
  </div>
);

export default function TaxForm({ formData, setFormData }) {
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-6">
        <h2 className="text-xl font-extrabold text-white">Tax Calculator</h2>
        <p className="text-indigo-200 text-sm mt-0.5">Enter your income and deductions for an accurate estimate.</p>
      </div>

      <div className="p-8 space-y-8">
        {/* Basic Info */}
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5 flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">1</span>
            Basic Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Country */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-600">Country</label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full rounded-xl bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all px-4 py-3.5 text-gray-800 font-semibold"
              >
                <option value="India">🇮🇳 India</option>
                <option value="United States">🇺🇸 United States</option>
                <option value="United Kingdom">🇬🇧 United Kingdom</option>
                <option value="Australia">🇦🇺 Australia</option>
              </select>
            </div>

            {/* Tax Year */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-600">Tax Year</label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full rounded-xl bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all px-4 py-3.5 text-gray-800 font-semibold"
              >
                {[currentYear, currentYear - 1, currentYear - 2].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            {/* Filing Status */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-600">Filing Status</label>
              <div className="grid grid-cols-3 gap-2">
                {["Single", "Married", "Business"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, status: s }))}
                    className={`py-3 rounded-xl text-sm font-bold border-2 transition-all
                      ${formData.status === s
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : "border-gray-100 bg-gray-50 text-gray-500 hover:border-indigo-200"
                      }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Annual Income */}
            <InputField
              label="Annual Income"
              name="income"
              value={formData.income}
              onChange={handleChange}
              placeholder="Enter annual income"
              hint="Your total gross income for the year"
            />
          </div>
        </div>

        {/* Deductions */}
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5 flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-violet-100 text-violet-600 flex items-center justify-center text-xs">2</span>
            Deductions <span className="font-normal text-gray-400 normal-case tracking-normal">(optional — reduce your taxable income)</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InputField label="Business Expenses" name="businessExpenses" value={formData.businessExpenses} onChange={handleChange} />
            <InputField label="Retirement Contributions" name="retirement" value={formData.retirement} onChange={handleChange} />
            <InputField label="Health Insurance" name="insurance" value={formData.insurance} onChange={handleChange} />
            <InputField label="Home Office Deduction" name="homeOffice" value={formData.homeOffice} onChange={handleChange} />
          </div>
        </div>

        {/* Total deductions preview */}
        {(Number(formData.businessExpenses) + Number(formData.retirement) + Number(formData.insurance) + Number(formData.homeOffice)) > 0 && (
          <div className="bg-violet-50 rounded-2xl px-6 py-4 flex items-center justify-between border border-violet-100">
            <p className="text-sm font-semibold text-violet-700">Total Deductions</p>
            <p className="text-xl font-extrabold text-violet-700">
              ₹{(Number(formData.businessExpenses) + Number(formData.retirement) + Number(formData.insurance) + Number(formData.homeOffice)).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}