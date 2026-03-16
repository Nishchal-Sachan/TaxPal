const mongoose = require("mongoose");

const taxEstimateSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
  },
  { timestamps: true }
);

// Ensure one estimate per user per quarter (update instead of duplicate)
taxEstimateSchema.index({ user: 1, quarter: 1 }, { unique: true });

module.exports = mongoose.model("TaxEstimate", taxEstimateSchema);
