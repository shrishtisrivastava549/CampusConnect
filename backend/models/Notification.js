const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        Recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        Type: {
            type: String,
            enum: [
                "resource_approved",
                "note_approved",
                "project_approved",
                "query_reply",
                "recommendation_resolved"
            ],
            required: true
        },

        Message: {
            type: String,
            required: true,
            trim: true
        },

        IsRead: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Notification", notificationSchema);