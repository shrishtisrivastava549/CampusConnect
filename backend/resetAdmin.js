const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

async function resetAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  const hash = await bcrypt.hash("Admin@123", 10);

  await User.updateOne(
    { PersonalEmail: "srishtishrivastava931@gmail.com" },
    { $set: { Password: hash } }
  );

  console.log("DONE");
  process.exit();
}

resetAdmin();