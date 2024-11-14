// controllers/HiringController.js
const Hiring = require("../models/Hiring");
const User = require("../models/User");
const Employee = require("../models/Employee");
const HR= require("../models/HR")
const bcrypt = require("bcryptjs");

// POST /api/jobs - HR posts a new job
exports.createJob = async (req, res) => {
  try {
    const { user_id, job_title, department, open_positions, salary } = req.body;
    console.log(user_id)
      const hr = await HR.findOne({ user: user_id });
      const hr_id = hr.id;

    const newJob = new Hiring({
      hr_id,
      job_title,
      department,
      open_positions,
      salary,
    });



    const job = await newJob.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/jobs - View all job postings
console.log("getAllJobs endpoint called");

exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Hiring.find().select(
      "job_title department open_positions salary"
    );
    res.status(200).json(jobs); // This will return [] if no jobs exist
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get /api/jobs/:id - Apply for a job
exports.getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;
   
    const job = await Hiring.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    console.log(job)
    res.status(200).json(job.applicants);
   
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/jobs/:jobId/select/:applicantId - Select applicant and create employee
exports.selectApplicant = async (req, res) => {
  try {
    const { jobId, applicantId } = req.params;

    // Fetch the job and the selected applicant
    const job = await Hiring.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const applicant = job.applicants.id(applicantId);
    if (!applicant) {
      return res.status(404).json({ message: "Applicant not found" });
    }

    // Create user credentials
    const email = `${applicant.name
      .toLowerCase()
      .replace(" ", ".")}@company.com`;
    const password = "defaultpassword"; // Replace with a secure generated password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword,
      role: "Employee",
    });
    const user = await newUser.save();

    // Create an employee record
    const newEmployee = new Employee({
      user: user._id,
      hr_id: job.hr_id,
      name: applicant.name,
      department: applicant.department,
      phone: applicant.phone,
      photo: applicant.photo,
    });
    await newEmployee.save();

    // Reduce open positions
    job.open_positions -= 1;
    job.applicants.pull(applicantId);
    await job.save();

    res.status(201).json({
      message: "Applicant selected and employee profile created",
      user: {
        email: user.email,
        password: "defaultpassword", // Communicate this securely
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.applyForJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const { name, address, phone, photo } = req.body;

    const job = await Hiring.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Ensure applicants array exists
    if (!job.applicants) {
      job.applicants = [];
    }

    // Add the applicant to the array
    job.applicants.push({ name, address, phone, photo });
    await job.save();

    res.status(201).json({ message: "Application submitted successfully" });
  } catch (error) {
    console.error("Error in applyForJob:", error);
    res.status(500).json({ error: error.message });
  }
};