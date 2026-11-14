const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
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
            required: true,
            enum: [
                "Books",
                "Notes",
                "Lab Equipment",
                "Drafting Tools",
                "Electronics",
                "Other"
            ]
        },

        Type: {
            type: String,
            required: true,
            enum: [
                "Sell",
                "Rent",
                "Donate"
            ]
        },

        Price: {
            type: Number,
            default: 0
        },

        Condition: {
            type: String,
            enum: [
                "New",
                "Like New",
                "Good",
                "Used"
            ]
        },

        Owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        ContactEmail: {
            type: String
        },

        ContactPhone: {
            type: String
        },

        Image: {
            type: String
        },

        // Uploaded resource file
        File: {
            type: String
        },

        Status: {
            type: String,
            enum: [
                "pending",
                "approved",
                "rejected",
                "sold"
            ],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Resource", resourceSchema);