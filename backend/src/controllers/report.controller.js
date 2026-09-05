const reportService = require("../services/report.service");
const Transaction = require("../models/transaction.model");
const { successResponse } = require("../utils/response");
const path = require("path");

exports.generateMonthlyReport = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { month } = req.query;

    if (!month) {
      const error = new Error("Month parameter (YYYY-MM) is required");
      error.statusCode = 400;
      throw error;
    }

    const summary = await reportService.getMonthlySummary(userId, month);
    successResponse(res, summary, "Monthly report generated successfully");
  } catch (error) {
    next(error);
  }
};

exports.generateQuarterlyReport = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { quarter, year } = req.query;

    if (!quarter || !year) {
      const error = new Error("Quarter and Year parameters are required");
      error.statusCode = 400;
      throw error;
    }

    const summary = await reportService.getQuarterlySummary(
      userId,
      quarter,
      year
    );
    successResponse(res, summary, "Quarterly report generated successfully");
  } catch (error) {
    next(error);
  }
};

exports.generateTaxYearReport = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { year } = req.query;

    if (!year) {
      const error = new Error("Year parameter is required");
      error.statusCode = 400;
      throw error;
    }

    const summary = await reportService.getTaxYearSummary(userId, year);
    successResponse(res, summary, "Tax year report generated successfully");
  } catch (error) {
    next(error);
  }
};

exports.exportReport = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { type = "pdf", period } = req.query;

    if (!period) {
      const error = new Error("Period parameter is required");
      error.statusCode = 400;
      throw error;
    }

    let summary;
    let transactions = [];

    if (/^Q[1-4]-\d{4}$/i.test(period)) {
      const [quarter, year] = period.split("-");
      summary = await reportService.getQuarterlySummary(userId, quarter, year);
    } else if (/^\d{4}-\d{2}$/.test(period)) {
      summary = await reportService.getMonthlySummary(userId, period);
    } else if (/^\d{4}$/.test(period)) {
      summary = await reportService.getTaxYearSummary(userId, period);
    } else {
      const error = new Error("Invalid period format");
      error.statusCode = 400;
      throw error;
    }

    if (type === "csv") {
      const [year] = period.includes("-") ? period.split("-") : [period];
      const startYear = parseInt(year, 10);
      transactions = await Transaction.find({
        user: userId,
        date: {
          $gte: new Date(startYear, 0, 1),
          $lte: new Date(startYear, 11, 31),
        },
      }).sort({ date: -1 });
    }

    const reportFile = await reportService.exportReport(
      userId,
      type,
      period,
      summary,
      transactions
    );
    successResponse(res, reportFile, "Report exported successfully");
  } catch (error) {
    next(error);
  }
};

exports.downloadReport = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { reportId } = req.params;

    const { fullPath, fileName } = await reportService.downloadReport(
      userId,
      reportId
    );

    const ext = path.extname(fileName).slice(1);
    const contentType =
      ext === "pdf" ? "application/pdf" : "text/csv";

    res.setHeader("Content-Type", contentType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="taxpal-report.${ext}"`
    );
    res.sendFile(fullPath);
  } catch (error) {
    next(error);
  }
};

exports.getReportHistory = async (req, res, next) => {
  try {
    const history = await reportService.getReportHistory(req.user.id);
    successResponse(res, history, "Report history fetched");
  } catch (error) {
    next(error);
  }
};
