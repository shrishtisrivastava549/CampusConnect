
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

// =========================
// CONNECT MONGODB
// =========================

connectDB();

// =========================
// MIDDLEWARE
// =========================

app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// =========================
// ROUTES
// =========================

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const noteRoutes = require("./routes/noteRoutes");
const projectRoutes = require("./routes/projectRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const queryRoutes = require("./routes/queryRoutes");
const replyRoutes = require("./routes/replyRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const searchRoutes = require("./routes/searchRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/queries", queryRoutes);
app.use("/api/replies", replyRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/dashboard", dashboardRoutes);

// =========================
// HOME ROUTE
// =========================

app.get("/", (req, res) => {
  res.send("Campus Connect Backend Running");
});

// =========================
// GLOBAL ERROR HANDLER
// =========================

app.use((err, req, res, next) => {
  console.error("========== BACKEND ERROR ==========");
  console.error("Method:", req.method);
  console.error("URL:", req.originalUrl);
  console.error("Error Name:", err.name);
  console.error("Error Message:", err.message);
  console.error("Full Error:", err);
  console.error("====================================");

  res.status(500).json({
    message: err.message || "Internal Server Error",
  });
});

// =========================
// SERVER
// =========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

