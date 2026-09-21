const User = require("../models/User");
const bcrypt = require("bcryptjs");
const Otp = require("../models/Otp");
const mailSender = require("../utils/mailSender");
const jwt = require("jsonwebtoken");


/* =========================
   SIGNUP
========================= */

const signup = async (req, res) => {
    try {
        const {
            Name,
            Course,
            Department,
            AcademicYear,
            Semester,
            FacultyID,
            Password,
            CollegeEmail,
            PersonalEmail,
            Phone,
            VerificationMethod,
            Role
        } = req.body;

        if (!Name || !Password) {
            return res.status(400).json({
                message: "Name and Password are required"
            });
        }

        /* ADMIN CANNOT SIGN UP */

        if (Role === "admin") {
            return res.status(403).json({
                message:
                    "Admin account cannot be created through signup"
            });
        }

        /* DETERMINE ROLE */

        const userRole =
            Role === "faculty"
                ? "faculty"
                : "student";

        /* VALIDATE VERIFICATION METHOD */

        if (!VerificationMethod) {
            return res.status(400).json({
                message:
                    "Verification method is required"
            });
        }

        if (
            userRole === "student" &&
            VerificationMethod !== "college_email"
        ) {
            return res.status(400).json({
                message:
                    "Student must use college email verification"
            });
        }

        if (
            userRole === "faculty" &&
            VerificationMethod !== "faculty"
        ) {
            return res.status(400).json({
                message:
                    "Faculty must use faculty verification"
            });
        }

        /* COLLEGE EMAIL */

        if (!CollegeEmail) {
            return res.status(400).json({
                message:
                    "College email is required"
            });
        }

        const cleanCollegeEmail =
            CollegeEmail.trim().toLowerCase();

        /* FACULTY ID */

        if (
            userRole === "faculty" &&
            !FacultyID
        ) {
            return res.status(400).json({
                message:
                    "Faculty ID is required"
            });
        }

        /* CHECK EXISTING USER */

        const existingUser =
            await User.findOne({
                $or: [
                    {
                        CollegeEmail:
                            cleanCollegeEmail
                    },

                    ...(PersonalEmail
                        ? [
                              {
                                  PersonalEmail:
                                      PersonalEmail
                                          .trim()
                                          .toLowerCase()
                              }
                          ]
                        : []),

                    ...(Phone
                        ? [
                              {
                                  Phone:
                                      Phone.trim()
                              }
                          ]
                        : []),

                    ...(FacultyID
                        ? [
                              {
                                  FacultyID:
                                      FacultyID.trim()
                              }
                          ]
                        : [])
                ]
            });

        if (existingUser) {
            return res.status(400).json({
                message:
                    "User already exists"
            });
        }

        /* HASH PASSWORD */

        const hashedPassword =
            await bcrypt.hash(
                Password,
                10
            );

        /* CREATE USER */

        const user =
            await User.create({
                Name: Name.trim(),

                Course:
                    Course?.trim() || undefined,

                Department:
                    Department?.trim() || undefined,

                AcademicYear:
                    AcademicYear?.trim() || undefined,

                Semester:
                    Semester?.trim() || undefined,

                FacultyID:
                    FacultyID?.trim() || undefined,

                Password:
                    hashedPassword,

                CollegeEmail:
                    cleanCollegeEmail,

                PersonalEmail:
                    PersonalEmail
                        ?.trim()
                        .toLowerCase() ||
                    undefined,

                Phone:
                    Phone?.trim() ||
                    undefined,

                VerificationMethod,

                OTPVerified: false,

                AccountStatus: "pending",

                Role: userRole,

                AdminLevel: "none"
            });

        res.status(201).json({
            message:
                "Signup successful. Continue with email verification.",

            user: {
                _id: user._id,
                Name: user.Name,
                Course: user.Course,
                Department: user.Department,
                AcademicYear:
                    user.AcademicYear,
                Semester: user.Semester,
                CollegeEmail:
                    user.CollegeEmail,
                PersonalEmail:
                    user.PersonalEmail,
                Phone: user.Phone,
                FacultyID:
                    user.FacultyID,
                Role: user.Role,
                AdminLevel:
                    user.AdminLevel,
                AccountStatus:
                    user.AccountStatus,
                OTPVerified:
                    user.OTPVerified,
                VerificationMethod:
                    user.VerificationMethod
            }
        });

    } catch (error) {
        console.log(
            "Signup Error:",
            error
        );

        res.status(500).json({
            message:
                error.message
        });
    }
};


/* =========================
   SEND OTP
========================= */

const sendOTP = async (req, res) => {
    try {
        const { Email } = req.body;

        if (!Email) {
            return res.status(400).json({
                message:
                    "Email is required"
            });
        }

        const cleanEmail =
            Email.trim().toLowerCase();

        /* CHECK USER */

        const user =
            await User.findOne({
                $or: [
                    {
                        CollegeEmail:
                            cleanEmail
                    },
                    {
                        PersonalEmail:
                            cleanEmail
                    }
                ]
            });

        if (!user) {
            return res.status(404).json({
                message:
                    "User not found"
            });
        }

        /* GENERATE OTP */

        const OTP =
            Math.floor(
                100000 +
                    Math.random() *
                        900000
            ).toString();

        /* DELETE OLD OTP */

        await Otp.deleteMany({
            Email: cleanEmail
        });

        /* SAVE NEW OTP */

        await Otp.create({
            Email: cleanEmail,
            OTP
        });

        /* SEND EMAIL */

        await mailSender(
            cleanEmail,
            "CampusConnect OTP Verification",
            `
            <div
                style="
                    font-family: Arial, sans-serif;
                    padding: 20px;
                    background: #f8fafc;
                "
            >
                <div
                    style="
                        max-width: 500px;
                        margin: auto;
                        background: white;
                        padding: 30px;
                        border-radius: 12px;
                    "
                >
                    <h2
                        style="
                            color: #2563eb;
                        "
                    >
                        CampusConnect
                    </h2>

                    <p>
                        Your email verification OTP is:
                    </p>

                    <h1
                        style="
                            letter-spacing: 8px;
                            color: #0f172a;
                        "
                    >
                        ${OTP}
                    </h1>

                    <p>
                        This OTP is valid for 5 minutes.
                    </p>

                    <p
                        style="
                            color: #64748b;
                            font-size: 13px;
                        "
                    >
                        If you did not request
                        this OTP, please ignore
                        this email.
                    </p>
                </div>
            </div>
            `
        );

        res.status(200).json({
            message:
                "OTP sent successfully"
        });

    } catch (error) {
        console.log(
            "Send OTP Error:",
            error
        );

        res.status(500).json({
            message:
                error.message
        });
    }
};


/* =========================
   VERIFY OTP
========================= */

const verifyOTP = async (req, res) => {
    try {
        const {
            Email,
            OTP
        } = req.body;

        if (!Email || !OTP) {
            return res.status(400).json({
                message:
                    "Email and OTP are required"
            });
        }

        const cleanEmail =
            Email.trim().toLowerCase();

        /* FIND OTP */

        const otpData =
            await Otp.findOne({
                Email: cleanEmail
            });

        if (!otpData) {
            return res.status(400).json({
                message:
                    "OTP expired or not found"
            });
        }

        /* CHECK OTP */

        if (
            otpData.OTP !==
            OTP.trim()
        ) {
            return res.status(400).json({
                message:
                    "Invalid OTP"
            });
        }

        /* FIND USER */

        const user =
            await User.findOne({
                $or: [
                    {
                        CollegeEmail:
                            cleanEmail
                    },
                    {
                        PersonalEmail:
                            cleanEmail
                    }
                ]
            });

        if (!user) {
            return res.status(404).json({
                message:
                    "User not found"
            });
        }

        /* VERIFY */

        user.OTPVerified = true;

        /*
         * Student:
         * College Email + OTP
         * → Approved
         *
         * Faculty:
         * Faculty verification + OTP
         * → Approved
         */

        if (
            (
                user.Role ===
                    "student" &&
                user.VerificationMethod ===
                    "college_email"
            ) ||
            (
                user.Role ===
                    "faculty" &&
                user.VerificationMethod ===
                    "faculty"
            )
        ) {
            user.AccountStatus =
                "approved";
        }

        await user.save();

        /* DELETE USED OTP */

        await Otp.deleteMany({
            Email: cleanEmail
        });

        res.status(200).json({
            message:
                "OTP verified successfully",

            accountStatus:
                user.AccountStatus,

            role:
                user.Role
        });

    } catch (error) {
        console.log(
            "Verify OTP Error:",
            error
        );

        res.status(500).json({
            message:
                error.message
        });
    }
};


/* =========================
   LOGIN
========================= */

const login = async (req, res) => {
    try {
        const {
            Email,
            Password
        } = req.body;

        if (!Email || !Password) {
            return res.status(400).json({
                message:
                    "Email and Password are required"
            });
        }

        const cleanEmail =
            Email.trim().toLowerCase();

        /* FIND USER */

        const user =
            await User.findOne({
                $or: [
                    {
                        CollegeEmail:
                            cleanEmail
                    },
                    {
                        PersonalEmail:
                            cleanEmail
                    }
                ]
            });

        console.log(
            "LOGIN EMAIL:",
            JSON.stringify(
                cleanEmail
            )
        );

        console.log(
            "USER FOUND:",
            user
                ? "YES"
                : "NO"
        );

        if (!user) {
            return res.status(404).json({
                message:
                    "User not found"
            });
        }

        /* PASSWORD CHECK */

        const passwordMatch =
            await bcrypt.compare(
                Password,
                user.Password
            );

        console.log(
            "PASSWORD MATCH:",
            passwordMatch
        );

        console.log(
            "ACCOUNT STATUS:",
            user.AccountStatus
        );

        console.log(
            "ROLE:",
            user.Role
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message:
                    "Invalid email or password"
            });
        }

        /* ACCOUNT APPROVAL CHECK */

        if (
            user.AccountStatus !==
            "approved"
        ) {
            return res.status(403).json({
                message:
                    "Account is not approved yet"
            });
        }

        /* JWT */

        const token =
            jwt.sign(
                {
                    userId:
                        user._id.toString(),

                    role:
                        user.Role,

                    adminLevel:
                        user.AdminLevel
                },

                process.env.JWT_SECRET,

                {
                    expiresIn:
                        "1d"
                }
            );

        /* RESPONSE */

        res.status(200).json({
            message:
                "Login successful",

            token,

            user: {
                _id: user._id,
                Name: user.Name,
                Course:
                    user.Course,
                Department:
                    user.Department,
                AcademicYear:
                    user.AcademicYear,
                Semester:
                    user.Semester,
                CollegeEmail:
                    user.CollegeEmail,
                PersonalEmail:
                    user.PersonalEmail,
                Phone:
                    user.Phone,
                FacultyID:
                    user.FacultyID,
                Role:
                    user.Role,
                AdminLevel:
                    user.AdminLevel
            }
        });

    } catch (error) {
        console.log(
            "Login Error:",
            error
        );

        res.status(500).json({
            message:
                error.message
        });
    }
};


/* =========================
   UPDATE PROFILE
========================= */

const updateProfile = async (
    req,
    res
) => {
    try {
        const {
            Name,
            Course,
            Department,
            AcademicYear,
            Semester,
            PersonalEmail,
            Phone
        } = req.body;

        /* FIND USER */

        const user =
            await User.findById(
                req.user._id
            );

        if (!user) {
            return res.status(404).json({
                message:
                    "User not found"
            });
        }

        /* NAME */

        if (!Name?.trim()) {
            return res.status(400).json({
                message:
                    "Name is required"
            });
        }

        /* PERSONAL EMAIL DUPLICATE */

        if (
            PersonalEmail &&
            PersonalEmail.trim() !==
                user.PersonalEmail
        ) {
            const emailExists =
                await User.findOne({
                    PersonalEmail:
                        PersonalEmail
                            .trim()
                            .toLowerCase(),

                    _id: {
                        $ne:
                            user._id
                    }
                });

            if (emailExists) {
                return res.status(400).json({
                    message:
                        "Personal email is already in use"
                });
            }
        }

        /* PHONE DUPLICATE */

        if (
            Phone &&
            Phone.trim() !==
                user.Phone
        ) {
            const phoneExists =
                await User.findOne({
                    Phone:
                        Phone.trim(),

                    _id: {
                        $ne:
                            user._id
                    }
                });

            if (phoneExists) {
                return res.status(400).json({
                    message:
                        "Phone number is already in use"
                });
            }
        }

        /* UPDATE */

        user.Name =
            Name.trim();

        user.Course =
            Course?.trim() ||
            undefined;

        user.Department =
            Department?.trim() ||
            undefined;

        user.AcademicYear =
            AcademicYear?.trim() ||
            undefined;

        user.Semester =
            Semester?.trim() ||
            undefined;

        user.PersonalEmail =
            PersonalEmail
                ?.trim()
                .toLowerCase() ||
            undefined;

        user.Phone =
            Phone?.trim() ||
            undefined;

        await user.save();

        /* RESPONSE */

        res.status(200).json({
            message:
                "Profile updated successfully",

            user: {
                _id: user._id,
                Name: user.Name,
                Course:
                    user.Course,
                Department:
                    user.Department,
                AcademicYear:
                    user.AcademicYear,
                Semester:
                    user.Semester,
                CollegeEmail:
                    user.CollegeEmail,
                PersonalEmail:
                    user.PersonalEmail,
                Phone:
                    user.Phone,
                FacultyID:
                    user.FacultyID,
                Role:
                    user.Role,
                AdminLevel:
                    user.AdminLevel,
                AccountStatus:
                    user.AccountStatus,
                OTPVerified:
                    user.OTPVerified
            }
        });

    } catch (error) {
        console.log(
            "Update Profile Error:",
            error
        );

        res.status(500).json({
            message:
                error.message
        });
    }
};


/* =========================
   EXPORTS
========================= */

module.exports = {
    signup,
    sendOTP,
    verifyOTP,
    login,
    updateProfile
};