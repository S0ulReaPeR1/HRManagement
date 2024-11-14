import React, { useState, useEffect } from "react";
import API from "../../services/api"; // Make sure you have this set up for your API calls

const JobPostingsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [application, setApplication] = useState({
    name: "",
    address: "",
    phone: "",
    photo: "",
  });

  // Fetch job postings
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await API.get("/hiring/jobs");
        setJobs(data.filter((job) => job.open_positions > 0)); // Display jobs with available positions
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Handle application form change
  const handleApplicationChange = (e) => {
    const { name, value } = e.target;
    setApplication({ ...application, [name]: value });
  };

  // Handle job application submission
  const handleJobApply = async (jobId) => {
    const applicationData = {
      ...application,
      photo: "photo", // Ensuring `photo` is a string
    };
    try {
      const response = await API.post(
        `/hiring/jobs/${jobId}/apply`,
        applicationData
      );
      console.log(response)
      alert("Application submitted successfully!");
      setSelectedJob(null);
      setApplication({ name: "", address: "", phone: "", photo: "" }); // Reset form
    } catch (error) {
      alert("Failed to apply. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Job Postings
        </h2>

        {/* Show loading message or job listings */}
        {loading ? (
          <p className="text-center">Loading job postings...</p>
        ) : (
          <div>
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <div
                  key={job._id}
                  className="border p-4 rounded-md shadow-sm mb-4"
                >
                  <h3 className="text-xl font-semibold">{job.job_title}</h3>
                  <p className="text-gray-600">Department: {job.department}</p>
                  <p className="text-gray-600">Salary: Rs {job.salary}</p>
                  <p className="text-gray-600">
                    Open Positions: {job.open_positions}
                  </p>
                  <button
                    onClick={() => setSelectedJob(job._id)}
                    className="bg-blue-600 text-white py-2 px-4 rounded-md mt-4 w-full sm:w-auto"
                  >
                    Apply for this job
                  </button>
                </div>
              ))
            ) : (
              <p>No job postings available at the moment.</p>
            )}
          </div>
        )}

        {/* Job application form */}
        {selectedJob && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Apply for Job</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleJobApply(selectedJob);
              }}
              className="space-y-4"
            >
              <input
                type="text"
                name="name"
                value={application.name}
                onChange={handleApplicationChange}
                placeholder="Your Name"
                className="border p-2 w-full"
                required
              />
              <input
                type="text"
                name="address"
                value={application.address}
                onChange={handleApplicationChange}
                placeholder="Department"
                className="border p-2 w-full"
                required
              />
              <input
                type="text"
                name="phone"
                value={application.phone}
                onChange={handleApplicationChange}
                placeholder="Phone"
                className="border p-2 w-full"
                required
              />
              <input
                type="file"
                name="photo"
                onChange={(e) =>
                  setApplication({ ...application, photo: e.target.files[0] })
                }
                className="border p-2 w-full"
                placeholder="photo"
                required
              />
              <button
                type="submit"
                className="bg-green-600 text-white py-2 px-4 rounded-md w-full sm:w-auto"
              >
                Submit Application
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobPostingsPage;
