const TaxEstimate = require("../models/taxEstimate.model");
const dueDates = {
  Q1: "2026-06-15",
  Q2: "2026-09-15",
  Q3: "2026-12-15",
  Q4: "2027-03-15"
};
exports.saveTaxEstimate = async (data) => {
  const estimate = new TaxEstimate({
    quarter: data.quarter,
    amount: data.amount
  });
  return await estimate.save();
};
exports.getTaxCalendar = async () => {
  const estimates = await TaxEstimate.find();
  const calendar = estimates.map((item) => ({
    quarter: item.quarter,
    dueDate: dueDates[item.quarter],
    amount: item.amount
  }));
  return calendar;
};
