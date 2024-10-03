// controllers/attendanceController.js

const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");
const asyncHandler = require("express-async-handler");

// @desc    Create a new Attendance record
// @route   POST /api/attendance
// @access  HR/Admin
exports.createAttendance = asyncHandler(async (req, res) => {
  const { hr_id, employee_id, monitor_attendance } = req.body;

  // Validate HR and Employee existence
  const hr = await require("../models/HR").findById(hr_id);
  const employee = await Employee.findById(employee_id);

  if (!hr) {
    res.status(404);
    throw new Error("HR not found");
  }

  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }

  const attendance = new Attendance({
    hr_id,
    employee_id,
    monitor_attendance,
  });

  const savedAttendance = await attendance.save();
  res.status(201).json(savedAttendance);
});

// @desc    Get all Attendance records
// @route   GET /api/attendance
// @access  HR/Admin
exports.getAllAttendance = asyncHandler(async (req, res) => {
  const attendances = await Attendance.find()
    .populate("hr_id", "name email")
    .populate("employee_id", "name email");
  res.status(200).json(attendances);
});

// @desc    Get a single Attendance record by ID
// @route   GET /api/attendance/:id
// @access  HR/Admin
exports.getAttendanceById = asyncHandler(async (req, res) => {
  const attendance = await Attendance.findById(req.params.id)
    .populate("hr_id", "name email")
    .populate("employee_id", "name email");

  if (!attendance) {
    res.status(404);
    throw new Error("Attendance record not found");
  }

  res.status(200).json(attendance);
});

// @desc    Update an Attendance record
// @route   PUT /api/attendance/:id
// @access  HR/Admin
exports.updateAttendance = asyncHandler(async (req, res) => {
  const { monitor_attendance } = req.body;

  const attendance = await Attendance.findById(req.params.id);

  if (!attendance) {
    res.status(404);
    throw new Error("Attendance record not found");
  }

  attendance.monitor_attendance =
    monitor_attendance || attendance.monitor_attendance;

  const updatedAttendance = await attendance.save();
  res.status(200).json(updatedAttendance);
});

// @desc    Delete an Attendance record
// @route   DELETE /api/attendance/:id
// @access  HR/Admin
exports.deleteAttendance = asyncHandler(async (req, res) => {
  const attendance = await Attendance.findById(req.params.id);

  if (!attendance) {
    res.status(404);
    throw new Error("Attendance record not found");
  }

  await attendance.remove();
  res.status(200).json({ message: "Attendance record removed" });
});
