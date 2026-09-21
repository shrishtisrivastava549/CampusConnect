const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    Email: {
        type: String,
        required: true
    },

    OTP: {
        type: String,
        required: true
    },

    CreatedAt: {
        type: Date,
        default: Date.now,
        expires: 300
    }
});

module.exports = mongoose.model("Otp", otpSchema);