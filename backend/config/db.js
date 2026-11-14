console.log("db.js loaded");

const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        console.log("Connecting to MongoDB...");

        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected Successfully");

    } catch (error) {
        console.log("MongoDB Error:");
        console.log(error);
    }
};

module.exports = connectDB;