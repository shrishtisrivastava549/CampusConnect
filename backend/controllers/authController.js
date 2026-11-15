
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const Otp = require("../models/Otp");
const mailSender = require("../utils/mailSender");
const jwt = require("jsonwebtoken");
const { randomInt } = require("crypto");
const { COURSES, validateStudentAcademic } = require("../config/academic");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const COLLEGE_DOMAIN = "@rkgit.com";

const publicUser = (u) => ({
  _id: u._id,
  Name: u.Name,
  Course: u.Course,
  Department: u.Department,
  AcademicYear: u.AcademicYear,
  Semester: u.Semester,
  CollegeEmail: u.CollegeEmail,
  PersonalEmail: u.PersonalEmail,
  Phone: u.Phone,
  FacultyID: u.FacultyID,
  Role: u.Role,
  AdminLevel: u.AdminLevel,
  AccountStatus: u.AccountStatus,
  OTPVerified: u.OTPVerified,
  ProfilePicture: u.ProfilePicture || ""
});

const signup = async (req, res) => {
  try {
    const {
      Name, Course, Department, AcademicYear, Semester,
      FacultyID, Password, CollegeEmail, PersonalEmail,
      Phone, Role
    } = req.body;

    if (!Name?.trim() || !Password || Password.length < 8)
      return res.status(400).json({
        message: "Name and a password of at least 8 characters are required."
      });

    if (!["student", "faculty"].includes(Role))
      return res.status(403).json({
        message: "Only Student and Faculty accounts can register publicly."
      });

    const email = String(CollegeEmail || PersonalEmail || "")
      .trim().toLowerCase();

    if (!EMAIL_RE.test(email))
      return res.status(400).json({
        message: "Enter a valid email address."
      });

    const isCollegeEmail = email.endsWith(COLLEGE_DOMAIN);

    if (Role === "student") {
      const academicError = validateStudentAcademic({
        Course, Department, AcademicYear, Semester
      });

      if (academicError)
        return res.status(400).json({ message: academicError });
    } else {
      const facultyDepartments = [
        ...new Set(
          Object.values(COURSES).flatMap(course => course.departments)
        )
      ];

      if (!FacultyID?.trim() || !Department?.trim() || !Phone?.trim())
        return res.status(400).json({
          message: "Faculty ID, department, and phone number are required."
        });

      if (!facultyDepartments.includes(Department.trim()))
        return res.status(400).json({
          message: "Select a valid faculty department."
        });
    }

    const cleanPersonal = PersonalEmail?.trim().toLowerCase();

    // Resume signup for an existing unverified account.
    const existingByEmail = await User.findOne({
      $or: [
        { CollegeEmail: email },
        { PersonalEmail: email }
      ]
    });

    if (existingByEmail) {
      const samePassword = await bcrypt.compare(
        Password,
        existingByEmail.Password
      );

      if (
        samePassword &&
        existingByEmail.Role === Role &&
        existingByEmail.OTPVerified === false &&
        existingByEmail.AccountStatus === "pending"
      ) {
        return res.status(200).json({
          message: "Your account already exists and email verification is pending. Continue to OTP verification.",
          user: publicUser(existingByEmail),
          resumeVerification: true
        });
      }

      return res.status(409).json({
        message: "An account already exists with this email, phone number, or Faculty ID. Please log in or contact Admin."
      });
    }

    const checks = [
      { CollegeEmail: email },
      { PersonalEmail: email },
      ...(cleanPersonal
        ? [
            { PersonalEmail: cleanPersonal },
            { CollegeEmail: cleanPersonal }
          ]
        : []),
      ...(Phone?.trim() ? [{ Phone: Phone.trim() }] : []),
      ...(FacultyID?.trim()
        ? [{ FacultyID: FacultyID.trim() }]
        : [])
    ];

    if (await User.findOne({ $or: checks }))
      return res.status(409).json({
        message: "An account already exists with this email, phone number, or Faculty ID."
      });

    const user = await User.create({
      Name: Name.trim(),
      Course: Role === "student" ? Course : undefined,
      Department: Department.trim(),
      AcademicYear: Role === "student" ? AcademicYear : undefined,
      Semester: Role === "student" ? Semester : undefined,
      FacultyID: Role === "faculty" ? FacultyID.trim() : undefined,
      Password: await bcrypt.hash(Password, 12),
      CollegeEmail: isCollegeEmail ? email : undefined,
      PersonalEmail: isCollegeEmail
        ? (cleanPersonal || undefined)
        : email,
      Phone: Phone?.trim() || undefined,
      VerificationMethod: Role === "faculty"
        ? "faculty"
        : (isCollegeEmail ? "college_email" : "new_student"),
      OTPVerified: false,
      AccountStatus: "pending",
      Role,
      AdminLevel: "none"
    });

    return res.status(201).json({
      message: "Account created. Verify your email by OTP. Faculty and personal-email student accounts also require Admin approval.",
      user: publicUser(user)
    });

  } catch (error) {
    console.error("Signup error:", error);

    return res.status(500).json({
      message: error.code === 11000
        ? "Email, phone, or Faculty ID is already registered."
        : "Unable to create account."
    });
  }
};

const sendOTP = async (req, res) => {
  try {
    const email = String(req.body.Email || "")
      .trim().toLowerCase();

    if (!EMAIL_RE.test(email))
      return res.status(400).json({
        message: "Enter a valid email address."
      });

    const user = await User.findOne({
      $or: [
        { CollegeEmail: email },
        { PersonalEmail: email }
      ]
    });

    if (!user)
      return res.status(404).json({
        message: "User not found. Please sign up first."
      });

    const OTP = randomInt(100000, 1000000).toString();

    await Otp.deleteMany({ Email: email });
    await Otp.create({ Email: email, OTP });

    await mailSender(
      email,
      "CampusConnect OTP Verification",
      `<div style="font-family:Arial;padding:24px">
        <h2>CampusConnect</h2>
        <p>Your verification code is:</p>
        <h1 style="letter-spacing:8px">${OTP}</h1>
        <p>This code expires in 5 minutes.</p>
      </div>`
    );

    return res.json({ message: "OTP sent successfully." });

  } catch (error) {
    console.error("Send OTP error:", error.message);

    if (req.body.Email) {
      await Otp.deleteMany({
        Email: String(req.body.Email).trim().toLowerCase()
      }).catch(() => {});
    }

    return res.status(
      error.code === "EMAIL_NOT_CONFIGURED" ? 503 : 502
    ).json({
      message: error.code === "EMAIL_NOT_CONFIGURED"
        ? error.message
        : "OTP email could not be sent. Please try again later."
    });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const email = String(req.body.Email || "")
      .trim().toLowerCase();

    const code = String(req.body.OTP || "").trim();

    if (!EMAIL_RE.test(email) || !/^\d{6}$/.test(code))
      return res.status(400).json({
        message: "A valid email and six-digit OTP are required."
      });

    const otpData = await Otp.findOne({ Email: email });

    if (!otpData)
      return res.status(400).json({
        message: "OTP expired or not found. Request a new OTP."
      });

    const created = otpData.CreatedAt || otpData._id.getTimestamp();

    if (Date.now() - new Date(created).getTime() > 5 * 60 * 1000) {
      await Otp.deleteMany({ Email: email });

      return res.status(400).json({
        message: "OTP expired. Request a new OTP."
      });
    }

    if (otpData.OTP !== code)
      return res.status(400).json({
        message: "Invalid OTP."
      });

    const user = await User.findOne({
      $or: [
        { CollegeEmail: email },
        { PersonalEmail: email }
      ]
    });

    if (!user)
      return res.status(404).json({
        message: "User not found."
      });

    user.OTPVerified = true;

    if (
      user.Role === "student" &&
      user.AccountStatus === "pending" &&
      user.VerificationMethod === "college_email" &&
      email.endsWith(COLLEGE_DOMAIN)
    ) {
      user.AccountStatus = "approved";
    }

    await user.save();
    await Otp.deleteMany({ Email: email });

    return res.json({
      message: "Email verified successfully.",
      accountStatus: user.AccountStatus,
      role: user.Role,
      approvalRequired: user.AccountStatus === "pending"
    });

  } catch (error) {
    console.error("Verify OTP error:", error);

    return res.status(500).json({
      message: "Unable to verify OTP."
    });
  }
};

const login = async (req, res) => {
  try {
    const email = String(req.body.Email || "")
      .trim().toLowerCase();

    const { Password, Role } = req.body;

    if (
      !email ||
      !Password ||
      !["student", "faculty", "admin"].includes(Role)
    ) {
      return res.status(400).json({
        message: "Email, password and a valid login type are required."
      });
    }

    const user = await User.findOne({
      $or: [
        { CollegeEmail: email },
        { PersonalEmail: email }
      ]
    });

    if (!user || !(await bcrypt.compare(Password, user.Password)))
      return res.status(401).json({
        message: "Invalid email or password."
      });

    if (user.Role !== Role)
      return res.status(403).json({
        message: `This account is registered as ${user.Role}. Please use ${user.Role} login.`
      });

    if (!user.OTPVerified)
      return res.status(403).json({
        message: "Please verify your email before logging in."
      });

    if (user.AccountStatus !== "approved")
      return res.status(403).json({
        message: user.AccountStatus === "rejected"
          ? "This account has been rejected. Contact Admin."
          : "Your account is pending Admin approval."
      });

    if (!process.env.JWT_SECRET)
      return res.status(500).json({
        message: "Server authentication is not configured."
      });

    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      message: "Login successful",
      token,
      user: publicUser(user)
    });

  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Unable to log in."
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user)
      return res.status(404).json({
        message: "User not found."
      });

    const { Name, Email, CollegeEmail, PersonalEmail, Phone } = req.body;

    if (Name !== undefined) {
      if (!Name.trim())
        return res.status(400).json({
          message: "Name is required."
        });

      user.Name = Name.trim();
    }

    const newEmail = String(
      Email || CollegeEmail || PersonalEmail || ""
    ).trim().toLowerCase();

    if (newEmail) {
      if (!EMAIL_RE.test(newEmail))
        return res.status(400).json({
          message: "Enter a valid email address."
        });

      const duplicate = await User.findOne({
        _id: { $ne: user._id },
        $or: [
          { CollegeEmail: newEmail },
          { PersonalEmail: newEmail }
        ]
      });

      if (duplicate)
        return res.status(409).json({
          message: "Email is already in use."
        });

      if (newEmail.endsWith(COLLEGE_DOMAIN)) {
        user.CollegeEmail = newEmail;
        user.PersonalEmail = undefined;
        user.VerificationMethod = "college_email";
      } else {
        user.PersonalEmail = newEmail;
        user.CollegeEmail = undefined;
        user.VerificationMethod = "new_student";
      }

      user.OTPVerified = false;

      if (user.Role !== "admin")
        user.AccountStatus = "pending";
    }

    if (Phone !== undefined) {
      const phone = Phone.trim();

      if (
        phone &&
        await User.findOne({
          Phone: phone,
          _id: { $ne: user._id }
        })
      ) {
        return res.status(409).json({
          message: "Phone number is already in use."
        });
      }

      user.Phone = phone || undefined;
    }

    if (req.file)
      user.ProfilePicture = `/uploads/profiles/${req.file.filename}`;

    await user.save();

    return res.json({
      message: "Profile updated successfully.",
      user: publicUser(user)
    });

  } catch (error) {
    console.error("Profile update error:", error);

    return res.status(500).json({
      message: "Unable to update profile."
    });
  }
};

const getAcademicOptions = (_req, res) =>
  res.json({ courses: COURSES });

module.exports = {
  signup,
  sendOTP,
  verifyOTP,
  login,
  updateProfile,
  getAcademicOptions
};
