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

const createTransaction = async (userId, data) => {
  const { type, amount, category, date, description, isTaxDeductible, source } =
    data;

  if (!["income", "expense"].includes(type)) {
    const error = new Error("Invalid transaction type");
    error.statusCode = 400;
    throw error;
  }

  await validateCategory(userId, category, type);

  const transaction = await Transaction.create({
    user: userId,
    type,
    amount,
    category,
    date: new Date(date),
    description: description || "",
    isTaxDeductible: Boolean(isTaxDeductible),
    source: source || "manual",
  });

  return transaction;
};

const getTransactions = async (userId, query = {}) => {
  const {
    page = 1,
    limit = 20,
    type,
    category,
    search,
    startDate,
    endDate,
  } = query;

  const filter = { user: userId };

  if (type) filter.type = type;
  if (category) filter.category = category;
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }
  if (search) {
    filter.$or = [
      { category: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [transactions, total] = await Promise.all([
    Transaction.find(filter).sort({ date: -1 }).skip(skip).limit(Number(limit)),
    Transaction.countDocuments(filter),
  ]);

  return {
    data: transactions,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)) || 1,
    },
  };
};

const importTransactions = async (userId, rows) => {
  const created = [];
  const errors = [];

  for (let i = 0; i < rows.length; i++) {
    try {
      const row = rows[i];
      const tx = await createTransaction(userId, {
        ...row,
        source: "import",
      });
      created.push(tx);
    } catch (err) {
      errors.push({ row: i + 1, message: err.message });
    }
  }

  return { created: created.length, errors };
};

const updateTransaction = async (userId, transactionId, updateData) => {
  if (!mongoose.Types.ObjectId.isValid(transactionId)) {
    const error = new Error("Invalid transaction ID");
    error.statusCode = 400;
    throw error;
  }

  const transaction = await Transaction.findById(transactionId);

  if (!transaction) {
    const error = new Error("Transaction not found");
    error.statusCode = 404;
    throw error;
  }

  if (transaction.user.toString() !== userId) {
    const error = new Error("Unauthorized access");
    error.statusCode = 403;
    throw error;
  }

  const allowedFields = [
    "type",
    "amount",
    "category",
    "date",
    "description",
    "isTaxDeductible",
  ];

  for (const field of allowedFields) {
    if (updateData[field] !== undefined) {
      if (field === "date") {
        transaction[field] = new Date(updateData[field]);
      } else {
        transaction[field] = updateData[field];
      }
    }
  }

  if (updateData.category || updateData.type) {
    await validateCategory(
      userId,
      transaction.category,
      transaction.type
    );
  }

  await transaction.save();
  return transaction;
};

const deleteTransaction = async (userId, transactionId) => {
  if (!mongoose.Types.ObjectId.isValid(transactionId)) {
    const error = new Error("Invalid transaction ID");
    error.statusCode = 400;
    throw error;
  }

  const transaction = await Transaction.findById(transactionId);

  if (!transaction) {
    const error = new Error("Transaction not found");
    error.statusCode = 404;
    throw error;
  }

  if (transaction.user.toString() !== userId) {
    const error = new Error("Unauthorized access");
    error.statusCode = 403;
    throw error;
  }

  await transaction.deleteOne();
  return { message: "Transaction deleted successfully" };
};

const getTaxDeductibleTotal = async (userId, year) => {
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31, 23, 59, 59);

  const result = await Transaction.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        type: "expense",
        isTaxDeductible: true,
        date: { $gte: start, $lte: end },
      },
    },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  return result[0]?.total || 0;
};

const getIncomeTotal = async (userId, year) => {
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31, 23, 59, 59);

  const result = await Transaction.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        type: "income",
        date: { $gte: start, $lte: end },
      },
    },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  return result[0]?.total || 0;
};

module.exports = {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  importTransactions,
  getTaxDeductibleTotal,
  getIncomeTotal,
};
