import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "../PageComponents/Sidebar";
import DashboardHeader from "../PageComponents/DashboardHeader";
import ContentSection from "../PageComponents/ContentSection";
import { menuItems } from "./constants";
import { jwtDecode } from "jwt-decode";
import "../style/mainContent.css";
import API from "../../services/api";

export default function HRFiring() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [reason, setReason] = useState("");
  const [settlement, setSettlement] = useState("");
  const [view, setView] = useState("firing"); // "firing" or "records"
  const [firingRecords, setFiringRecords] = useState([]);
  const user= jwtDecode(localStorage.getItem("token"))

  useEffect(() => {
    fetchEmployees();
    fetchFiringRecords();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await API.get("/employees");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchFiringRecords = async () => {
    try {
      const response = await API.get("/firing");
      setFiringRecords(response.data);
    } catch (error) {
      console.error("Error fetching firing records:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSelectEmployee = (employee) => {
    setSelectedEmployee(employee);
    setReason("");
    setSettlement("");
  };

  const handleFireEmployee = async () => {
    if (!selectedEmployee) return;
    try {
      console.log(selectedEmployee)
      const firingData = {
        user_id: user.id,
        employee_id: selectedEmployee._id,
        reason_for_termination: reason,
        termination_date: new Date(),
        final_salary_settlement: parseFloat(settlement),
      };
      await API.post("/firing", firingData);
      alert("Employee fired successfully.");
      setIsSidebarOpen(false);
      fetchEmployees();
      fetchFiringRecords();
      setSelectedEmployee(null);
    } catch (error) {
      console.error("Error firing employee:", error);
      alert("Failed to fire employee.");
    }
  };

  // Change view and reset selected employee when switching to "records"
  const handleChangeView = (newView) => {
    setView(newView);
    if (newView === "records") {
      setSelectedEmployee(null);
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

      <div className="main-content flex-1 ml-1/2 md:ml-1/4 p-4 md:p-12 h-screen">
        <div className="flex items-center justify-between md:hidden">
          <DashboardHeader title="Welcome, HR!" />
          <button
            onClick={toggleSidebar}
            className="p-2 mb-4 bg-blue-950 text-white rounded-lg"
          >
            ☰
          </button>
        </div>

        <ContentSection title="Firing Overview">
          <div className="flex justify-between mb-4">
            <button
              onClick={() => handleChangeView("firing")}
              className={`px-4 py-2 rounded-lg ${
                view === "firing" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              Fire Employees
            </button>
            <button
              onClick={() => handleChangeView("records")}
              className={`px-4 py-2 rounded-lg ${
                view === "records" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              Firing Records
            </button>
          </div>

          {view === "firing" ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Available Employees
              </h2>
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Name</th>
                    <th className="py-2 px-4 border-b">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee._id}>
                      <td className="py-2 px-4 border-2 text-center">
                        {employee.name}
                      </td>
                      <td className="py-2 px-4 border-2 text-center">
                        {employee.user.email}
                      </td>
                      <td className="py-2 px-4 border-2 text-center">
                        <button
                          onClick={() => handleSelectEmployee(employee)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg"
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold mb-4">Firing Records</h2>
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-l text-center">
                      Employee Name
                    </th>
                    <th className="py-2 px-4 border-l text-center">Reason</th>
                    <th className="py-2 px-4 border-l text-center">
                      Termination Date
                    </th>
                    <th className="py-2 px-4 border-l text-center">
                      Settlement
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {firingRecords.map((record) => (
                    <tr key={record._id}>
                      <td className="py-2 px-4 border-2 text-center">
                        {record.name}
                      </td>
                      <td className="py-2 px-4 border-2 text-center">
                        {record.reason_for_termination}
                      </td>
                      <td className="py-2 px-4 border-2 text-center">
                        {new Date(record.termination_date).toLocaleDateString(
                          "en-IN"
                        )}
                      </td>
                      <td className="py-2 px-4 border-2 text-center">
                        {record.final_salary_settlement}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </ContentSection>

        {view === "firing" && selectedEmployee && (
          <div className="mt-6 p-4 border border-gray-300 rounded-lg bg-white">
            <h3 className="text-lg font-semibold mb-2">
              Firing Details for {selectedEmployee.name}
            </h3>
            <label className="block mb-2">
              Reason for Termination:
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="mt-1 block w-full border border-gray-300 p-2 rounded-md"
              />
            </label>
            <label className="block mb-2">
              Final Salary Settlement:
              <input
                type="number"
                value={settlement}
                onChange={(e) => setSettlement(e.target.value)}
                className="mt-1 block w-full border border-gray-300 p-2 rounded-md"
              />
            </label>
            <button
              onClick={handleFireEmployee}
              className="bg-red-500 text-white px-4 py-2 mt-4 rounded-lg"
            >
              Confirm Firing
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
