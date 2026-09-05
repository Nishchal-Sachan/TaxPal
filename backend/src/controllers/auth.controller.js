const { successResponse } = require("../utils/response");
const {
  registerUser,
  loginUser,
  getUserById,
  updateProfile,
  changePassword,
  deleteAccount,
  exportUserData,
  getOnboardingStatus,
} = require("../services/auth.service");

const register = async (req, res, next) => {
  try {
    const { name, email, password, country, incomeBracket } = req.body;

    if (!name || !email || !password) {
      const error = new Error("All fields are required");
      error.statusCode = 400;
      throw error;
    }

    if (password.length < 8) {
      const error = new Error("Password must be at least 8 characters");
      error.statusCode = 400;
      throw error;
    }

    const result = await registerUser({
      name,
      email,
      password,
      country,
      incomeBracket,
    });

    successResponse(res, result, "User registered successfully", 201);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error("Email and password are required");
      error.statusCode = 400;
      throw error;
    }

    const result = await loginUser({ email, password });
    successResponse(res, result, "Login successful");
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await getUserById(req.user.id);
    successResponse(res, user, "User profile fetched successfully");
  } catch (error) {
    next(error);
  }
};

const updateProfileHandler = async (req, res, next) => {
  try {
    const user = await updateProfile(req.user.id, req.body);
    successResponse(res, user, "Profile updated successfully");
  } catch (error) {
    next(error);
  }
};

const changePasswordHandler = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      const error = new Error("Current and new password are required");
      error.statusCode = 400;
      throw error;
    }
    const result = await changePassword(req.user.id, currentPassword, newPassword);
    successResponse(res, result, "Password updated successfully");
  } catch (error) {
    next(error);
  }
};

const deleteAccountHandler = async (req, res, next) => {
  try {
    const result = await deleteAccount(req.user.id);
    successResponse(res, result, "Account deleted successfully");
  } catch (error) {
    next(error);
  }
};

const exportDataHandler = async (req, res, next) => {
  try {
    const data = await exportUserData(req.user.id);
    successResponse(res, data, "Data exported successfully");
  } catch (error) {
    next(error);
  }
};

const onboardingStatusHandler = async (req, res, next) => {
  try {
    const status = await getOnboardingStatus(req.user.id);
    successResponse(res, status, "Onboarding status fetched");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfileHandler,
  changePasswordHandler,
  deleteAccountHandler,
  exportDataHandler,
  onboardingStatusHandler,
};
