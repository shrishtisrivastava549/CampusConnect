const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    getMyNotifications,
    markAsRead
} = require("../controllers/notificationController");

// =========================
// GET MY NOTIFICATIONS
// =========================

router.get(
    "/",
    authMiddleware,
    getMyNotifications
);

// =========================
// MARK NOTIFICATION AS READ
// =========================

router.put(
    "/:id/read",
    authMiddleware,
    markAsRead
);

module.exports = router;