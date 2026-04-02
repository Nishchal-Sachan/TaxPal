const reportService = require("../services/report.service");
const { successResponse } = require("../utils/response");

/**
 * GET /reports/monthly?month=2026-03
 */
exports.generateMonthlyReport = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { month } = req.query;

    if (!month) {
      const error = new Error("Month parameter (?, month=YYYY-MM) is required");
      error.statusCode = 400;
      throw error;
    }

    const summary = await reportService.getMonthlySummary(userId, month);
    successResponse(res, summary, "Monthly report generated successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * GET /reports/quarterly?quarter=Q1&year=2026
 */
exports.generateQuarterlyReport = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { quarter, year } = req.query;

    if (!quarter || !year) {
      const error = new Error("Quarter and Year parameters are required");
      error.statusCode = 400;
      throw error;
    }

    const summary = await reportService.getQuarterlySummary(userId, quarter, year);
    successResponse(res, summary, "Quarterly report generated successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * GET /reports/export?type=pdf&period=2026-03
 */
exports.exportReport = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { type = "pdf", period } = req.query;

    if (!period) {
      const error = new Error("Period parameter (YYYY-MM or QX-YYYY) is required");
      error.statusCode = 400;
      throw error;
    }

    // Determine if monthly or quarterly
    let summary;
    if (period.includes("-")) {
      summary = await reportService.getMonthlySummary(userId, period);
    } else if (period.includes("Q")) {
      const [quarter, year] = period.split("-");
      summary = await reportService.getQuarterlySummary(userId, quarter, year);
    } else {
      const error = new Error("Invalid period format. Use YYYY-MM or QX-YYYY");
      error.statusCode = 400;
      throw error;
    }

    const reportFile = await reportService.exportReport(userId, type, period, summary);
    successResponse(res, reportFile, "Report exported successfully");
  } catch (error) {
    next(error);
  }
};
