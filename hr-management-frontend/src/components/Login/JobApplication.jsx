import React, { useState, useEffect } from "react";
import axios from "axios";

const JobApplication = () => {
  const [jobPostings, setJobPostings] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    phone: "",
    photo: "",
    jobId: "", // To store selected job id
  });

  useEffect(() => {
    const fetchJobPostings = async () => {
      try {
        const response = await axios.get("/api/job-postings");
        setJobPostings(response.data);
      } catch (error) {
        console.error("Error fetching job postings:", error);
      }
    };
    fetchJobPostings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleJobSelect = (jobId) => {
    setFormData({ ...formData, jobId });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Submit application logic here
    console.log("Form submitted:", formData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Job Application</h1>

        {/* Job Postings List */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Available Job Postings</h2>
          <ul className="space-y-4">
            {jobPostings.map((job) => (
              <li key={job._id} className="border p-4 rounded">
                <h3 className="font-bold">{job.title}</h3>
                <p>{job.department}</p>
                <button
                  onClick={() => handleJobSelect(job._id)}
                  className="bg-blue-600 text-white py-1 px-3 rounded mt-2"
                >
                  Apply
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Application Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="department">
              Department
            </label>
            <input
              type="text"
              name="department"
              id="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="phone">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="photo">
              Photo URL
            </label>
            <input
              type="url"
              name="photo"
              id="photo"
              value={formData.photo}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-300 w-full"
            onSubmit={handleSubmit}
          >
            Apply
          </button>
        </form>
      </div>
    </div>
  );
};

export default JobApplication;
