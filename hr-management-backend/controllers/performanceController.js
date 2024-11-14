const Performance = require("../models/Performance");
const asyncHandler = require("express-async-handler");
const Employee = require("../models/Employee")
const HR=require("../models/HR")


// @desc Create a new Performance record for an employee
// @route POST /api/performance
// @access HR/Admin
exports.createPerformance = asyncHandler(async (req, res) => {
  const { user_id, employee_id, score, review_date } = req.body;
  const hr = await HR.findOne({ user: user_id });
  const hr_id=hr.id

  // Validate request body
  if (!hr_id || !employee_id || !review_date || score === undefined) {
    res.status(400);
    throw new Error(
      "Please provide HR ID, employee ID, review date, and score"
    );
  }

  try {
    // Check if a performance document exists for the employee
    const performance = await Performance.findOne({ employee_id });

    if (performance) {
      // If a record exists, push a new review into the performance_review array
      performance.performance_review.push({
        score,
        review_date,
      });
      await performance.save();
    } else {
      // If no record exists, create a new performance document
      const newPerformance = new Performance({
        hr_id,
        employee_id,
        performance_review: [{ score, review_date }],
      });
      await newPerformance.save();
    }

    res.status(201).json({
      success: true,
      message: "Performance record added successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// @desc Get performance history for a specific employee
// @route GET /api/performance/:employee_id
// @access HR/Admin/Employee
exports.getPerformanceHistory = asyncHandler(async (req, res) => {
  try {
    // Retrieve the performance document for the specified employee
    const performanceRecord = await Performance.findOne({
      employee_id: req.params.id,
    });

    if (
      !performanceRecord ||
      performanceRecord.performance_review.length === 0
    ) {
      res.status(404);
      throw new Error("No performance history found for this employee");
    }

    // Format data for graphing from the performance_review array
    const graphData = performanceRecord.performance_review.map((review) => ({
      review_date: review.review_date,
      score: review.score,
    }));

    res.status(200).json({
      success: true,
      performanceHistory: graphData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


exports.getPerformanceHistoryUser = asyncHandler(async (req, res) => {
  try {
    // Attempt to retrieve the employee document with the user ID from params
    const employee = await Employee.findOne({ user: req.params.id });

    if (!employee) {
      res.status(404);
      throw new Error("Employee not found");
    }

    const performanceRecord = await Performance.findOne({
      employee_id: employee.id,
    });

    if (
      !performanceRecord ||
      performanceRecord.performance_review.length === 0
    ) {
      res.status(404);
      throw new Error("No performance history found for this employee");
    }

    const graphData = performanceRecord.performance_review.map((review) => ({
      review_date: review.review_date,
      score: review.score,
    }));

    res.status(200).json({
      success: true,
      performanceHistory: graphData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
