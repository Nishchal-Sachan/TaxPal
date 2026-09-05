const express = require("express");
const protect = require("../middlewares/auth.middleware");
const { authLimiter } = require("../middlewares/rateLimit.middleware");
const {
  register,
  login,
  getMe,
  updateProfileHandler,
  changePasswordHandler,
  deleteAccountHandler,
  exportDataHandler,
  onboardingStatusHandler,
} = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.get("/me", protect, getMe);
router.patch("/profile", protect, updateProfileHandler);
router.patch("/password", protect, changePasswordHandler);
router.delete("/account", protect, deleteAccountHandler);
router.get("/export", protect, exportDataHandler);
router.get("/onboarding", protect, onboardingStatusHandler);

module.exports = router;
