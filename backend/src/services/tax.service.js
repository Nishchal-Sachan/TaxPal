const { TAX_SLABS_INDIA } = require("../utils/constants");

exports.estimateTax = async (userId, data) => {

  const {
    country,
    year,
    income = 0,
    businessExpenses = 0,
    retirement = 0,
    insurance = 0,
    homeOffice = 0
  } = data;

  if (!country || !year) {
    const error = new Error("Country and year are required");
    error.statusCode = 400;
    throw error;
  }

  const totalIncome = Number(income);

  const deductions =
    Number(businessExpenses) +
    Number(retirement) +
    Number(insurance) +
    Number(homeOffice);

  const taxableIncome = Math.max(totalIncome - deductions, 0);

  let tax = 0;
  let prevLimit = 0;

  for (const slab of TAX_SLABS_INDIA) {

    if (taxableIncome <= prevLimit) break;

    const taxableAmount =
      Math.min(taxableIncome, slab.limit) - prevLimit;

    tax += taxableAmount * slab.rate;

    prevLimit = slab.limit;
  }

  const yearlyTax = Math.round(tax);
  const quarterlyTax = Math.round(yearlyTax / 4);

  const quarters = [
    { quarter: "Q1", tax: quarterlyTax },
    { quarter: "Q2", tax: quarterlyTax },
    { quarter: "Q3", tax: quarterlyTax },
    { quarter: "Q4", tax: quarterlyTax }
  ];

  const effectiveRate =
    taxableIncome > 0
      ? ((yearlyTax / taxableIncome) * 100).toFixed(2)
      : 0;

  return {
    yearlyTax,
    quarterlyTax,
    quarters,
    estimatedTax: yearlyTax,
    effectiveRate,
    taxableIncome,
    deductions
  };
};