const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const hrRoutes = require("./routes/hrRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const hiringRoutes = require("./routes/hiringRoutes");
const payrollRoutes = require("./routes/payrollRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const complaintsRoutes = require("./routes/complaintsRoutes");
const performanceRoutes = require("./routes/performanceRoutes");
const firingRoutes = require("./routes/firingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const { errorHandler } = require("./middleware/errorMiddleware");
const cors = require("cors");
dotenv.config();
connectDB(); // Connect to MongoDB

const app = express();
app.use(express.json()); // To parse JSON bodies

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"], // Replace with your frontend URL
    credentials: true,
  })
);

// Define API routes
app.use("/api/hr", hrRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/hiring", hiringRoutes);
app.use("/api/payroll", payrollRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/complaints", complaintsRoutes);
app.use("/api/performance", performanceRoutes);
app.use("/api/firing", firingRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/auth', authRoutes); 
// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
