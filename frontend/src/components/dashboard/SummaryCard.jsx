const SummaryCard = ({ title, value, icon, variant = "default" }) => {
  const variants = {
    income: "border-emerald-100 bg-gradient-to-br from-emerald-50 to-white",
    expense: "border-rose-100 bg-gradient-to-br from-rose-50 to-white",
    balance: "border-indigo-100 bg-gradient-to-br from-indigo-50 to-white",
    default: "border-slate-200 bg-white",
  };

  const iconColors = {
    income: "text-emerald-500 bg-emerald-100",
    expense: "text-rose-500 bg-rose-100",
    balance: "text-indigo-500 bg-indigo-100",
    default: "text-slate-400 bg-slate-100",
  };

  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm transition hover:shadow-md ${variants[variant]}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
        </div>
        {icon && (
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${iconColors[variant]}`}
          >
            {icon}
          </span>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;
