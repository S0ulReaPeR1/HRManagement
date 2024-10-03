// routes/performanceRoutes.js

const express = require("express");
const {
  createPerformance,
  getAllPerformances,
  getPerformanceById,
  updatePerformance,
  deletePerformance,
} = require("../controllers/performanceController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router
  .route("/")
  .post(protect, createPerformance)
  .get(protect, getAllPerformances);
router
  .route("/:id")
  .get(protect, getPerformanceById)
  .put(protect, updatePerformance)
  .delete(protect, deletePerformance);

module.exports = router;
