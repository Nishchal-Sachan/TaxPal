const TAX_AUTHORITY_LINKS = {
  India: "https://www.incometax.gov.in",
  "United States": "https://www.irs.gov",
  "United Kingdom": "https://www.gov.uk/government/organisations/hm-revenue-customs",
  Australia: "https://www.ato.gov.au",
};

export default function TaxDisclaimer({ country = "United States" }) {
  const link = TAX_AUTHORITY_LINKS[country] || TAX_AUTHORITY_LINKS["United States"];

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <p className="font-semibold">Estimates only — not tax advice</p>
      <p className="mt-1 text-amber-800">
        TaxPal provides simplified estimates for planning purposes. Consult a
        qualified tax professional for filing decisions.{" "}
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium underline hover:text-amber-950"
        >
          Official tax authority
        </a>
      </p>
    </div>
  );
}
