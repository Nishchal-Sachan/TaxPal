const TaxEstimate = require("../models/taxEstimate.model");
const { TAX_SLABS } = require("../utils/constants");

/**
 * Estimate Tax
 * Used by POST /tax/estimate
 */
exports.estimateTax = async (userId, data) => {

  const {
    country,
    year,
    income = 0,
    businessExpenses = 0,
    retirement = 0,
    insurance = 0,
    homeOffice = 0,
    status = "Single"
  } = data;

  if (!country || !year) {
    const error = new Error("Country and year are required");
    error.statusCode = 400;
    throw error;
  }

  const slabs = TAX_SLABS[country];

  if (!slabs) {
    const error = new Error("Unsupported country for tax calculation");
    error.statusCode = 400;
    throw error;
  }

  const validStatuses = ["Single", "Married", "Business"];
  const filingStatus = validStatuses.includes(status) ? status : "Single";

  const totalIncome = Number(income);

  const deductions =
    Number(businessExpenses) +
    Number(retirement) +
    Number(insurance) +
    Number(homeOffice);

  let taxableIncome = Math.max(totalIncome - deductions, 0);

  // Filing status: Married → 10% deduction from taxable income
  if (filingStatus === "Married") {
    taxableIncome = Math.max(taxableIncome * 0.9, 0);
  }

  let tax = 0;
  let prevLimit = 0;

  for (const slab of slabs) {

    if (taxableIncome <= prevLimit) break;

    const taxableAmount =
      Math.min(taxableIncome, slab.limit) - prevLimit;

    tax += taxableAmount * slab.rate;

    prevLimit = slab.limit;
  }

  // Filing status: Business → additional 5% tax on final tax
  if (filingStatus === "Business") {
    tax = tax * 1.05;
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
    country,
    year,
    yearlyTax,
    quarterlyTax,
    quarters,
    estimatedTax: yearlyTax,
    effectiveRate,
    taxableIncome,
    deductions
  };
};


/**
 * Save Quarterly Tax Estimate
 * Used by POST /tax/save
 * Updates existing entry if user+quarter already exists (no duplicates)
 */
exports.saveTaxEstimate = async (userId, quarter, amount) => {

  if (!quarter || !amount) {
    const error = new Error("Quarter and amount are required");
    error.statusCode = 400;
    throw error;
  }

  const validQuarters = ["Q1", "Q2", "Q3", "Q4"];
  if (!validQuarters.includes(quarter)) {
    const error = new Error("Invalid quarter. Must be Q1, Q2, Q3, or Q4");
    error.statusCode = 400;
    throw error;
  }

  const estimate = await TaxEstimate.findOneAndUpdate(
    { user: userId, quarter },
    { user: userId, quarter, amount },
    { new: true, upsert: true, runValidators: true }
  );

  return estimate;
};


/**
 * Get Tax Calendar
 * Used by GET /tax/calendar
 * Q1→Jun 15, Q2→Sep 15, Q3→Dec 15, Q4→Mar 15 (next year)
 */
exports.getTaxCalendar = async (userId) => {

  const year = new Date().getFullYear();
  const nextYear = year + 1;

  const dueDates = {
    Q1: { date: `${year}-06-15`, title: "Q1 Estimated Payment" },
    Q2: { date: `${year}-09-15`, title: "Q2 Estimated Payment" },
    Q3: { date: `${year}-12-15`, title: "Q3 Estimated Payment" },
    Q4: { date: `${nextYear}-03-15`, title: "Q4 Estimated Payment" }
  };

  const estimates = await TaxEstimate.find({
    user: userId
  }).sort({ quarter: 1 });

  const calendar = estimates.map((item) => {
    const dueInfo = dueDates[item.quarter];
    return {
      quarter: item.quarter,
      title: dueInfo.title,
      description: "Estimated quarterly tax payment",
      dueDate: dueInfo.date,
      amount: item.amount
    };
  });

  return calendar;
};