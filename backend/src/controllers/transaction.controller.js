const { successResponse } = require("../utils/response");
const transactionService = require("../services/transaction.service");

exports.createTransaction = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { type, amount, category, date, description, isTaxDeductible } =
      req.body;

    if (!type || !amount || !category || !date) {
      const error = new Error(
        "All fields (type, amount, category, date) are required"
      );
      error.statusCode = 400;
      throw error;
    }

    const transaction = await transactionService.createTransaction(userId, {
      type,
      amount,
      category,
      date,
      description,
      isTaxDeductible,
    });

    successResponse(res, transaction, "Transaction created successfully", 201);
  } catch (error) {
    next(error);
  }
};

exports.getTransactions = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await transactionService.getTransactions(userId, req.query);
    successResponse(res, result, "Transactions fetched successfully");
  } catch (error) {
    next(error);
  }
};

exports.updateTransaction = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const updatedTransaction = await transactionService.updateTransaction(
      userId,
      req.params.id,
      req.body
    );
    successResponse(res, updatedTransaction, "Transaction updated successfully");
  } catch (error) {
    next(error);
  }
};

exports.deleteTransaction = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await transactionService.deleteTransaction(userId, req.params.id);
    successResponse(res, null, "Transaction deleted successfully");
  } catch (error) {
    next(error);
  }
};

exports.importTransactions = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { rows } = req.body;

    if (!Array.isArray(rows) || rows.length === 0) {
      const error = new Error("rows array is required");
      error.statusCode = 400;
      throw error;
    }

    const result = await transactionService.importTransactions(userId, rows);
    successResponse(res, result, "Import completed");
  } catch (error) {
    next(error);
  }
};
