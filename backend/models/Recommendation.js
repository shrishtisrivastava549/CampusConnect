const mongoose = require("mongoose");

const recommendationSchema = new mongoose.Schema(
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
                "pending",
                "reviewed",
                "resolved"
            ],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

module.exports =
    mongoose.models.Recommendation ||
    mongoose.model(
        "Recommendation",
        recommendationSchema
    );