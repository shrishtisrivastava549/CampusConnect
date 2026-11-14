const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminAuth = require("../middleware/adminAuth");
const {
    createRecommendation,
    getMyRecommendations,
    getPublicRecommendations,
    resolveRecommendation,
    deleteRecommendation,
    toggleHelpful
} = require("../controllers/recommendationController");

router.get("/", getPublicRecommendations);
router.post("/", authMiddleware, createRecommendation);
router.get("/my", authMiddleware, getMyRecommendations);
router.put("/:id/helpful", authMiddleware, toggleHelpful);
router.delete("/:id", authMiddleware, deleteRecommendation);
// Only administrators can resolve recommendations.
router.put("/:id/resolve", authMiddleware, adminAuth, resolveRecommendation);

module.exports = router;
