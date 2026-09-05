const mongoose = require("mongoose");

const taxEstimateSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    year: {
      type: Number,
      required: true,
      default: () => new Date().getFullYear(),
    },
    quarter: {
      type: String,
      required: true,
      enum: ["Q1", "Q2", "Q3", "Q4"],
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },
    country: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

taxEstimateSchema.index({ user: 1, year: 1, quarter: 1 }, { unique: true });

module.exports = mongoose.model("TaxEstimate", taxEstimateSchema);
