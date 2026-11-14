
const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminAuth = require("../middleware/adminAuth");

const {
    createProject,
    getApprovedProjects,
    getMyProjects,
    getPendingProjects,
    approveProject,
    updateProject,
    deleteProject
} = require("../controllers/projectController");

// =========================
// PUBLIC
// =========================

router.get(
    "/",
    getApprovedProjects
);

// =========================
// LOGGED-IN USERS
// =========================

router.post(
    "/",
    authMiddleware,
    createProject
);

router.get(
    "/my",
    authMiddleware,
    getMyProjects
);

router.put(
    "/:id",
    authMiddleware,
    updateProject
);

router.delete(
    "/:id",
    authMiddleware,
    deleteProject
);

// =========================
// ADMIN
// =========================

router.get(
    "/pending",
    authMiddleware,
    adminAuth,
    getPendingProjects
);

router.put(
    "/:id/approve",
    authMiddleware,
    adminAuth,
    approveProject
);

module.exports = router;