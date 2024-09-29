// routes/employeeRoutes.js

const express = require("express");
const {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router
  .route("/")
  .get(protect, authorize("Admin"), getEmployees)
  .post(protect, authorize("Admin"), createEmployee);

router
  .route("/:id")
  .get(protect, authorize("Admin"), getEmployee)
  .put(protect, authorize("Admin"), updateEmployee)
  .delete(protect, authorize("Admin"), deleteEmployee);

module.exports = router;
