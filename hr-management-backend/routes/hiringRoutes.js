// routes/hiringRoutes.js
const express = require("express");
const router = express.Router();
const {
  createJob,
  getAllJobs,
  getApplicants,
  selectApplicant,
  applyForJob
} = require("../controllers/hiringController");

// Route to post a new job
router.post("/jobs", createJob);

// Route to get all jobs
router.get("/jobs", getAllJobs);

router.post("/jobs/:id/apply",applyForJob )

// Route to apply for a job
router.get("/jobs/:id", getApplicants);

// Route to select an applicant and create an employee
router.post("/jobs/:jobId/select/:applicantId", selectApplicant);

module.exports = router;
