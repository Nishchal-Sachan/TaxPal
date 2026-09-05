const Transaction = require("../models/transaction.model");

const getDashboardSummary = async (userId, query = {}) => {
  const { range = "all" } = query;

  const match = { user: userId };
  const now = new Date();

  if (range === "month") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    match.date = { $gte: start, $lte: end };
  } else if (range === "year") {
    const start = new Date(now.getFullYear(), 0, 1);
    const end = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
    match.date = { $gte: start, $lte: end };
  }

  const [totals, last5Transactions, budgetAlerts] = await Promise.all([
    Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]),
    Transaction.find(match).sort({ date: -1 }).limit(5),
    getBudgetAlerts(userId),
  ]);

  let totalIncome = 0;
  let totalExpense = 0;

  totals.forEach((t) => {
    if (t._id === "income") totalIncome = t.total;
    if (t._id === "expense") totalExpense = t.total;
  });

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    last5Transactions,
    budgetAlerts,
    range,
  };
};

const getBudgetAlerts = async (userId) => {
  const Budget = require("../models/budget.model");
  const User = require("../models/user.model");

  const user = await User.findById(userId);
  const threshold = user?.preferences?.budgetAlertThreshold || 80;
  const month = new Date().toISOString().slice(0, 7);

  const budgets = await Budget.find({ user: userId, month });
  if (!budgets.length) return [];

  const start = new Date(`${month}-01`);
  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);

  const transactions = await Transaction.find({
    user: userId,
    type: "expense",
    date: { $gte: start, $lt: end },
  });

  return budgets
    .map((budget) => {
      const spent = transactions
        .filter((t) => t.category === budget.category)
        .reduce((sum, t) => sum + t.amount, 0);
      const percentage =
        budget.limit > 0 ? Math.round((spent / budget.limit) * 100) : 0;

      if (percentage >= 100) {
        return {
          category: budget.category,
          level: "exceeded",
          percentage,
          message: `${budget.category} budget exceeded (${percentage}%)`,
        };
      }
      if (percentage >= threshold) {
        return {
          category: budget.category,
          level: "warning",
          percentage,
          message: `${budget.category} budget at ${percentage}%`,
        };
      }
      return null;
    })
    .filter(Boolean);
};

module.exports = { getDashboardSummary };
