const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminAuth = require("../middleware/adminAuth");

const {
    addReply,
    getReplies,
    deleteOwnReply,
    adminDeleteReply
} = require("../controllers/replyController");

// =========================
// ADD REPLY TO QUERY
// =========================

router.post(
    "/:queryId",
    authMiddleware,
    addReply
);

// =========================
// GET REPLIES OF QUERY
// =========================

router.get(
    "/:queryId",
    authMiddleware,
    getReplies
);

// =========================
// DELETE OWN REPLY
// =========================

router.delete(
    "/:id",
    authMiddleware,
    deleteOwnReply
);

// =========================
// ADMIN DELETE REPLY
// =========================

router.delete(
    "/admin/:id",
    authMiddleware,
    adminAuth,
    adminDeleteReply
);

module.exports = router;