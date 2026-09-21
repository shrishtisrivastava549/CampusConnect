const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminAuth = require("../middleware/adminAuth");

const {
    getStudentDashboard,
    getAdminDashboard
} = require("../controllers/dashboardController");

// =========================
// STUDENT DASHBOARD
// =========================

router.get(
    "/student",
    authMiddleware,
    getStudentDashboard
);

// =========================
// ADMIN DASHBOARD
// =========================

router.get(
    "/admin",
    authMiddleware,
    adminAuth,
    getAdminDashboard
);

module.exports = router;