const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  screenshot: { type: String }, // base64 string
  metadata: {
    url: String,
    browser: String,
    os: String,
    viewport: String,
  },
  submittedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["open", "in-progress", "resolved"],
    default: "open"
  },
  severity: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "low"
  },
}, { timestamps: true });

module.exports = mongoose.model("Feedback", feedbackSchema);