const express = require("express");
const {
  createAttendance,
  getAllAttendance,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
} = require("../controllers/attendanceController"); // Check the path and names
const { protect } = require("../middleware/auth");

const router = express.Router();

router
  .route("/")
  .post(protect, createAttendance)
  .get(protect, getAllAttendance);
router
  .route("/:id")
  .get(protect, getAttendanceById) // Check function name here
  .put(protect, updateAttendance)
  .delete(protect, deleteAttendance);

module.exports = router;
