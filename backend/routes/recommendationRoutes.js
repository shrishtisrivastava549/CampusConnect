const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    createRecommendation,
    getMyRecommendations,
    getPublicRecommendations,
    resolveRecommendation
} = require("../controllers/recommendationController");

// =========================
// PUBLIC
// =========================

router.get(
    "/",
    getPublicRecommendations
);

// =========================
// LOGGED-IN USERS
// =========================

router.post(
    "/",
    authMiddleware,
    createRecommendation
);

router.get(
    "/my",
    authMiddleware,
    getMyRecommendations
);

// =========================
// ADMIN
// =========================

router.put(
    "/:id/resolve",
    authMiddleware,
    resolveRecommendation
);

module.exports = router;