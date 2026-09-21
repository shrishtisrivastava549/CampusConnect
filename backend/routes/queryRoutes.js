const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminAuth = require("../middleware/adminAuth");

const {
    createQuery,
    getOpenQueries,
    getMyQueries,
    resolveQuery,
    rejectQuery,
    deleteQuery
} = require("../controllers/queryController");

// =========================
// GET ALL OPEN QUERIES
// =========================

router.get(
    "/",
    authMiddleware,
    getOpenQueries
);

// =========================
// CREATE QUERY
// =========================

router.post(
    "/",
    authMiddleware,
    createQuery
);

// =========================
// GET MY QUERIES
// =========================

router.get(
    "/my",
    authMiddleware,
    getMyQueries
);

// =========================
// RESOLVE QUERY
// =========================

router.put(
    "/:id/resolve",
    authMiddleware,
    resolveQuery
);

// =========================
// ADMIN REJECT QUERY
// =========================

router.put(
    "/:id/reject",
    authMiddleware,
    adminAuth,
    rejectQuery
);

// =========================
// ADMIN DELETE QUERY
// =========================

router.delete(
    "/:id",
    authMiddleware,
    adminAuth,
    deleteQuery
);

module.exports = router;