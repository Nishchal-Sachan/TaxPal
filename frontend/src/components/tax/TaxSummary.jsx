export default function TaxSummary({ result }) {
  if (!result) {
    return (
      <div className="bg-gray-100 p-8 rounded-xl text-center shadow">
        <div className="text-4xl mb-4">📊</div>
        <h3 className="text-lg font-semibold mb-2">Tax Summary</h3>
        <p className="text-gray-600">
          Enter your income to calculate estimated yearly and quarterly tax.
        </p>
      </div>
    );
  }

  const yearlyTax = result.estimatedTax || 0;
  const quarterlyTax = result.quarterlyTax ?? yearlyTax / 4;

  const quarters =
    result.quarters && Array.isArray(result.quarters)
      ? result.quarters.map((q) => ({ label: q.quarter, value: q.tax }))
      : [
          { label: "Q1", value: quarterlyTax },
          { label: "Q2", value: quarterlyTax },
          { label: "Q3", value: quarterlyTax },
          { label: "Q4", value: quarterlyTax }
        ];

  return (
    <div className="space-y-6">

      {/* YEARLY TAX CARD */}
      <div className="bg-linear-to-br from-blue-500 to-indigo-600 text-white p-8 rounded-2xl shadow-2xl">
        <h2 className="text-center text-lg opacity-90 mb-2">
          Estimated Yearly Tax
        </h2>

        <p className="text-center text-5xl font-bold mb-4">
          ₹{yearlyTax.toLocaleString()}
        </p>

        <p className="text-center text-blue-100">
          Effective Rate: {result.effectiveRate || 0}%
        </p>
      </div>

      {/* TAX BREAKDOWN CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white border rounded-xl p-4 shadow">
          <p className="text-sm text-gray-500">Taxable Income</p>
          <p className="text-xl font-bold">
            ₹{result.taxableIncome?.toLocaleString() || 0}
          </p>
        </div>

        <div className="bg-white border rounded-xl p-4 shadow">
          <p className="text-sm text-gray-500">Total Deductions</p>
          <p className="text-xl font-bold">
            ₹{result.deductions?.toLocaleString() || 0}
          </p>
        </div>

        <div className="bg-white border rounded-xl p-4 shadow">
          <p className="text-sm text-gray-500">Quarterly Tax</p>
          <p className="text-xl font-bold">
            ₹{Number(quarterlyTax).toLocaleString()}
          </p>
        </div>

      </div>

      {/* QUARTERLY BREAKDOWN */}
      <div className="bg-white border rounded-xl p-6 shadow">

        <h3 className="text-lg font-semibold mb-4">
          Quarterly Tax Breakdown
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          {quarters.map((q) => (
            <div
              key={q.label}
              className="border rounded-lg p-4 text-center hover:shadow-md transition"
            >
              <p className="text-gray-500 text-sm">{q.label}</p>
              <p className="text-xl font-bold text-blue-600">
                ₹{q.value.toLocaleString()}
              </p>
            </div>
          ))}

        </div>

      </div>

    </div>
  );
}