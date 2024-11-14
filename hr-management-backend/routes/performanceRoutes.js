const express = require("express");
const router = express.Router();
const {
  createPerformance,
  getPerformanceHistory,
  getPerformanceHistoryUser
} = require("../controllers/performanceController");

// Route to create or update a performance record for an employee
router.post( "/", createPerformance);

// Route to get the performance history of a specific employee
router.get("/:id", getPerformanceHistory);

router.get("/history/:id", getPerformanceHistoryUser);

module.exports = router;
