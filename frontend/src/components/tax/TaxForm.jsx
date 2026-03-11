import React from "react";

export default function TaxForm({ formData, setFormData }) {

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">

      <h2 className="text-lg font-semibold mb-4">
        Tax Calculator
      </h2>

      {/* BASIC INFO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Country */}
        <div>
          <label className="text-sm font-medium mb-1 block">
            Country
          </label>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
          >
            <option value="India">India</option>
            <option value="United States">United States</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Australia">Australia</option>
          </select>
        </div>

        {/* Year */}
        <div>
          <label className="text-sm font-medium mb-1 block">
            Tax Year
          </label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
          />
        </div>

        {/* Income */}
        <div className="md:col-span-2">
          <label className="text-sm font-medium mb-1 block">
            Annual Income
          </label>
          <input
            type="number"
            name="income"
            value={formData.income}
            onChange={handleChange}
            placeholder="Enter your annual income"
            className="w-full border px-3 py-2 rounded-md"
            min="0"
          />
        </div>
      </div>

      {/* DEDUCTIONS */}
      <h3 className="font-semibold mt-6 mb-3">
        Deductions
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div>
          <label className="text-sm font-medium mb-1 block">
            Business Expenses
          </label>
          <input
            type="number"
            name="businessExpenses"
            value={formData.businessExpenses}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
            min="0"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">
            Retirement Contributions
          </label>
          <input
            type="number"
            name="retirement"
            value={formData.retirement}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
            min="0"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">
            Health Insurance
          </label>
          <input
            type="number"
            name="insurance"
            value={formData.insurance}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
            min="0"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">
            Home Office Deduction
          </label>
          <input
            type="number"
            name="homeOffice"
            value={formData.homeOffice}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
            min="0"
          />
        </div>

      </div>

    </div>
  );
}