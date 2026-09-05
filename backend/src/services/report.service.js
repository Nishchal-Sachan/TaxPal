const Transaction = require("../models/transaction.model");
const Report = require("../models/report.model");
const User = require("../models/user.model");
const reportHelper = require("./report.helper");
const { formatCurrency } = require("../utils/formatCurrency");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const STORAGE_DIR = path.join(__dirname, "../../storage/reports");
const FILE_TTL_MS = 48 * 60 * 60 * 1000;

const ensureStorageDir = () => {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  }
};

const cleanupOldReports = async () => {
  ensureStorageDir();
  const cutoff = new Date(Date.now() - FILE_TTL_MS);

  const oldReports = await Report.find({ createdAt: { $lt: cutoff } });
  for (const report of oldReports) {
    const fullPath = path.join(STORAGE_DIR, path.basename(report.filePath));
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    await Report.findByIdAndDelete(report._id);
  }
};

exports.getMonthlySummary = async (userId, monthStr) => {
  const [year, month] = monthStr.split("-").map(Number);
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  const transactions = await Transaction.find({
    user: userId,
    date: { $gte: startDate, $lte: endDate },
  }).sort({ date: -1 });

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const periodLabel = `${months[month - 1]} ${year}`;

  return reportHelper.generateSummary(transactions, periodLabel);
};

exports.getQuarterlySummary = async (userId, quarter, year) => {
  const ranges = { Q1: [0, 2], Q2: [3, 5], Q3: [6, 8], Q4: [9, 11] };
  const [startM, endM] = ranges[quarter] || [0, 2];
  const startDate = new Date(year, startM, 1);
  const endDate = new Date(year, endM + 1, 0, 23, 59, 59);

  const transactions = await Transaction.find({
    user: userId,
    date: { $gte: startDate, $lte: endDate },
  }).sort({ date: -1 });

  return reportHelper.generateSummary(transactions, `${quarter} ${year}`);
};

exports.getTaxYearSummary = async (userId, year) => {
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31, 23, 59, 59);

  const transactions = await Transaction.find({
    user: userId,
    date: { $gte: startDate, $lte: endDate },
  }).sort({ date: -1 });

  return reportHelper.generateSummary(transactions, `Tax Year ${year}`);
};

exports.exportReport = async (userId, type, period, summaryData, transactions = []) => {
  ensureStorageDir();
  await cleanupOldReports();

  const user = await User.findById(userId);
  const country = user?.country || "United States";

  const fileName = `${userId}-${Date.now()}.${type}`;
  const filePath = path.join(STORAGE_DIR, fileName);

  if (type === "pdf") {
    await generatePDF(filePath, summaryData, country, user?.name);
  } else {
    const csvContent = reportHelper.generateCSVContent(summaryData, transactions, country);
    fs.writeFileSync(filePath, csvContent);
  }

  const report = await Report.create({
    userId,
    period: summaryData.period,
    reportType: summaryData.period.includes("Q") ? "quarterly" : "monthly",
    filePath: fileName,
  });

  return { reportId: report._id, fileName: report.filePath };
};

exports.downloadReport = async (userId, reportId) => {
  const report = await Report.findOne({ _id: reportId, userId });

  if (!report) {
    const error = new Error("Report not found");
    error.statusCode = 404;
    throw error;
  }

  const fullPath = path.join(STORAGE_DIR, report.filePath);

  if (!fs.existsSync(fullPath)) {
    const error = new Error("Report file no longer available");
    error.statusCode = 410;
    throw error;
  }

  return { fullPath, fileName: report.filePath };
};

exports.getReportHistory = async (userId) => {
  return Report.find({ userId }).sort({ createdAt: -1 }).limit(20);
};

async function generatePDF(filePath, data, country, userName) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(22).text("TaxPal Financial Report", { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(10).fillColor("#666").text(`Generated for: ${userName || "User"}`, { align: "center" });
    doc.text(`Date: ${new Date().toLocaleDateString()}`, { align: "center" });
    doc.moveDown();
    doc.fillColor("#000").fontSize(14).text(`Period: ${data.period}`);
    doc.moveDown();

    doc.fontSize(12);
    doc.text(`Total Income: ${formatCurrency(data.totalIncome, country)}`);
    doc.text(`Total Expense: ${formatCurrency(data.totalExpense, country)}`);
    doc.text(`Net Balance: ${formatCurrency(data.net, country)}`);
    doc.moveDown();

    doc.text("Expense Breakdown:", { underline: true });
    data.categories.forEach((c) => {
      doc.text(`${c.category}: ${formatCurrency(c.amount, country)}`);
    });

    doc.moveDown();
    doc.fontSize(8).fillColor("#999").text(
      "This report is for informational purposes only. Not tax advice.",
      { align: "center" }
    );

    doc.end();
    stream.on("finish", resolve);
    stream.on("error", reject);
  });
}
