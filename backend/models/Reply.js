const mongoose = require("mongoose");

const replySchema = new mongoose.Schema(
    {
        Query: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Query",
            required: true
        },

        Owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        Content: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Reply", replySchema);