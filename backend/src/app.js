const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const errorMiddleware = require("./middlewares/error.middleware");
const dashboardRoutes = require("./routes/dashboard.routes");
const transactionRoutes = require("./routes/transaction.routes");
const budgetRoutes = require("./routes/budget.routes");
const categoryRoutes = require("./routes/category.routes");
const reportRoutes = require("./routes/report.routes");
const taxRoutes = require("./routes/tax.routes");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// Serving reports as static files
app.use("/downloads", express.static(path.join(__dirname, "../public/downloads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/tax", taxRoutes);
app.use("/api/reports", reportRoutes);

// 404 handler
app.use((req, res, next) => {
  const error = new Error("Route Not Found");
  error.statusCode = 404;
  next(error);
});

// Global error handler
app.use(errorMiddleware);

module.exports = app;
