// src/App.jsx

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login/Login";
import AdminDashboard from "./components/Admin/AdminDashboard";
import EmployeeDashboard from "./components/Employee/EmployeeDashboard";
import HRDashboard from "./components/HR/HRDashboard";
import ProtectedRoute from "./context/ProtectedRoute";
import Unauthorized from "./components/Others/Unauthorized"; // Create this component
import EmployeeAttendance from "./components/Employee/EmployeeAttendance";
import EmployeeStatus from "./components/Employee/EmployeeStatus";
import EmployeeComplain from "./components/Employee/EmployeeComplain";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["Admin", ["Employee"]]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr-dashboard"
          element={
            <ProtectedRoute allowedRoles={["HR"]}>
              <HRDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee-dashboard"
          element={
            <ProtectedRoute allowedRoles={["Employee"]}>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee-attendance"
          element={
            <ProtectedRoute allowedRoles={["Employee"]}>
              <EmployeeAttendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee-status"
          element={
            <ProtectedRoute allowedRoles={["Employee"]}>
              <EmployeeStatus />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee-complain"
          element={
            <ProtectedRoute allowedRoles={["Employee"]}>
              <EmployeeComplain />
            </ProtectedRoute>
          }
        />

        {/* Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
