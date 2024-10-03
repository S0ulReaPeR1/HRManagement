const express = require("express");
const {
  getAllUsers,
  getAllHRs,
  getAllEmployees,
  createUser,
  updateUserRole,
  deleteUser,
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// Route to get all users
router.route("/users").get(protect, authorize("Admin"), getAllUsers);

// Route to get all HRs
router.route("/hrs").get(protect, authorize("Admin"), getAllHRs);

// Route to get all employees
router.route("/employees").get(protect, authorize("Admin"), getAllEmployees);

// Route to create a new user
router.route("/users").post(protect, authorize("Admin"), createUser);

// Route to update user role
router.route("/users/:id").put(protect, authorize("Admin"), updateUserRole);

// Route to delete a user
router.route("/users/:id").delete(protect, authorize("Admin"), deleteUser);

module.exports = router;
``