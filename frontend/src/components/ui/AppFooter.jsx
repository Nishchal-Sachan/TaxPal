import { Link } from "react-router-dom";

export default function AppFooter({ className = "" }) {
  return (
    <footer
      className={`border-t border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-500 ${className}`}
    >
      <p>© {new Date().getFullYear()} TaxPal. All rights reserved.</p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        <Link to="/privacy" className="hover:text-indigo-600">
          Privacy Policy
        </Link>
        <span className="hidden text-slate-300 sm:inline">·</span>
        <a
          href="mailto:support@taxpal.app"
          className="hover:text-indigo-600"
        >
          Contact
        </a>
      </div>
    </footer>
  );
}
