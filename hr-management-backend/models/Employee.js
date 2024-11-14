// models/Employee.js

const mongoose = require("mongoose");
const { type } = require("os");
const Schema = mongoose.Schema;

// Employee Schema
const employeeSchema = new Schema(
  {
    
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hr_id: { type: Schema.Types.ObjectId, ref: "HR", required: true },
    name: { type: String, required: true },
    department: { type: String, required: true },
    address:{type:String },
    phone: { type: String, required: true },
    photo: { type: String }, // URL of the photo
    joining_date: { type: Date, default: Date.now },
    salary:{type:Number}
  },
  {
    timestamps: true,
  }
);

const Employee = mongoose.model("Employee", employeeSchema);
module.exports = Employee;
