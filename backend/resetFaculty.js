const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const User = require("./models/User");
async function resetFaculty() {
  try {
    const email = String(process.env.FACULTY_EMAIL || "").trim().toLowerCase();
    const password = process.env.FACULTY_PASSWORD;
    if (!process.env.MONGO_URI || !email || !password || password.length < 12) throw new Error("Set MONGO_URI, FACULTY_EMAIL and FACULTY_PASSWORD (minimum 12 characters).");
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOneAndUpdate({ Role: "faculty", $or: [{ CollegeEmail: email }, { PersonalEmail: email }] }, { $set: { Password: await bcrypt.hash(password, 12) } });
    if (!user) throw new Error("Faculty account not found.");
    console.log("Faculty password updated successfully.");
  } catch (error) { console.error("Faculty password reset failed:", error.message); process.exitCode = 1; }
  finally { await mongoose.disconnect().catch(() => {}); }
}
resetFaculty();
