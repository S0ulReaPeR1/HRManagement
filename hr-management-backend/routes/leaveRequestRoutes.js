
const express = require("express");

const {
    getAllLeaveRequests,
    getAllLeaveRequestsByID,
    applyLeave,
    confirmLeaveRequest
} = require("../controllers/leaveRequestController");
const { protect, authorize, authorizeMultiple } = require("../middleware/auth");

const router = express.Router();

router
  .route("/")
  .post(protect, authorize("Employee"), applyLeave) // Employee applies for leave
  .get(protect, authorizeMultiple(["HR", "Employee"]), getAllLeaveRequests); // HR/Admin retrieves all leave requests

router
  .route("/:id")
  .get(protect, authorize("Employee"), getAllLeaveRequestsByID); // HR/Admin retrieves all leave requests of a specific employee

router
    .route("/:id/confirm/:status")
    .put(protect, authorize("HR"), confirmLeaveRequest); // HR approves a leave request

  module.exports =router;