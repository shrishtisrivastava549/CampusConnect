const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

const resetPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const hashedPassword = await bcrypt.hash("Faculty@123", 10);

        const user = await User.findOneAndUpdate(
            { CollegeEmail: "facultytest@college.com" },
            { Password: hashedPassword },
            { new: true }
        );

        if (!user) {
            console.log("Faculty user not found");
        } else {
            console.log("Faculty password reset successfully");
        }

        await mongoose.disconnect();

    } catch (error) {
        console.log("Error:", error);
    }
};

resetPassword();