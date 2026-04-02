/**
 * Format Categories
 */
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

/**
 * Monthly Summary Generator
 */
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
  };
};

/**
 * CSV Content Generator
 */
const generateCSVContent = (data) => {
  let csv = "Period,Type,Category,Amount\n";
  
  // This is a simple version. We might want to list transactions or just summary.
  // The task asks for CSV format. Let's list summary for now or transactions if available.
  // Given the response structure, summary might be preferred or the actual line items.
  // I'll add the summary totals first.
  csv += `${data.period},Total Income,,${data.totalIncome}\n`;
  csv += `${data.period},Total Expense,,${data.totalExpense}\n`;
  csv += `${data.period},Net,,${data.net}\n\n`;
  csv += "Category,Amount\n";
  data.categories.forEach((c) => {
    csv += `${c.category},${c.amount}\n`;
  });

  return csv;
};

module.exports = {
  formatCategoryBreakdown,
  generateSummary,
  generateCSVContent,
};
