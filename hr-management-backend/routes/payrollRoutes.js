// routes/payrollRoutes.js

const express = require("express");
const {
  createPayroll,
  getAllPayrolls,
  getPayrollById,
  updatePayroll,
  deletePayroll,
} = require("../controllers/payrollController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.route("/").post(protect, createPayroll).get(protect, getAllPayrolls);
router
  .route("/:id")
  .get(protect, getPayrollById)
  .put(protect, updatePayroll)
  .delete(protect, deletePayroll);

module.exports = router;
