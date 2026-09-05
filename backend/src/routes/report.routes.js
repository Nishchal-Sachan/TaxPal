const express = require("express");
const reportController = require("../controllers/report.controller");
const auth = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(auth);

router.get("/monthly", reportController.generateMonthlyReport);
router.get("/quarterly", reportController.generateQuarterlyReport);
router.get("/tax-year", reportController.generateTaxYearReport);
router.get("/history", reportController.getReportHistory);
router.get("/export", reportController.exportReport);
router.get("/download/:reportId", reportController.downloadReport);

module.exports = router;
