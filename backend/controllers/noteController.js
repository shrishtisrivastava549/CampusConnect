const Note = require("../models/Note");
const Notification = require("../models/Notification");

// =========================
// CREATE NOTE
// =========================

const createNote = async (req, res) => {
    try {
        const {
            Title,
            Description,
            Subject,
            Course,
            Semester,
            DriveLink
        } = req.body;

        // Uploaded file path
        const File = req.file
            ? `/uploads/notes/${req.file.filename}`
            : undefined;

        // File OR link — at least one is required
        if (!File && !DriveLink?.trim()) {
            return res.status(400).json({
                message: "Please upload a file or provide a link"
            });
        }

        const note = await Note.create({
            Title,
            Description,
            Subject,
            Course,
            Semester,
            DriveLink: DriveLink?.trim() || undefined,
            File,
            Owner: req.user._id,
            Status: "pending"
        });

        res.status(201).json({
            message: "Note submitted for approval",
            note
        });

    } catch (error) {
        console.log("Create Note Error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

// =========================
// GET APPROVED NOTES
// =========================

const getApprovedNotes = async (req, res) => {
    try {
        const notes = await Note.find({
            Status: "approved"
        }).populate("Owner", "Name CollegeEmail");

        res.status(200).json({
            count: notes.length,
            notes
        });

    } catch (error) {
        console.log("Get Approved Notes Error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

// =========================
// GET MY NOTES
// =========================

const getMyNotes = async (req, res) => {
    try {
        const notes = await Note.find({
            Owner: req.user._id
        });

        res.status(200).json({
            count: notes.length,
            notes
        });

    } catch (error) {
        console.log("Get My Notes Error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

// =========================
// GET PENDING NOTES (ADMIN)
// =========================

const getPendingNotes = async (req, res) => {
    try {
        const notes = await Note.find({
            Status: "pending"
        }).populate("Owner", "Name CollegeEmail");

        res.status(200).json({
            count: notes.length,
            notes
        });

    } catch (error) {
        console.log("Get Pending Notes Error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

// =========================
// APPROVE NOTE (ADMIN)
// =========================

const approveNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        note.Status = "approved";

        await note.save();

        await Notification.create({
            Recipient: note.Owner,
            Type: "note_approved",
            Message: `Your note "${note.Title}" has been approved.`
        });

        res.status(200).json({
            message: "Note approved successfully",
            note
        });

    } catch (error) {
        console.log("Approve Note Error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

// =========================
// EXPORT
// =========================

module.exports = {
    createNote,
    getApprovedNotes,
    getMyNotes,
    getPendingNotes,
    approveNote
};