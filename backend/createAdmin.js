const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

const createAdmin = async () => {

    try {

        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected");

        const existingAdmin = await User.findOne({
            Role: "admin"
        });

        if (existingAdmin) {
            console.log("Admin already exists.");
            process.exit();
        }

        const hashedPassword = await bcrypt.hash(
            "Admin@12345",
            10
        );

        const admin = await User.create({

            Name: "CampusConnect Admin",

            Password: hashedPassword,

            PersonalEmail: "srishtishrivastava931@gmail.com",

            Phone: "9319807121",

            OTPVerified: true,

            AccountStatus: "approved",

            Role: "admin",

            AdminLevel: "admin",

            VerificationMethod: "college_email"

        });

        console.log("Admin created successfully!");
        console.log(admin);

        process.exit();

    } catch (error) {

        console.log("Error creating admin:");
        console.log(error);

        process.exit(1);

    }

};

createAdmin();