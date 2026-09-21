const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminAuth = require("../middleware/adminAuth");
const uploadResource = require("../middleware/uploadResource");

const {
    createResource,
    getApprovedResources,
    getMyResources,
    getPendingResources,
    approveResource,
    updateResource,
    deleteResource
} = require("../controllers/resourceController");

// =========================
// PUBLIC
// =========================

router.get("/", getApprovedResources);

// =========================
// LOGGED-IN USERS
// =========================

// Resource + optional file upload
router.post(
    "/",
    authMiddleware,
    uploadResource.single("file"),
    createResource
);

router.get(
    "/my",
    authMiddleware,
    getMyResources
);

router.put(
    "/:id",
    authMiddleware,
    uploadResource.single("file"),
    updateResource
);

router.delete(
    "/:id",
    authMiddleware,
    deleteResource
);

// =========================
// ADMIN
// =========================

router.get(
    "/pending",
    authMiddleware,
    adminAuth,
    getPendingResources
);

router.put(
    "/:id/approve",
    authMiddleware,
    adminAuth,
    approveResource
);

module.exports = router;
