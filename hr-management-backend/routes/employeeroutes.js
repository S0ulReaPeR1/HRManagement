// routes/employeeRoutes.js

const express = require("express");
const {
  createEmployee,
  getAllEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");
const { protect, authorizeMultiple } = require("../middleware/auth");

const router = express.Router();

router.route("/").post(protect, createEmployee).get(protect, authorizeMultiple(["HR"]),getAllEmployees);
router
  .route("/:id")
  .get(protect, authorizeMultiple(["Employee","Admin","HR"]),getEmployee)
  .put(protect, updateEmployee)
  .delete(protect, deleteEmployee);

module.exports = router;
