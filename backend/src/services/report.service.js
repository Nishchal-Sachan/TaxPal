const Transaction = require("../models/transaction.model");
const Report = require("../models/report.model");
const reportHelper = require("./report.helper");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

/**
 * Get Monthly Report Summary
 */
exports.getMonthlySummary = async (userId, monthStr) => {
  const [year, month] = monthStr.split("-").map(Number);
  
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  const transactions = await Transaction.find({
    user: userId,
    date: { $gte: startDate, $lte: endDate },
  });

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const periodLabel = `${months[month - 1]} ${year}`;

  return reportHelper.generateSummary(transactions, periodLabel);
};

/**
 * Get Quarterly Report Summary
 */
exports.getQuarterlySummary = async (userId, quarter, year) => {
  const ranges = {
    Q1: [0, 2],
    Q2: [3, 5],
    Q3: [6, 8],
    Q4: [9, 11]
  };

  const [startM, endM] = ranges[quarter] || [0, 2];
  const startDate = new Date(year, startM, 1);
  const endDate = new Date(year, endM + 1, 0, 23, 59, 59);

  const transactions = await Transaction.find({
    user: userId,
    date: { $gte: startDate, $lte: endDate },
  });

  const periodLabel = `${quarter} ${year}`;
  return reportHelper.generateSummary(transactions, periodLabel);
};

/**
 * Generate Export File
 */
exports.exportReport = async (userId, type, period, summaryData) => {
  const fileName = `report-${userId}-${Date.now()}.${type}`;
  const dir = path.join(__dirname, "../../public/downloads");
  
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  
  const filePath = path.join(dir, fileName);
  const publicPath = `/downloads/${fileName}`;

  if (type === "pdf") {
    await generatePDF(filePath, summaryData);
  } else {
    const csvContent = reportHelper.generateCSVContent(summaryData);
    fs.writeFileSync(filePath, csvContent);
  }

  // Store metadata
  await Report.create({
    userId,
    period: summaryData.period,
    reportType: summaryData.period.includes("Q") ? "quarterly" : "monthly",
    filePath: publicPath,
  });

  return { fileUrl: publicPath };
};

/**
 * Internal PDF Generator
 */
async function generatePDF(filePath, data) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(25).text("TaxPal Financial Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(16).text(`Period: ${data.period}`);
    doc.moveDown();

    doc.fontSize(14).text(`Total Income: ${data.totalIncome}`);
    doc.text(`Total Expense: ${data.totalExpense}`);
    doc.text(`Net Balance: ${data.net}`);
    doc.moveDown();

    doc.text("Expense Breakdown by Category:", { underline: true });
    data.categories.forEach((c) => {
      doc.text(`${c.category}: ${c.amount}`);
    });

    doc.end();
    stream.on("finish", resolve);
    stream.on("error", reject);
  });
}
