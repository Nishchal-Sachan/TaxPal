const TaxEstimate = require("../models/taxEstimate.model");
const User = require("../models/user.model");
const { TAX_SLABS } = require("../utils/constants");
const { getDueDateInfo } = require("../utils/taxDueDates");
const transactionService = require("./transaction.service");

exports.estimateTax = async (userId, data) => {
  const {
    country,
    year,
    income,
    businessExpenses = 0,
    retirement = 0,
    insurance = 0,
    homeOffice = 0,
    status = "Single",
    useTrackedIncome = false,
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

  let totalIncome = Number(income) || 0;

  if (useTrackedIncome) {
    const tracked = await transactionService.getIncomeTotal(userId, Number(year));
    totalIncome = tracked || totalIncome;
  }

  let deductions =
    Number(businessExpenses) +
    Number(retirement) +
    Number(insurance) +
    Number(homeOffice);

  if (useTrackedIncome) {
    const trackedDeductions = await transactionService.getTaxDeductibleTotal(
      userId,
      Number(year)
    );
    deductions += trackedDeductions;
  }

  let taxableIncome = Math.max(totalIncome - deductions, 0);

  if (filingStatus === "Married") {
    taxableIncome = Math.max(taxableIncome * 0.9, 0);
  }

  let tax = 0;
  let prevLimit = 0;

  for (const slab of slabs) {
    if (taxableIncome <= prevLimit) break;
    const taxableAmount = Math.min(taxableIncome, slab.limit) - prevLimit;
    tax += taxableAmount * slab.rate;
    prevLimit = slab.limit;
  }

  if (filingStatus === "Business") {
    tax = tax * 1.05;
  }

  const yearlyTax = Math.round(tax);
  const quarterlyTax = Math.round(yearlyTax / 4);

  const quarters = ["Q1", "Q2", "Q3", "Q4"].map((q) => ({
    quarter: q,
    tax: quarterlyTax,
    dueDate: getDueDateInfo(country, q, Number(year)).date,
  }));

  const effectiveRate =
    taxableIncome > 0 ? ((yearlyTax / taxableIncome) * 100).toFixed(2) : 0;

  return {
    country,
    year,
    yearlyTax,
    quarterlyTax,
    quarters,
    estimatedTax: yearlyTax,
    effectiveRate,
    taxableIncome,
    deductions,
    totalIncome,
    useTrackedIncome: Boolean(useTrackedIncome),
    disclaimer:
      "Estimates only — not tax advice. Consult a qualified tax professional.",
  };
};

exports.saveTaxEstimate = async (userId, { quarter, amount, year, country }) => {
  if (!quarter || amount === undefined) {
    const error = new Error("Quarter and amount are required");
    error.statusCode = 400;
    throw error;
  }

  const validQuarters = ["Q1", "Q2", "Q3", "Q4"];
  if (!validQuarters.includes(quarter)) {
    const error = new Error("Invalid quarter");
    error.statusCode = 400;
    throw error;
  }

  const taxYear = year || new Date().getFullYear();
  const user = await User.findById(userId);

  const estimate = await TaxEstimate.findOneAndUpdate(
    { user: userId, year: taxYear, quarter },
    {
      user: userId,
      year: taxYear,
      quarter,
      amount,
      country: country || user?.country,
    },
    { new: true, upsert: true, runValidators: true }
  );

  return estimate;
};

exports.saveAllQuarters = async (userId, { year, quarters, country }) => {
  const taxYear = year || new Date().getFullYear();
  const results = [];

  for (const q of quarters) {
    const saved = await exports.saveTaxEstimate(userId, {
      quarter: q.quarter,
      amount: q.tax,
      year: taxYear,
      country,
    });
    results.push(saved);
  }

  return results;
};

exports.getTaxCalendar = async (userId) => {
  const user = await User.findById(userId);
  const country = user?.country || "United States";
  const year = new Date().getFullYear();

  const estimates = await TaxEstimate.find({ user: userId, year }).sort({
    quarter: 1,
  });

  return estimates.map((item) => {
    const dueInfo = getDueDateInfo(country, item.quarter, item.year || year);
    return {
      id: item._id.toString(),
      quarter: item.quarter,
      year: item.year,
      title: dueInfo.title,
      description: "Estimated quarterly tax payment",
      dueDate: dueInfo.date,
      amount: item.amount,
      status: item.status || "unpaid",
      country,
    };
  });
};

exports.toggleTaxStatus = async (userId, estimateId) => {
  const estimate = await TaxEstimate.findOne({ _id: estimateId, user: userId });

  if (!estimate) {
    const error = new Error("Tax estimate not found");
    error.statusCode = 404;
    throw error;
  }

  estimate.status = estimate.status === "paid" ? "unpaid" : "paid";
  await estimate.save();

  return estimate;
};
