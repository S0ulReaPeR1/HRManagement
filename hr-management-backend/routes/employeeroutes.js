// routes/employeeRoutes.js

const express = require("express");
const {
  createEmployee,
  getAllEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.route("/").post(protect, createEmployee).get(protect, getAllEmployees);
router
  .route("/:id")
  .get(protect, getEmployee)
  .put(protect, updateEmployee)
  .delete(protect, deleteEmployee);

module.exports = router;
