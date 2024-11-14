import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "../PageComponents/Sidebar";
import DashboardHeader from "../PageComponents/DashboardHeader";
import ContentSection from "../PageComponents/ContentSection";
import { menuItems } from "./constants";
import { jwtDecode } from "jwt-decode"; // Fixed import
import API from "../../services/api";
import "../style/mainContent.css";
import PerformanceGraph from "../PageComponents/PerformanceGraph"; // Component for graph display

export default function HRPerformance() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [performanceScores, setPerformanceScores] = useState({});
  const [performanceHistory, setPerformanceHistory] = useState([]);
  const user = jwtDecode(localStorage.getItem("token"));

  useEffect(() => {
    // Fetch all employees
    const fetchEmployees = async () => {
      try {
        const response = await API.get("/employees");
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleEmployeeClick = async (employee) => {
    setSelectedEmployee(employee);
    await fetchPerformanceHistory(employee._id); // Fetch performance history for graph
  };

  const fetchPerformanceHistory = async (employeeId) => {
    try {
      const response = await API.get(`/performance/${employeeId}`);
      setPerformanceHistory(response.data.performanceHistory);
    } catch (error) {
      console.error("Error fetching performance history:", error);
      setPerformanceHistory([]);
    }
  };

  // Handle input change for performance score
  const handleScoreChange = (e, employeeId) => {
    setPerformanceScores({
      ...performanceScores,
      [employeeId]: e.target.value,
    });
  };

  // Submit performance score for an employee
  const submitPerformanceScore = async (employeeId) => {
    const score = performanceScores[employeeId];
    if (!score) {
      alert("Please enter a performance score.");
      return;
    }

    try {
      await API.post(`/performance`, {
        user_id: user.id,
        employee_id: employeeId,
        review_date: new Date().toISOString().slice(0, 10), // current date as review date
        score,
      });
      alert("Performance score submitted successfully.");
      setPerformanceScores({ ...performanceScores, [employeeId]: "" });

      // Refetch the updated performance history
      await fetchPerformanceHistory(employeeId);
    } catch (error) {
      console.error("Error submitting performance score:", error);
    }
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
      <div className="main-content flex-1 ml-1/2 md:ml-1/4 p-4 md:p-12 h-screen overflow-hidden">
        <div className="flex items-center justify-between md:hidden">
          <DashboardHeader title="Welcome, HR!" />
          <button
            onClick={toggleSidebar}
            className="p-2 mb-4 bg-blue-950 text-white rounded-lg"
          >
            ☰
          </button>
        </div>
        <ContentSection title="Employee Performance Management">
          <p>Select an employee to view and manage their performance.</p>

          <div className="employee-list">
            <ul className="mt-2 space-y-4">
              {employees.map((employee) => (
                <li key={employee._id} className="flex items-center space-x-4">
                  <span
                    onClick={() => handleEmployeeClick(employee)}
                    className="cursor-pointer text-blue-600 hover:underline"
                  >
                    {employee.name} - {employee.position}
                  </span>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    placeholder="Score"
                    value={performanceScores[employee._id] || ""}
                    onChange={(e) => handleScoreChange(e, employee._id)}
                    className="border rounded p-1 w-20"
                  />
                  <button
                    onClick={() => submitPerformanceScore(employee._id)}
                    className="bg-blue-600 text-white rounded px-4 py-1"
                  >
                    Submit
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {selectedEmployee && (
            <div className="performance-history mt-8">
              <h2 className="text-lg font-semibold">
                Performance History for {selectedEmployee.name}
              </h2>
              <PerformanceGraph data={performanceHistory} />
            </div>
          )}
        </ContentSection>
      </div>
    </div>
  );
}
