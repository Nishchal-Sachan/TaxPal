const Budget = require("../models/budget.model");
const Transaction = require("../models/transaction.model");
const Category = require("../models/category.model");

/**
 * Create Budget
 */
exports.createBudget = async (userId, data) => {
  const { category, limit, month } = data;

  // Validation
  if (!category || !limit || !month) {
    const error = new Error("Category, limit and month are required");
    error.statusCode = 400;
    throw error;
  }

  const validCategory = await Category.findOne({
    user: userId,
    name: category,
    type: "expense",
  });

  if (!validCategory) {
    const error = new Error("Invalid expense category");
    error.statusCode = 400;
    throw error;
  }

  if (limit <= 0) {
    const error = new Error("Limit must be greater than 0");
    error.statusCode = 400;
    throw error;
  }

  // Prevent duplicate budget for same month + category
  const existing = await Budget.findOne({
    user: userId,
    category,
    month,
  });

  if (existing) {
    const error = new Error(
      "Budget already exists for this category and month",
    );
    error.statusCode = 409;
    throw error;
  }

  const budget = await Budget.create({
    user: userId,
    category,
    limit,
    month,
  });

  return budget;
};

/**
 * Get All Budgets for User
 */
exports.getBudgets = async (userId) => {
  return await Budget.find({ user: userId });
};

/**
 * Get Budget Progress (Monthly)
 */
exports.getBudgetProgress = async (userId, month) => {
  if (!month) {
    const error = new Error("Month is required (format: YYYY-MM)");
    error.statusCode = 400;
    throw error;
  }

  const budgets = await Budget.find({
    user: userId,
    month,
  });

  if (!budgets.length) {
    return [];
  }

  // Create date range from month
  const start = new Date(`${month}-01`);
  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);

  // Fetch all expense transactions once
  const transactions = await Transaction.find({
    user: userId,
    type: "expense",
    date: { $gte: start, $lt: end },
  });

  const results = budgets.map((budget) => {
    const spent = transactions
      .filter((t) => t.category === budget.category)
      .reduce((sum, t) => sum + t.amount, 0);

    const remaining = budget.limit - spent;

    const percentage =
      budget.limit > 0 ? Math.round((spent / budget.limit) * 100) : 0;

    let status;
    if (percentage < 70) status = "safe";
    else if (percentage <= 100) status = "warning";
    else status = "exceeded";

    return {
      _id: budget._id,
      category: budget.category,
      month: budget.month,
      limit: budget.limit,
      spent,
      remaining,
      percentage,
      status,
    };
  });

  return results;
};

exports.updateBudget = async (userId, id, data) => {
  const budget = await Budget.findOneAndUpdate(
    { _id: id, user: userId },
    data,
    { new: true },
  );

  if (!budget) {
    const error = new Error("Budget not found");
    error.statusCode = 404;
    throw error;
  }

  return budget;
};

exports.deleteBudget = async (userId, id) => {
  const budget = await Budget.findOneAndDelete({
    _id: id,
    user: userId,
  });

  if (!budget) {
    const error = new Error("Budget not found");
    error.statusCode = 404;
    throw error;
  }

  return;
};
