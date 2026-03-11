const mongoose = require("mongoose");

const taxEstimateSchema = new mongoose.Schema(
  {
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

module.exports = mongoose.model("TaxEstimate", taxEstimateSchema);
