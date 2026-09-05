const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const env = require("./config/env");
const authRoutes = require("./routes/auth.routes");
const errorMiddleware = require("./middlewares/error.middleware");
const dashboardRoutes = require("./routes/dashboard.routes");
const transactionRoutes = require("./routes/transaction.routes");
const budgetRoutes = require("./routes/budget.routes");
const categoryRoutes = require("./routes/category.routes");
const reportRoutes = require("./routes/report.routes");
const taxRoutes = require("./routes/tax.routes");
const recurringRoutes = require("./routes/recurring.routes");

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "TaxPal API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/tax", taxRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/recurring", recurringRoutes);

app.use((req, res, next) => {
  const error = new Error("Route Not Found");
  error.statusCode = 404;
  next(error);
});

app.use(errorMiddleware);

module.exports = app;
