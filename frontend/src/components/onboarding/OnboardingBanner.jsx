import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiCheck, FiCircle } from "react-icons/fi";
import apiClient from "../../api/apiClient";

const STEPS = [
  { key: "hasTransaction", label: "Add your first transaction", link: "/transactions" },
  { key: "hasBudget", label: "Set a monthly budget", link: "/budgets" },
  { key: "hasTaxEstimate", label: "Estimate your taxes", link: "/tax-estimator" },
];

export default function OnboardingBanner() {
  const [status, setStatus] = useState(null);
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem("onboarding_dismissed") === "true"
  );

  useEffect(() => {
    apiClient
      .get("/auth/onboarding")
      .then((res) => setStatus(res.data.data))
      .catch(() => {});
  }, []);

  if (dismissed || !status || status.complete) return null;

  const completedCount = STEPS.filter((s) => status[s.key]).length;

  return (
    <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-violet-50 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900">Get started with TaxPal</h3>
          <p className="mt-1 text-sm text-slate-600">
            Complete these steps to set up your finances ({completedCount}/{STEPS.length})
          </p>
        </div>
        <button
          onClick={() => {
            localStorage.setItem("onboarding_dismissed", "true");
            setDismissed(true);
          }}
          className="text-xs text-slate-400 hover:text-slate-600"
        >
          Dismiss
        </button>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {STEPS.map((step) => (
          <Link
            key={step.key}
            to={step.link}
            className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${
              status[step.key]
                ? "bg-emerald-100 text-emerald-800"
                : "bg-white text-slate-700 hover:bg-indigo-50"
            }`}
          >
            {status[step.key] ? (
              <FiCheck className="h-4 w-4 shrink-0" />
            ) : (
              <FiCircle className="h-4 w-4 shrink-0 text-slate-400" />
            )}
            {step.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
