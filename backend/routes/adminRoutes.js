const express = require("express");

const router = express.Router();

const adminAuth = require("../middleware/adminAuth");

const {
    getPendingUsers,
    approveUser,
    rejectUser,

    getPendingResources,
    approveResource,
    rejectResource,

    getPendingNotes,
    approveNote,
    rejectNote,

    getPendingProjects,
    approveProject,
    rejectProject,

    getPendingRecommendations,
    reviewRecommendation,
    resolveRecommendation
} = require("../controllers/adminController");

// =========================
// USER MANAGEMENT
// =========================

router.get(
    "/pending-users",
    adminAuth,
    getPendingUsers
);

router.put(
    "/approve/:id",
    adminAuth,
    approveUser
);

router.put(
    "/reject/:id",
    adminAuth,
    rejectUser
);

// =========================
// RESOURCE MANAGEMENT
// =========================

router.get(
    "/pending-resources",
    adminAuth,
    getPendingResources
);

router.put(
    "/approve-resource/:id",
    adminAuth,
    approveResource
);

router.put(
    "/reject-resource/:id",
    adminAuth,
    rejectResource
);

// =========================
// NOTE MANAGEMENT
// =========================

router.get(
    "/pending-notes",
    adminAuth,
    getPendingNotes
);

router.put(
    "/approve-note/:id",
    adminAuth,
    approveNote
);

router.put(
    "/reject-note/:id",
    adminAuth,
    rejectNote
);

// =========================
// PROJECT MANAGEMENT
// =========================

router.get(
    "/pending-projects",
    adminAuth,
    getPendingProjects
);

router.put(
    "/approve-project/:id",
    adminAuth,
    approveProject
);

router.put(
    "/reject-project/:id",
    adminAuth,
    rejectProject
);

// =========================
// RECOMMENDATION MANAGEMENT
// =========================

router.get(
    "/pending-recommendations",
    adminAuth,
    getPendingRecommendations
);

router.put(
    "/review-recommendation/:id",
    adminAuth,
    reviewRecommendation
);

router.put(
    "/resolve-recommendation/:id",
    adminAuth,
    resolveRecommendation
);

module.exports = router;