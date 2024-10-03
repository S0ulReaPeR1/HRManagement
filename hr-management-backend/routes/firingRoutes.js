// routes/firingRoutes.js

const express = require("express");
const {
  createFiring,
  getAllFirings,
  getFiringById,
  updateFiring,
  deleteFiring,
} = require("../controllers/firingController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.route("/").post(protect, createFiring).get(protect, getAllFirings);
router
  .route("/:id")
  .get(protect, getFiringById)
  .put(protect, updateFiring)
  .delete(protect, deleteFiring);

module.exports = router;
