const RecurringTransaction = require("../models/recurringTransaction.model");
const Transaction = require("../models/transaction.model");
const Category = require("../models/category.model");
const mongoose = require("mongoose");

const validateCategory = async (userId, category, type) => {
  const valid = await Category.findOne({ user: userId, name: category, type });
  if (!valid) {
    const error = new Error(`Invalid ${type} category`);
    error.statusCode = 400;
    throw error;
  }
};

exports.create = async (userId, data) => {
  await validateCategory(userId, data.category, data.type);
  return RecurringTransaction.create({ user: userId, ...data });
};

exports.getAll = async (userId) => {
  return RecurringTransaction.find({ user: userId }).sort({ nextDate: 1 });
};

exports.update = async (userId, id, data) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid ID");
    error.statusCode = 400;
    throw error;
  }

  const item = await RecurringTransaction.findOneAndUpdate(
    { _id: id, user: userId },
    data,
    { new: true }
  );

  if (!item) {
    const error = new Error("Recurring transaction not found");
    error.statusCode = 404;
    throw error;
  }

  return item;
};

exports.delete = async (userId, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid ID");
    error.statusCode = 400;
    throw error;
  }

  const item = await RecurringTransaction.findOneAndDelete({
    _id: id,
    user: userId,
  });

  if (!item) {
    const error = new Error("Recurring transaction not found");
    error.statusCode = 404;
    throw error;
  }
};

const advanceDate = (date, frequency) => {
  const next = new Date(date);
  if (frequency === "weekly") next.setDate(next.getDate() + 7);
  else if (frequency === "monthly") next.setMonth(next.getMonth() + 1);
  else if (frequency === "yearly") next.setFullYear(next.getFullYear() + 1);
  return next;
};

exports.processDue = async (userId) => {
  const now = new Date();
  const due = await RecurringTransaction.find({
    user: userId,
    active: true,
    nextDate: { $lte: now },
  });

  const created = [];

  for (const item of due) {
    const tx = await Transaction.create({
      user: userId,
      type: item.type,
      category: item.category,
      amount: item.amount,
      date: item.nextDate,
      description: item.description || `Recurring: ${item.category}`,
      isTaxDeductible: item.isTaxDeductible,
      source: "recurring",
    });

    item.nextDate = advanceDate(item.nextDate, item.frequency);
    await item.save();
    created.push(tx);
  }

  return created;
};
