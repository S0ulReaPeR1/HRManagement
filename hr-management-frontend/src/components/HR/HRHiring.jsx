// src/components/HRHiring.jsx

import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "../PageComponents/Sidebar";
import DashboardHeader from "../PageComponents/DashboardHeader";
import ContentSection from "../PageComponents/ContentSection";
import { menuItems } from "./constants";
import API from "../../services/api";
import { jwtDecode } from "jwt-decode";
import "../style/mainContent.css";

export default function HRHiring() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [jobForm, setJobForm] = useState({
    job_title: "",
    department: "",
    open_positions: "",
    salary: "",
  });

  // Fetch job postings on mount
  useEffect(() => {
    fetchJobs();
  }, []);
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleJobFormChange = (e) => {
    const { name, value } = e.target;
    setJobForm({ ...jobForm, [name]: value });
  };
  
  const fetchJobs = async () => {
    const { data } = await API.get("/hiring/jobs"); // Updated to /jobs
    setJobs(data.filter((job) => job.open_positions > 0));
  };

  const handleJobSubmit = async (e) => {
    e.preventDefault();

      const user= jwtDecode(localStorage.getItem("token")).id // Replace with the actual way to get the HR ID (e.g., from context)

      // Prepare the payload to send to the backend
      const jobData = {
        user_id:user,
        job_title: jobForm.job_title,
        department: jobForm.department,
        open_positions: jobForm.open_positions,
        salary: jobForm.salary,
      };


    await API.post("/hiring/jobs", jobData); // Updated to /jobs
    alert("Job posted successfully!");
    fetchJobs();
    setJobForm({
      job_title: "",
      department: "",
      open_positions: "",
      salary: "",
    });
  };

  const fetchApplications = async (jobId) => {
    console.log(jobId)
    const { data } = await API.get(`/hiring/jobs/${jobId}`); // Updated to /jobs/:id/apply
    setApplications(data);
    setSelectedJob(jobId);
  };

  const handleHire = async (appId) => {
    await API.post(`/hiring/jobs/${selectedJob}/select/${appId}`); // Updated to /jobs/:jobId/select/:applicantId
    alert("Applicant hired!");
    fetchApplications(selectedJob);
    fetchJobs(); // Refresh jobs to update open positions
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar
        menuItems={menuItems}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        Role="HR"
      />

      <div className="main-content flex-1 ml-1/2 md:ml-1/4 p-4 md:p-12 h-screen">
        {/* Top Bar with Header and Hamburger Icon */}
        <div className="flex items-center justify-between md:hidden">
          <DashboardHeader title="Welcome, HR!" />
          <button
            onClick={toggleSidebar}
            className="p-2 mb-4 bg-blue-950 text-white rounded-lg"
          >
            ☰
          </button>
        </div>

        <ContentSection title="Hiring Overview">
          {/* Job Posting Form */}
          <h3 className="text-lg font-semibold mb-2">Post a New Job</h3>
          <form onSubmit={handleJobSubmit} className="mb-6">
            <input
              type="text"
              name="job_title"
              value={jobForm.job_title}
              onChange={handleJobFormChange}
              placeholder="Job Title"
              className="border p-2 mb-2 w-full"
              required
            />
            <input
              type="text"
              name="department"
              value={jobForm.department}
              onChange={handleJobFormChange}
              placeholder="Department"
              className="border p-2 mb-2 w-full"
              required
            />
            <input
              type="number"
              name="open_positions"
              value={jobForm.open_positions}
              onChange={handleJobFormChange}
              placeholder="Open Positions"
              className="border p-2 mb-2 w-full"
              required
            />
            <input
              type="number"
              name="salary"
              value={jobForm.salary}
              onChange={handleJobFormChange}
              placeholder="Salary"
              className="border p-2 mb-2 w-full"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Post Job
            </button>
          </form>
        </ContentSection>
        <ContentSection>
          {/* Job Postings List */}
          <h3 className="text-lg font-semibold mb-2">Job Postings</h3>
          <ul className="mb-6">
            {jobs.map((job) => (
              <li
                key={job._id}
                className="flex justify-between items-center p-2 border-b"
              >
                <div>
                  <span>
                    {job.job_title} - {job.open_positions} Open Positions
                  </span>
                  <span>
                    {" "}
                    | Salary: Rs {job.salary.toLocaleString("en-IN")}
                  </span>
                </div>
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => fetchApplications(job._id)}
                >
                  View Applicants
                </button>
              </li>
            ))}
          </ul>

          {/* Applications Section */}
          {selectedJob && (
            <div className="applications-section">
              <h4 className="text-lg font-semibold mb-2">
                Applications for Job:{" "}
                {jobs.find((job) => job._id === selectedJob)?.job_title}
              </h4>

              {/* Check if there are applications */}
              {applications.length === 0 ? (
                <p className="text-gray-500">
                  No applications found for this job.
                </p>
              ) : (
                <ul>
                  {applications.map((app) => (
                    <li
                      key={app._id}
                      className="flex justify-between items-center p-2 border-b"
                    >
                      <span>
                        {app.name} - {app.phone} - {app.address}
                      </span>
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded-md"
                        onClick={() => handleHire(app._id)}
                      >
                        Hire
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Close ContentSection and main content */}
        </ContentSection>
      </div>
    </div>
  );
}
