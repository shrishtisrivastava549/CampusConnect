const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    // =========================
    // BASIC INFORMATION
    // =========================

    Name: {
        type: String,
        required: true
    },

    // Student
    Course: {
        type: String
    },

    // Faculty
    Department: {
        type: String
    },

    // Student
    AcademicYear: {
        type: String
    },

    Semester: {
        type: String
    },

    // Faculty ID (optional)
    FacultyID: {
        type: String,
        unique: true,
        sparse: true
    },


    // =========================
    // ACCOUNT INFORMATION
    // =========================

    Password: {
        type: String,
        required: true
    },

    CollegeEmail: {
        type: String,
        unique: true,
        sparse: true
    },

    PersonalEmail: {
        type: String,
        unique: true,
        sparse: true
    },

    Phone: {
        type: String,
        unique: true,
        sparse: true
    },


    // =========================
    // OTP VERIFICATION
    // =========================

    OTPVerified: {
        type: Boolean,
        default: false
    },


    // =========================
    // VERIFICATION METHOD
    // =========================

    VerificationMethod: {
        type: String,
        enum: [
            "college_email",
            "college_id",
            "new_student",
            "faculty"
        ]
    },


    // College ID image
    IDCardImage: {
        type: String
    },


    // =========================
    // ACCOUNT STATUS
    // =========================

    AccountStatus: {
        type: String,
        enum: [
            "pending",
            "approved",
            "rejected"
        ],
        default: "pending"
    },


    // =========================
    // USER ROLE
    // =========================

    Role: {
        type: String,
        enum: [
            "student",
            "faculty",
            "admin"
        ],
        default: "student"
    },


    // =========================
    // ADMIN LEVEL
    // =========================

    AdminLevel: {
        type: String,
        enum: [
            "none",
            "cr",
            "faculty_admin",
            "admin"
        ],
        default: "none"
    }

},
{
    timestamps: true
});


module.exports = mongoose.model("User", userSchema);