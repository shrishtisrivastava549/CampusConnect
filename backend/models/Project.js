const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
    {
        Title: {
            type: String,
            required: true
        },

        Description: {
            type: String,
            required: true
        },

        Technology: {
            type: String
        },

        Course: {
            type: String
        },

        Semester: {
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

module.exports = mongoose.model("Project", projectSchema);