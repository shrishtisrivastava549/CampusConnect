const mongoose = require("mongoose");

const querySchema = new mongoose.Schema(
    {
        Title: {
            type: String,
            required: true
        },

        Description: {
            type: String,
            required: true
        },

        Category: {
            type: String,
            enum: [
                "resource",
                "notes",
                "project",
                "academic",
                "general"
            ],
            default: "general"
        },

        Owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        Status: {
            type: String,
            enum: [
                "open",
                "resolved",
                "rejected"
            ],
            default: "open"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Query", querySchema);