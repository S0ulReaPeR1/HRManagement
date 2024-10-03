// routes/hrRoutes.js

const express = require("express");
const {
  createHR,
  getAllHRs,
  getHR, // Updated to match the controller function name
  updateHR,
  deleteHR,
} = require("../controllers/hrController");
const { protect, authorize,authorizeMultiple } = require("../middleware/auth");

const router = express.Router();

router.route("/").post(protect,authorize("Admin"),createHR).get(protect, authorizeMultiple(["Employee","Admin"]), getAllHRs);
router
  .route("/:id")
  .get(protect,authorize("Admin"), getHR) // Updated to match the controller function name
  .put(protect, updateHR)
  .delete(protect, deleteHR);

module.exports = router;
