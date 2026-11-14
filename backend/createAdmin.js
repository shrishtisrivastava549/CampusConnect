const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const User = require("./models/User");

async function createAdmin() {
  try {
    const email = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;
    if (!process.env.MONGO_URI || !email || !password) throw new Error("Set MONGO_URI, ADMIN_EMAIL and ADMIN_PASSWORD before running this script.");
    if (password.length < 12) throw new Error("ADMIN_PASSWORD must contain at least 12 characters.");
    await mongoose.connect(process.env.MONGO_URI);
    const existing = await User.findOne({ $or: [{ CollegeEmail: email }, { PersonalEmail: email }] });
    if (existing) throw new Error("An account already uses ADMIN_EMAIL. Use the secure admin account update procedure instead.");
    await User.create({ Name: "CampusConnect Admin", Password: await bcrypt.hash(password, 12), PersonalEmail: email, OTPVerified: true, AccountStatus: "approved", Role: "admin", AdminLevel: "admin", VerificationMethod: "college_email" });
    console.log("Admin account created successfully.");
  } catch (error) { console.error("Admin creation failed:", error.message); process.exitCode = 1; }
  finally { await mongoose.disconnect().catch(() => {}); }
}
createAdmin();
