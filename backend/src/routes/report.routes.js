const express = require("express");
const reportController = require("../controllers/report.controller");
const auth = require("../middlewares/auth.middleware");

const router = express.Router();

// Middleware to protect all report routes
router.use(auth);

/**
 * @route GET /api/reports/monthly
 */
router.get("/monthly", reportController.generateMonthlyReport);

/**
 * @route GET /api/reports/quarterly
 */
router.get("/quarterly", reportController.generateQuarterlyReport);

/**
 * @route GET /api/reports/export
 */
router.get("/export", reportController.exportReport);

module.exports = router;
