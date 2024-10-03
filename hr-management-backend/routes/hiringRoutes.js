// routes/hiringRoutes.js

const express = require("express");
const {
  createHiring,
  getAllHiring,
  getHiring,
  updateHiring,
  deleteHiring,
} = require("../controllers/hiringController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.route("/").post(protect, createHiring).get(protect, getAllHiring);
router
  .route("/:id")
  .get(protect, getHiring)
  .put(protect, updateHiring)
  .delete(protect, deleteHiring);

module.exports = router;
