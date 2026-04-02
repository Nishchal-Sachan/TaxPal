const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    period: {
      type: String,
      required: true,
      trim: true,
      // "Jan 2026" OR "Q1 2026"
    },
    reportType: {
      type: String,
      enum: ["monthly", "quarterly"],
      required: true,
    },
    filePath: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
