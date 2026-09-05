import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useCurrency } from "../../hooks/useCurrency";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const StatCard = ({ label, value, sub, color = "indigo" }) => {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-100",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    rose: "bg-rose-50 text-rose-700 border-rose-100",
    violet: "bg-violet-50 text-violet-700 border-violet-100",
  };
  return (
    <div className={`rounded-2xl border p-5 ${colors[color]}`}>
      <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">{label}</p>
      <p className="text-2xl font-extrabold">{value}</p>
      {sub && <p className="text-xs mt-1 opacity-60">{sub}</p>}
    </div>
  );
};

export default function TaxSummary({ result }) {
  const { format } = useCurrency();
  if (!result) {
    return (
      <div className="bg-gradient-to-br from-indigo-50 to-white border-2 border-dashed border-indigo-100 rounded-3xl p-16 flex flex-col items-center gap-6 text-center h-full">
        <div className="text-6xl opacity-40">📊</div>
        <div>
          <h3 className="text-lg font-bold text-gray-700">Tax Summary</h3>
          <p className="text-gray-400 text-sm max-w-xs mx-auto mt-2">
            Fill in your income details on the left and click <strong>Calculate Tax</strong> to see your full breakdown here.
          </p>
        </div>
      </div>
    );
  }

  const yearlyTax = result.estimatedTax || result.yearlyTax || 0;
  const quarterlyTax = result.quarterlyTax ?? Math.round(yearlyTax / 4);

  const quarters =
    result.quarters && Array.isArray(result.quarters)
      ? result.quarters.map((q) => ({ label: q.quarter, value: q.tax }))
      : ["Q1", "Q2", "Q3", "Q4"].map((q) => ({ label: q, value: quarterlyTax }));

  const barData = {
    labels: quarters.map((q) => q.label),
    datasets: [
      {
        label: "Quarterly Tax",
        data: quarters.map((q) => q.value),
        backgroundColor: ["#818cf8", "#60a5fa", "#34d399", "#f472b6"],
        borderRadius: 10,
        borderSkipped: false,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => format(ctx.parsed.y),
        },
      },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: "#f3f4f6" } },
      x: { grid: { display: false } },
    },
  };

  return (
    <div className="space-y-6">
      {/* Hero card */}
      <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 text-white p-8 rounded-3xl shadow-2xl shadow-indigo-200 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white opacity-5" />
        <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-white opacity-5" />
        <p className="text-indigo-200 text-sm font-bold uppercase tracking-widest mb-2">Estimated Yearly Tax</p>
        <p className="text-6xl font-extrabold tracking-tight">{format(yearlyTax)}</p>
        <p className="text-indigo-200 mt-3 text-sm">
          Effective Rate: <strong className="text-white">{result.effectiveRate || 0}%</strong>
          &nbsp;·&nbsp; Country: <strong className="text-white">{result.country}</strong>
          &nbsp;·&nbsp; Year: <strong className="text-white">{result.year}</strong>
        </p>
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Taxable Income" value={format(result.taxableIncome || 0)} color="indigo" />
        <StatCard label="Total Deductions" value={format(result.deductions || 0)} color="violet" />
        <StatCard label="Quarterly Tax" value={format(quarterlyTax)} sub="Due each quarter" color="emerald" />
        <StatCard label="Monthly Equivalent" value={format(Math.round(yearlyTax / 12))} sub="For planning purposes" color="rose" />
      </div>

      {/* Bar chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Quarterly Breakdown</h3>
        <div style={{ height: "180px" }}>
          <Bar data={barData} options={barOptions} />
        </div>
      </div>

      {/* Quarterly cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quarters.map((q, i) => {
          const colors = ["bg-indigo-500", "bg-sky-500", "bg-emerald-500", "bg-pink-500"];
          return (
            <div key={q.label} className={`${colors[i]} text-white rounded-2xl p-4 text-center shadow-md`}>
              <p className="text-xs font-bold opacity-80 uppercase tracking-wider">{q.label}</p>
              <p className="text-xl font-extrabold mt-1">{format(q.value)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}