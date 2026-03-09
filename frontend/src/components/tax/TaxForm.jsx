
import React from "react";

export default function TaxForm({ formData, setFormData }) {
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-4">Quarterly Tax Calculator</h2>

      {/* TOP GRID - 5 fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Country/Region */}
        <div>
          <label className="text-sm font-medium mb-1 block">Country / Region</label>
          <select
            name="region"
            value={formData.region}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
          >
            <option>India</option>
            <option>United States</option>
            <option>United Kingdom</option>
            <option>Australia</option>
          </select>
        </div>

        {/* State/Province */}
        <div>
          <label className="text-sm font-medium mb-1 block">State / Province</label>
          <input
            type="text"
            name="stateProvince"
            value={formData.stateProvince}
            onChange={handleChange}
            placeholder="Enter state"
            className="w-full border px-3 py-2 rounded-md"
          />
        </div>

        {/* Filing Status */}
        <div>
          <label className="text-sm font-medium mb-1 block">Filing Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
          >
            <option>Single</option>
            <option>Married</option>
            <option>Business</option>
          </select>
        </div>

        {/* Quarter */}
        <div>
          <label className="text-sm font-medium mb-1 block">Quarter</label>
          <select
            name="quarter"
            value={formData.quarter}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
          >
            <option>Q1</option>
            <option>Q2</option>
            <option>Q3</option>
            <option>Q4</option>
          </select>
        </div>

        {/* Gross Income */}
        <div>
          <label className="text-sm font-medium mb-1 block">Gross Income for Quarter</label>
          <input
            type="number"
            name="income"
            value={formData.income}
            onChange={handleChange}
            placeholder="Enter income"
            className="w-full border px-3 py-2 rounded-md"
            min="0"
          />
        </div>
      </div>

      {/* DEDUCTIONS SECTION */}
      <h3 className="font-semibold mt-6 mb-3">Deductions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Business Expenses</label>
          <input
            type="number"
            name="businessExpenses"
            value={formData.businessExpenses}
            onChange={handleChange}
            placeholder="Business Expenses"
            className="w-full border px-3 py-2 rounded-md"
            min="0"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Retirement Contributions</label>
          <input
            type="number"
            name="retirement"
            value={formData.retirement}
            onChange={handleChange}
            placeholder="Retirement Contributions"
            className="w-full border px-3 py-2 rounded-md"
            min="0"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Health Insurance Premiums</label>
          <input
            type="number"
            name="insurance"
            value={formData.insurance}
            onChange={handleChange}
            placeholder="Health Insurance Premiums"
            className="w-full border px-3 py-2 rounded-md"
            min="0"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Home Office Deduction</label>
          <input
            type="number"
            name="homeOffice"
            value={formData.homeOffice}
            onChange={handleChange}
            placeholder="Home Office Deduction"
            className="w-full border px-3 py-2 rounded-md"
            min="0"
          />
        </div>
      </div>
    </div>
  );
}
