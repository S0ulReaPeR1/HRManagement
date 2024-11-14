// src/pages/EmployeeStatus.jsx

import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "../PageComponents/Sidebar";
import DashboardHeader from "../PageComponents/DashboardHeader";
import ContentSection from "../PageComponents/ContentSection";
import { menuItems } from "./constants";
import PerformanceGraph from "../PageComponents/PerformanceGraph"; // Import the graph component
import { jwtDecode } from "jwt-decode";
import API from "../../services/api"; // Import API service for data fetching
import { decode } from "punycode";


export default function EmployeePerformance() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [performanceData, setPerformanceData] = useState([]); // State for performance data
  const user = jwtDecode(localStorage.getItem("token"));
 

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Fetch performance data on component mount
  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const response = await API.get(`/performance/history/${user.id}`); // Adjust endpoint as needed
        setPerformanceData(response.data.performanceHistory);
      } catch (error) {
        console.error("Error fetching performance data:", error);
      }
    };

    fetchPerformanceData();
  }, []);
  

  return (
    <div className="employee-status min-h-screen flex bg-gray-100">
      <Sidebar
        menuItems={menuItems}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        Role="Employee"
      />

      <div className="main-content flex-1 p-4 md:p-12 relative">
        <div className="flex items-center justify-between mb-4 md:hidden">
          <DashboardHeader title="Your Current Status" />
          <button
            onClick={toggleSidebar}
            className="p-2 mb-4 bg-blue-950 text-white rounded-lg"
          >
            ☰
          </button>
        </div>

     

        <ContentSection title="Performance History">
          {performanceData.length > 0 ? (
            <PerformanceGraph data={performanceData} />
          ) : (
            <p>No performance data available.</p>
          )}
        </ContentSection>
      </div>
    </div>
  );
}
