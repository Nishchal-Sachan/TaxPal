const CURRENCY_MAP = {
  India: { code: "INR", locale: "en-IN" },
  "United States": { code: "USD", locale: "en-US" },
  "United Kingdom": { code: "GBP", locale: "en-GB" },
  Australia: { code: "AUD", locale: "en-AU" },
  Canada: { code: "CAD", locale: "en-CA" },
};

const formatCurrency = (amount, country = "United States") => {
  const config = CURRENCY_MAP[country] || CURRENCY_MAP["United States"];
  const value = Number(amount) || 0;
  return new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency: config.code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const getCurrencySymbol = (country = "United States") => {
  const formatted = formatCurrency(0, country);
  return formatted.replace(/[\d.,\s]/g, "").trim() || "$";
};

module.exports = { formatCurrency, getCurrencySymbol, CURRENCY_MAP };
