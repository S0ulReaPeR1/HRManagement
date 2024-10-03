// models/Hiring.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Hiring Schema
const hiringSchema = new Schema(
  {
    hr_id: { type: Schema.Types.ObjectId, ref: "HR", required: true },
    open_positions: [
      {
        position_title: { type: String, required: true },
        description: { type: String, required: true },
        department: { type: String, required: true },
        status: { type: String, default: "Open" }, // Open, Closed
      },
    ],
    scheduled_interviews: [
      {
        employee_id: { type: Schema.Types.ObjectId, ref: "Employee" },
        candidate_name: { type: String, required: true },
        interview_date: { type: Date, required: true },
        interviewer: { type: String, required: true },
        status: { type: String, default: "Pending" }, // Pending, Completed
      },
    ],
    checked_documents: [
      {
        employee_id: { type: Schema.Types.ObjectId, ref: "Employee" },
        document_type: { type: String, required: true },
        verified: { type: Boolean, default: false },
        verification_date: { type: Date },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Hiring = mongoose.model("Hiring", hiringSchema);
module.exports = Hiring;
