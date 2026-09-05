const formatCategoryBreakdown = (transactions) => {
  const breakdown = {};

  transactions.forEach((tx) => {
    if (tx.type === "expense") {
      breakdown[tx.category] = (breakdown[tx.category] || 0) + tx.amount;
    }
  });

  return Object.keys(breakdown).map((cat) => ({
    category: cat,
    amount: breakdown[cat],
  }));
};

const generateSummary = (transactions, periodLabel) => {
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    period: periodLabel,
    totalIncome,
    totalExpense,
    net: totalIncome - totalExpense,
    categories: formatCategoryBreakdown(transactions),
    transactionCount: transactions.length,
  };
};

const generateCSVContent = (data, transactions = [], country = "United States") => {
  const { formatCurrency } = require("../utils/formatCurrency");

  let csv = "TaxPal Financial Report\n";
  csv += `Period,${data.period}\n`;
  csv += `Total Income,${formatCurrency(data.totalIncome, country)}\n`;
  csv += `Total Expense,${formatCurrency(data.totalExpense, country)}\n`;
  csv += `Net,${formatCurrency(data.net, country)}\n\n`;

  csv += "Category Breakdown\nCategory,Amount\n";
  data.categories.forEach((c) => {
    csv += `${c.category},${formatCurrency(c.amount, country)}\n`;
  });

  if (transactions.length) {
    csv += "\nTransaction Details\nDate,Type,Category,Amount,Description,Tax Deductible\n";
    transactions.forEach((tx) => {
      const date = new Date(tx.date).toISOString().split("T")[0];
      csv += `${date},${tx.type},${tx.category},${tx.amount},"${(tx.description || "").replace(/"/g, '""')}",${tx.isTaxDeductible ? "Yes" : "No"}\n`;
    });
  }

  return csv;
};

module.exports = {
  formatCategoryBreakdown,
  generateSummary,
  generateCSVContent,
};
