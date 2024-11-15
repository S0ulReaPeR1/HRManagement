// controllers/firingController.js

const Firing = require("../models/Firing");
const Employee = require("../models/Employee");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const HR = require("../models/HR");
const Attendance = require("../models/Attendance");
const Payroll = require("../models/Payroll");
const Performance = require("../models/Performance"); // Add all relevant models here
const Complaints = require("../models/Complaints")
const LeaveRequest=require("../models/LeaveRequest")

// @desc    Create a new Firing record and delete employee from system
// @route   POST /api/firing
// @access  HR/Admin
exports.createFiring = asyncHandler(async (req, res) => {
  const {
    user_id,
    employee_id,
    reason_for_termination,
    termination_date,
    final_salary_settlement,
  } = req.body;
    console.log(req.body)
  // Validate HR existence
  const hr = await HR.findOne({user:user_id});
  if (!hr) {
    res.status(404);
    throw new Error("HR not found");
  }

  // Validate Employee existence
  const employee = await Employee.findById(employee_id);
  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }

  // Check if the employee has already been terminated
  const existingFiring = await Firing.findOne({ employee_id });
  if (existingFiring) {
    res.status(400);
    throw new Error("This employee has already been terminated");
  }
  const employee_name = employee.name
  console.log(employee_name)
  const hr_id = hr._id;
  // Create firing record
  const firing = new Firing({
    hr_id,
    employee_name,
    reason_for_termination,
    termination_date,
    final_salary_settlement,
  });
  const savedFiring = await firing.save();

  // Remove employee from Employee and User collections
  await Employee.findByIdAndDelete(employee_id);
  
  await User.findOneAndDelete({ _id: employee.user.id });

  // Delete all related records (Attendance, Payroll, Performance, etc.)
  await Attendance.deleteMany({ employee_id: employee_id });
  await Performance.deleteMany({ employee_id: employee_id });
  await Complaints.deleteMany({ employee_id: employee_id });
  await Payroll.deleteMany({ employee_id: employee_id });
  await LeaveRequest.deleteMany({ employee_id: employee_id });

  res.status(201).json({
    message: "Firing record created and employee removed from the system",
    firing: savedFiring,
  });
});


// @desc    Get all Firing records
// @route   GET /api/firing
// @access  HR/Admin
exports.getAllFirings = asyncHandler(async (req, res) => {
  const firings = await Firing.find()
    .populate("hr_id", "name email");
  res.status(200).json(firings);
});

// @desc    Get a single Firing record by ID
// @route   GET /api/firing/:id
// @access  HR/Admin
exports.getFiringById = asyncHandler(async (req, res) => {
  const firing = await Firing.findById(req.params.id)
    .populate("hr_id", "name email")
    .populate("employee_id", "name email");

  if (!firing) {
    res.status(404);
    throw new Error("Firing record not found");
  }

  res.status(200).json(firing);
});

// @desc    Update a Firing record
// @route   PUT /api/firing/:id
// @access  HR/Admin
exports.updateFiring = asyncHandler(async (req, res) => {
  const { reason_for_termination, termination_date, final_salary_settlement } =
    req.body;

  const firing = await Firing.findById(req.params.id);

  if (!firing) {
    res.status(404);
    throw new Error("Firing record not found");
  }

  firing.reason_for_termination =
    reason_for_termination || firing.reason_for_termination;
  firing.termination_date = termination_date || firing.termination_date;
  firing.final_salary_settlement =
    final_salary_settlement || firing.final_salary_settlement;

  const updatedFiring = await firing.save();
  res.status(200).json(updatedFiring);
});

// @desc    Delete a Firing record
// @route   DELETE /api/firing/:id
// @access  HR/Admin
exports.deleteFiring = asyncHandler(async (req, res) => {
  const firing = await Firing.findById(req.params.id);

  if (!firing) {
    res.status(404);
    throw new Error("Firing record not found");
  }

  await firing.remove();
  res.status(200).json({ message: "Firing record removed" });
});
