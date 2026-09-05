const CURRENCY_MAP = {
  India: { code: "INR", locale: "en-IN", symbol: "₹" },
  "United States": { code: "USD", locale: "en-US", symbol: "$" },
  "United Kingdom": { code: "GBP", locale: "en-GB", symbol: "£" },
  Australia: { code: "AUD", locale: "en-AU", symbol: "A$" },
  Canada: { code: "CAD", locale: "en-CA", symbol: "CA$" },
};

export const formatCurrency = (amount, country = "United States") => {
  const config = CURRENCY_MAP[country] || CURRENCY_MAP["United States"];
  const value = Number(amount) || 0;

  return new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency: config.code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const getCurrencySymbol = (country = "United States") => {
  return CURRENCY_MAP[country]?.symbol || CURRENCY_MAP["United States"].symbol;
};
