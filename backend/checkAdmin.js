require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
async function checkAdmin() {
  try {
    const email = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    if (!process.env.MONGO_URI || !email) throw new Error("Set MONGO_URI and ADMIN_EMAIL first.");
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOne({ Role: "admin", $or: [{ CollegeEmail: email }, { PersonalEmail: email }] }).select("Role AccountStatus OTPVerified");
    if (!user) console.log("Admin account not found for the configured ADMIN_EMAIL.");
    else console.log({ role: user.Role, accountStatus: user.AccountStatus, emailVerified: user.OTPVerified });
  } catch (error) { console.error("Admin check failed:", error.message); process.exitCode = 1; }
  finally { await mongoose.disconnect().catch(() => {}); }
}
checkAdmin();
