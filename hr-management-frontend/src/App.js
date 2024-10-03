// src/App.jsx

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./components/AdminDashboard";
import UserDashboard from "./components/UserDashboard";
import HRDashboard from "./components/HRDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./components/Unauthorized"; // Create this component

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
            <ProtectedRoute allowedRoles={["Admin",["Employee"]]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee-dashboard"
          element={
            <ProtectedRoute allowedRoles={["Employee"]}>
              <UserDashboard />
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

        {/* Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
