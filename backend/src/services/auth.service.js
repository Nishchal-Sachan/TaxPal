const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const Category = require("../models/category.model");
const Transaction = require("../models/transaction.model");
const Budget = require("../models/budget.model");
const TaxEstimate = require("../models/taxEstimate.model");
const Report = require("../models/report.model");
const RecurringTransaction = require("../models/recurringTransaction.model");
const { generateToken } = require("../config/jwt");
const { DEFAULT_CATEGORIES } = require("../utils/defaultCategories");

const seedDefaultCategories = async (userId) => {
  const docs = DEFAULT_CATEGORIES.map((c) => ({
    user: userId,
    name: c.name,
    type: c.type,
  }));
  await Category.insertMany(docs);
};

const ensureDefaultCategories = async (userId) => {
  const count = await Category.countDocuments({ user: userId });
  if (count === 0) {
    await seedDefaultCategories(userId);
  }
};

const registerUser = async ({
  name,
  email,
  password,
  country,
  incomeBracket,
}) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const error = new Error("User already exists");
    error.statusCode = 409;
    throw error;
  }

  if (password.length < 8) {
    const error = new Error("Password must be at least 8 characters");
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    country,
    incomeBracket,
  });

  await seedDefaultCategories(user._id);

  const userObj = user.toObject();
  delete userObj.password;

  const token = generateToken({ id: user._id });

  return { user: userObj, token };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  await ensureDefaultCategories(user._id);

  const userObj = user.toObject();
  delete userObj.password;

  const token = generateToken({ id: user._id });

  return { user: userObj, token };
};

const getUserById = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const userObj = user.toObject();
  delete userObj.password;

  return userObj;
};

const updateProfile = async (userId, data) => {
  const allowed = ["name", "country", "incomeBracket", "onboardingComplete"];
  const update = {};
  allowed.forEach((field) => {
    if (data[field] !== undefined) update[field] = data[field];
  });

  const user = await User.findByIdAndUpdate(userId, update, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select("+password");

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    const error = new Error("Current password is incorrect");
    error.statusCode = 401;
    throw error;
  }

  if (newPassword.length < 8) {
    const error = new Error("New password must be at least 8 characters");
    error.statusCode = 400;
    throw error;
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  return { message: "Password updated successfully" };
};

const deleteAccount = async (userId) => {
  await Promise.all([
    Transaction.deleteMany({ user: userId }),
    Budget.deleteMany({ user: userId }),
    Category.deleteMany({ user: userId }),
    TaxEstimate.deleteMany({ user: userId }),
    Report.deleteMany({ userId }),
    RecurringTransaction.deleteMany({ user: userId }),
    User.findByIdAndDelete(userId),
  ]);

  return { message: "Account deleted successfully" };
};

const exportUserData = async (userId) => {
  const [user, transactions, budgets, categories, taxEstimates, recurring] =
    await Promise.all([
      getUserById(userId),
      Transaction.find({ user: userId }).sort({ date: -1 }),
      Budget.find({ user: userId }),
      Category.find({ user: userId }),
      TaxEstimate.find({ user: userId }),
      RecurringTransaction.find({ user: userId }),
    ]);

  return {
    exportedAt: new Date().toISOString(),
    user,
    transactions,
    budgets,
    categories,
    taxEstimates,
    recurring,
  };
};

const getOnboardingStatus = async (userId) => {
  const [txCount, budgetCount, taxCount] = await Promise.all([
    Transaction.countDocuments({ user: userId }),
    Budget.countDocuments({ user: userId }),
    TaxEstimate.countDocuments({ user: userId }),
  ]);

  return {
    hasTransaction: txCount > 0,
    hasBudget: budgetCount > 0,
    hasTaxEstimate: taxCount > 0,
    complete: txCount > 0 && budgetCount > 0 && taxCount > 0,
  };
};

module.exports = {
  registerUser,
  loginUser,
  getUserById,
  updateProfile,
  changePassword,
  deleteAccount,
  exportUserData,
  getOnboardingStatus,
  ensureDefaultCategories,
};
