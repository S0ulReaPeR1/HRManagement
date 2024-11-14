// models/Performance.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Performance Schema
const performanceSchema = new Schema(
  {
    hr_id: { type: Schema.Types.ObjectId, ref: "HR", required: true },
    employee_id: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    performance_review: [
      {
        score: { type: Number, required: true },
        review_date: { type: Date, required: true },
      },
    ]
  },
  {
    timestamps: true,
  }
);

const Performance = mongoose.model("Performance", performanceSchema);
module.exports = Performance;
