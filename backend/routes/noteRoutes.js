const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminAuth = require("../middleware/adminAuth");
const uploadNote = require("../middleware/uploadNote");

const {
    createNote,
    getApprovedNotes,
    getMyNotes,
    getPendingNotes,
    approveNote
} = require("../controllers/noteController");

// Get approved notes
router.get("/", getApprovedNotes);

// Create note
router.post(
    "/",
    authMiddleware,
    uploadNote.single("file"),
    createNote
);

// My notes
router.get(
    "/my",
    authMiddleware,
    getMyNotes
);

// Admin pending notes
router.get(
    "/pending",
    authMiddleware,
    adminAuth,
    getPendingNotes
);

// Admin approve note
router.put(
    "/:id/approve",
    authMiddleware,
    adminAuth,
    approveNote
);

module.exports = router;