const express = require("express");

const router = express.Router();

const {
    signup,
    sendOTP,
    verifyOTP,
    login,
    updateProfile
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");


// =========================
// SIGNUP
// =========================

router.post(
    "/signup",
    signup
);


// =========================
// SEND OTP
// =========================

router.post(
    "/send-otp",
    sendOTP
);


// =========================
// VERIFY OTP
// =========================

router.post(
    "/verify-otp",
    verifyOTP
);


// =========================
// LOGIN
// =========================

router.post(
    "/login",
    login
);


// =========================
// UPDATE PROFILE
// =========================

router.put(
    "/profile",
    authMiddleware,
    updateProfile
);


module.exports = router;