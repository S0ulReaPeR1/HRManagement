// routes/complaintsRoutes.js

const express = require("express");
const {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
} = require("../controllers/complaintsController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.route("/").post(protect, createComplaint).get(protect, getAllComplaints);
router
  .route("/:id")
  .get(protect, getComplaintById)
  .put(protect, updateComplaint)
  .delete(protect, deleteComplaint);

module.exports = router;
