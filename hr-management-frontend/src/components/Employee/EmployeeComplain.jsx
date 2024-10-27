// src/pages/EmployeeComplain.jsx

import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "../PageComponents/Sidebar";
import DashboardHeader from "../PageComponents/DashboardHeader";
import ContentSection from "../PageComponents/ContentSection";
import { menuItems } from "./constants";

export default function EmployeeComplain() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="employee-complain min-h-screen flex bg-gray-100">
      <Sidebar
        menuItems={menuItems}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
      />

      <div className="main-content flex-1 p-4 md:p-12 relative">
        {/* Top Bar with Header and Hamburger Icon */}
        <div className="flex items-center justify-between mb-4 md:hidden">
          <DashboardHeader title="File a Complaint" />
          <button
            onClick={toggleSidebar}
            className="p-2 mb-4 bg-blue-950 text-white rounded-lg"
          >
            ☰
          </button>
        </div>

        <ContentSection title="Complaint Submission">
          <p>
            Please provide details of your complaint below. We value your
            feedback.
          </p>
          {/* Additional content related to complaints can go here */}
        </ContentSection>
      </div>
    </div>
  );
}
