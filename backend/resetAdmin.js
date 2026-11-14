const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const User = require("./models/User");
async function resetAdmin() {
  try {
    const email = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;
    if (!process.env.MONGO_URI || !email || !password || password.length < 12) throw new Error("Set MONGO_URI, ADMIN_EMAIL and ADMIN_PASSWORD (minimum 12 characters).");
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOneAndUpdate({ Role: "admin", $or: [{ CollegeEmail: email }, { PersonalEmail: email }] }, { $set: { Password: await bcrypt.hash(password, 12), OTPVerified: true, AccountStatus: "approved", AdminLevel: "admin" } });
    if (!user) throw new Error("No matching Admin account found for ADMIN_EMAIL.");
    console.log("Admin password updated successfully.");
  } catch (error) { console.error("Admin password reset failed:", error.message); process.exitCode = 1; }
  finally { await mongoose.disconnect().catch(() => {}); }
}
resetAdmin();
