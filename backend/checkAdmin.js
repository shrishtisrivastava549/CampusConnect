require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const checkAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const user = await User.findOne({
            PersonalEmail: "srishtishrivastava931@gmail.com"
        });

        if (!user) {
            console.log("Admin not found");
            process.exit();
        }

        console.log("Email:", user.PersonalEmail);
        console.log("Role:", user.Role);

        const match = await bcrypt.compare("Admin@12345", user.Password);

        console.log("Password Match:", match);

        process.exit();

    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

checkAdmin();