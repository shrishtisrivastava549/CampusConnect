const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
    {
        Title: {
            type: String,
            required: true
        },

        Description: {
            type: String
        },

        Subject: {
            type: String,
            required: true
        },

        Course: {
            type: String
        },

        Semester: {
            type: String
        },

        // Existing Google Drive link
        DriveLink: {
            type: String
        },

        // Uploaded note file
        File: {
            type: String
        },

        Owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        Status: {
            type: String,
            enum: [
                "pending",
                "approved",
                "rejected"
            ],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Note", noteSchema);