const Category = require("../models/category.model");
const Transaction = require("../models/transaction.model");
const Budget = require("../models/budget.model");
const mongoose = require("mongoose");

exports.createCategory = async (userId, data) => {
  const { name, type } = data;

  if (!name || !type) {
    const error = new Error("Name and type are required");
    error.statusCode = 400;
    throw error;
  }

  if (!["income", "expense"].includes(type)) {
    const error = new Error("Invalid category type");
    error.statusCode = 400;
    throw error;
  }

  try {
    const category = await Category.create({ user: userId, name, type });
    return category;
  } catch (err) {
    if (err.code === 11000) {
      const error = new Error("Category already exists");
      error.statusCode = 409;
      throw error;
    }
    throw err;
  }
};

exports.getCategories = async (userId) => {
  return Category.find({ user: userId }).sort({ createdAt: -1 });
};

exports.updateCategory = async (userId, id, data) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid category ID");
    error.statusCode = 400;
    throw error;
  }

  const category = await Category.findOneAndUpdate(
    { _id: id, user: userId },
    data,
    { new: true }
  );

  if (!category) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  return category;
};

exports.deleteCategory = async (userId, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid category ID");
    error.statusCode = 400;
    throw error;
  }

  const category = await Category.findOne({ _id: id, user: userId });

  if (!category) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  const [txCount, budgetCount] = await Promise.all([
    Transaction.countDocuments({ user: userId, category: category.name }),
    Budget.countDocuments({ user: userId, category: category.name }),
  ]);

  if (txCount > 0 || budgetCount > 0) {
    const error = new Error(
      "Cannot delete category used by transactions or budgets"
    );
    error.statusCode = 409;
    throw error;
  }

  await Category.findOneAndDelete({ _id: id, user: userId });
};
