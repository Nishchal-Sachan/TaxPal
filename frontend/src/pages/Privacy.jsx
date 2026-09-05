import { Link } from "react-router-dom";
import AppFooter from "../components/ui/AppFooter";

export default function Privacy() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Privacy Policy</h1>
        <p className="mt-4 text-sm text-slate-600 leading-relaxed">
          TaxPal stores your financial data securely and uses it only to provide
          personal finance and tax estimation features. We do not sell your data
          to third parties. You may export or delete your data at any time from
          Settings.
        </p>
        <p className="mt-4 text-sm text-slate-600 leading-relaxed">
          Tax estimates are for informational purposes only and do not constitute
          tax advice. Consult a qualified professional for tax filing decisions.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-block text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          Back to login
        </Link>
      </div>
      </div>
      <AppFooter />
    </div>
  );
}
