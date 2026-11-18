const mongoose = require("mongoose");

const recommendationSchema = new mongoose.Schema(
    {
        Title: { type: String, required: true, trim: true },
        Description: { type: String, required: true, trim: true },
        Category: {
            type: String,
            enum: ["resource", "notes", "project", "academic", "skills", "course", "general"],
            default: "general"
        },
        Reason: { type: String, trim: true, default: "" },
        Link: { type: String, trim: true, default: "" },
        Owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        HelpfulBy: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],
        Status: {
            type: String,
            enum: ["pending", "reviewed", "resolved"],
            default: "pending"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.models.Recommendation || mongoose.model("Recommendation", recommendationSchema);
