const express = require("express");
const {
  createAttendance,
  getAllAttendance,
  getAttendanceById,
  confirmAttendance,
  deleteAttendance,
  applyLeave,
  getAllLeaveRequests,
  getAllLeaveRequestsByID
} = require("../controllers/attendanceController");
const {
  protect,
  authorize,
  authorizeMultiple
  
} = require("../middleware/auth");


const router = express.Router();

// Attendance Routes
router
  .route("/")
  .post(protect,authorize("Employee"), createAttendance) // Employee creates attendance record
  .get(protect,authorize("HR"), getAllAttendance); // HR/Admin retrieves all attendance records

router
  .route("/:id")
  .get(protect,authorizeMultiple(["HR","Employee"]), getAttendanceById) // HR/Admin retrieves a specific attendance record
  .delete(protect,authorize("HR"), deleteAttendance); // HR/Admin deletes an attendance record

// Confirm Attendance Route
router.route("/:id/confirm").put(protect,authorize("HR"), confirmAttendance); // HR/Admin confirms attendance status

// Leave Request Routes

module.exports = router;
