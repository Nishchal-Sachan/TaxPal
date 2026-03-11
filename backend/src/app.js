const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const errorMiddleware = require("./middlewares/error.middleware");
const dashboardRoutes = require("./routes/dashboard.routes");
const transactionRoutes = require("./routes/transaction.routes");
const taxRoutes = require("./routes/tax.routes");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/tax", taxRoutes);

// 404 handler
app.use((req, res, next) => {
  const error = new Error("Route Not Found");
  error.statusCode = 404;
  next(error);
});

// Global error handler
app.use(errorMiddleware);

module.exports = app;
