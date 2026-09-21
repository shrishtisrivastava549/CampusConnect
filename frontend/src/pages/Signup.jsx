import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  GraduationCap,
  Users,
  Mail,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";

function Signup() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [role, setRole] = useState("");

  const [formData, setFormData] = useState({
    Name: "",
    Course: "",
    Department: "",
    AcademicYear: "",
    Semester: "",
    FacultyID: "",
    Password: "",
    CollegeEmail: "",
    PersonalEmail: "",
    Phone: "",
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [loading, setLoading] = useState(false);

  const [accountStatus, setAccountStatus] =
    useState("");

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* =========================
     SELECT ROLE
  ========================= */

  const selectRole = (selectedRole) => {
    setRole(selectedRole);
    setStep(2);
  };

  /* =========================
     VALIDATE DETAILS
  ========================= */

  const validateDetails = () => {
    if (!formData.Name.trim()) {
      toast.error("Full name is required");
      return false;
    }

    if (!formData.Department.trim()) {
      toast.error("Department is required");
      return false;
    }

    if (!formData.CollegeEmail.trim()) {
      toast.error("College email is required");
      return false;
    }

    if (!formData.Password) {
      toast.error("Password is required");
      return false;
    }

    if (formData.Password.length < 6) {
      toast.error(
        "Password must be at least 6 characters"
      );
      return false;
    }

    if (role === "student") {
      if (!formData.Course.trim()) {
        toast.error("Course is required");
        return false;
      }

      if (!formData.AcademicYear.trim()) {
        toast.error("Academic year is required");
        return false;
      }

      if (!formData.Semester.trim()) {
        toast.error("Semester is required");
        return false;
      }
    }

    if (role === "faculty") {
      if (!formData.FacultyID.trim()) {
        toast.error("Faculty ID is required");
        return false;
      }
    }

    return true;
  };

  /* =========================
     CREATE ACCOUNT
  ========================= */

  const createAccount = async () => {
    if (!validateDetails()) {
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...formData,

        Name: formData.Name.trim(),
        Department:
          formData.Department.trim(),

        Course:
          formData.Course.trim(),

        AcademicYear:
          formData.AcademicYear.trim(),

        Semester:
          formData.Semester.trim(),

        FacultyID:
          formData.FacultyID.trim(),

        CollegeEmail:
          formData.CollegeEmail
            .trim()
            .toLowerCase(),

        PersonalEmail:
          formData.PersonalEmail
            .trim()
            .toLowerCase(),

        Phone:
          formData.Phone.trim(),

        Role: role,

        VerificationMethod:
          role === "student"
            ? "college_email"
            : "faculty",
      };

      const response = await api.post(
        "/auth/signup",
        payload
      );

      toast.success(
        response.data.message ||
          "Account created successfully"
      );

      setStep(3);

    } catch (error) {
      console.error(
        "Signup Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     SEND OTP
  ========================= */

  const sendOTP = async () => {
    if (!formData.CollegeEmail.trim()) {
      toast.error(
        "College email is required"
      );
      return;
    }

    try {
      setLoading(true);

      await api.post(
        "/auth/send-otp",
        {
          Email:
            formData.CollegeEmail
              .trim()
              .toLowerCase(),
        }
      );

      setOtpSent(true);

      toast.success(
        "OTP sent to your college email"
      );

    } catch (error) {
      console.error(
        "Send OTP Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to send OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     VERIFY OTP
  ========================= */

  const verifyOTP = async () => {
    if (!otp.trim()) {
      toast.error("Please enter OTP");
      return;
    }

    if (otp.trim().length !== 6) {
      toast.error("OTP must be 6 digits");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/auth/verify-otp",
        {
          Email:
            formData.CollegeEmail
              .trim()
              .toLowerCase(),

          OTP: otp.trim(),
        }
      );

      setAccountStatus(
        response.data.accountStatus
      );

      toast.success(
        "Email verified successfully"
      );

      setStep(4);

    } catch (error) {
      console.error(
        "Verify OTP Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "OTP verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     BACK
  ========================= */

  const goBack = () => {
    if (step === 1) {
      navigate("/");
      return;
    }

    if (step === 2) {
      setStep(1);
      return;
    }

    if (step === 3) {
      setStep(2);
      return;
    }
  };

  /* =========================
     UI
  ========================= */

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">

      <div className="mx-auto w-full max-w-3xl">

        {/* HEADER */}

        <div className="mb-8 text-center">
          <Link
            to="/"
            className="text-3xl font-bold text-blue-600"
          >
            CampusConnect
          </Link>

          <p className="mt-2 text-slate-500">
            Join your campus community
          </p>
        </div>

        {/* PROGRESS */}

        <div className="mb-8 flex items-center justify-center">

          {[
            ["1", "Account"],
            ["2", "Details"],
            ["3", "Verify"],
            ["4", "Done"],
          ].map((item, index) => (
            <div
              key={item[0]}
              className="flex items-center"
            >

              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
                  step >= Number(item[0])
                    ? "bg-blue-600 text-white"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {step > Number(item[0]) ? (
                  <Check size={17} />
                ) : (
                  item[0]
                )}
              </div>

              <span
                className={`ml-2 hidden text-sm font-medium sm:block ${
                  step >= Number(item[0])
                    ? "text-blue-600"
                    : "text-slate-400"
                }`}
              >
                {item[1]}
              </span>

              {index < 3 && (
                <div
                  className={`mx-2 h-px w-7 sm:w-12 ${
                    step > Number(item[0])
                      ? "bg-blue-600"
                      : "bg-slate-200"
                  }`}
                />
              )}

            </div>
          ))}

        </div>

        {/* CARD */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          {/* =====================
              STEP 1
          ===================== */}

          {step === 1 && (
            <div>

              <h1 className="text-2xl font-bold text-slate-900">
                Choose account type
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Select how you want to join
                CampusConnect.
              </p>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">

                {/* STUDENT */}

                <button
                  type="button"
                  onClick={() =>
                    selectRole("student")
                  }
                  className="rounded-2xl border-2 border-slate-200 p-6 text-left transition hover:border-blue-400 hover:bg-blue-50"
                >

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <GraduationCap
                      size={25}
                    />
                  </div>

                  <h2 className="mt-5 text-lg font-semibold text-slate-900">
                    Student
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Share and discover
                    resources, notes,
                    projects and knowledge
                    with your campus.
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-sm font-medium text-blue-600">
                    Continue
                    <ArrowRight size={16} />
                  </div>

                </button>

                {/* FACULTY */}

                <button
                  type="button"
                  onClick={() =>
                    selectRole("faculty")
                  }
                  className="rounded-2xl border-2 border-slate-200 p-6 text-left transition hover:border-blue-400 hover:bg-blue-50"
                >

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                    <Users size={25} />
                  </div>

                  <h2 className="mt-5 text-lg font-semibold text-slate-900">
                    Faculty
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Join as faculty using
                    your institutional
                    information.
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-sm font-medium text-blue-600">
                    Continue
                    <ArrowRight size={16} />
                  </div>

                </button>

              </div>

            </div>
          )}

          {/* =====================
              STEP 2
          ===================== */}

          {step === 2 && (
            <div>

              <button
                type="button"
                onClick={goBack}
                className="mb-5 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
              >
                <ArrowLeft size={16} />
                Back
              </button>

              <h1 className="text-2xl font-bold text-slate-900">
                {role === "student"
                  ? "Student details"
                  : "Faculty details"}
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Enter your details to create
                your CampusConnect account.
              </p>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">

                {/* NAME */}

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Full Name
                  </label>

                  <input
                    type="text"
                    value={formData.Name}
                    onChange={(e) =>
                      updateField(
                        "Name",
                        e.target.value
                      )
                    }
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* COURSE */}

                {role === "student" && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Course
                    </label>

                    <select
                      value={formData.Course}
                      onChange={(e) =>
                        updateField(
                          "Course",
                          e.target.value
                        )
                      }
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">
                        Select course
                      </option>
                      <option value="MCA">
                        MCA
                      </option>
                      <option value="B.Tech">
                        B.Tech
                      </option>
                      <option value="MBA">
                        MBA
                      </option>
                      <option value="BBA">
                        BBA
                      </option>
                      <option value="BCA">
                        BCA
                      </option>
                    </select>
                  </div>
                )}

                {/* DEPARTMENT */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Department
                  </label>

                  <input
                    type="text"
                    value={formData.Department}
                    onChange={(e) =>
                      updateField(
                        "Department",
                        e.target.value
                      )
                    }
                    placeholder="e.g. Computer Science"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* ACADEMIC YEAR */}

                {role === "student" && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Academic Year
                    </label>

                    <select
                      value={
                        formData.AcademicYear
                      }
                      onChange={(e) =>
                        updateField(
                          "AcademicYear",
                          e.target.value
                        )
                      }
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">
                        Select year
                      </option>
                      <option value="1st Year">
                        1st Year
                      </option>
                      <option value="2nd Year">
                        2nd Year
                      </option>
                      <option value="3rd Year">
                        3rd Year
                      </option>
                      <option value="4th Year">
                        4th Year
                      </option>
                    </select>
                  </div>
                )}

                {/* SEMESTER */}

                {role === "student" && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Semester
                    </label>

                    <select
                      value={formData.Semester}
                      onChange={(e) =>
                        updateField(
                          "Semester",
                          e.target.value
                        )
                      }
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">
                        Select semester
                      </option>

                      {[
                        "1st",
                        "2nd",
                        "3rd",
                        "4th",
                        "5th",
                        "6th",
                        "7th",
                        "8th",
                      ].map((semester) => (
                        <option
                          key={semester}
                          value={semester}
                        >
                          {semester} Semester
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* FACULTY ID */}

                {role === "faculty" && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Faculty ID
                    </label>

                    <input
                      type="text"
                      value={formData.FacultyID}
                      onChange={(e) =>
                        updateField(
                          "FacultyID",
                          e.target.value
                        )
                      }
                      placeholder="Enter faculty ID"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                )}

                {/* COLLEGE EMAIL */}

                <div
                  className={
                    role === "student"
                      ? "sm:col-span-2"
                      : ""
                  }
                >
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    College Email
                  </label>

                  <input
                    type="email"
                    value={
                      formData.CollegeEmail
                    }
                    onChange={(e) =>
                      updateField(
                        "CollegeEmail",
                        e.target.value
                      )
                    }
                    placeholder="you@college.edu"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* PERSONAL EMAIL */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Personal Email
                    <span className="ml-1 text-xs text-slate-400">
                      (Optional)
                    </span>
                  </label>

                  <input
                    type="email"
                    value={
                      formData.PersonalEmail
                    }
                    onChange={(e) =>
                      updateField(
                        "PersonalEmail",
                        e.target.value
                      )
                    }
                    placeholder="you@gmail.com"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* PHONE */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Phone
                    <span className="ml-1 text-xs text-slate-400">
                      (Optional)
                    </span>
                  </label>

                  <input
                    type="tel"
                    value={formData.Phone}
                    onChange={(e) =>
                      updateField(
                        "Phone",
                        e.target.value
                      )
                    }
                    placeholder="Enter phone number"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* PASSWORD */}

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Password
                  </label>

                  <input
                    type="password"
                    value={formData.Password}
                    onChange={(e) =>
                      updateField(
                        "Password",
                        e.target.value
                      )
                    }
                    placeholder="Create a password"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <p className="mt-1 text-xs text-slate-400">
                    Minimum 6 characters
                  </p>
                </div>

              </div>

              {/* CONTINUE */}

              <button
                type="button"
                onClick={createAccount}
                disabled={loading}
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

            </div>
          )}

          {/* =====================
              STEP 3
          ===================== */}

          {step === 3 && (
            <div className="text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <Mail size={30} />
              </div>

              <h1 className="mt-6 text-2xl font-bold text-slate-900">
                Verify your email
              </h1>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                We will send a 6-digit OTP
                to your college email.
              </p>

              <div className="mx-auto mt-6 max-w-md">

                <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                  <span className="font-medium text-slate-900">
                    {formData.CollegeEmail}
                  </span>
                </div>

                {!otpSent ? (
                  <button
                    type="button"
                    onClick={sendOTP}
                    disabled={loading}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2
                          size={18}
                          className="animate-spin"
                        />
                        Sending OTP...
                      </>
                    ) : (
                      <>
                        Send OTP
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                ) : (
                  <>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={(e) =>
                        setOtp(
                          e.target.value.replace(
                            /\D/g,
                            ""
                          )
                        )
                      }
                      placeholder="Enter 6-digit OTP"
                      className="mt-5 w-full rounded-xl border border-slate-300 px-4 py-4 text-center text-xl font-semibold tracking-[0.4em] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />

                    <button
                      type="button"
                      onClick={verifyOTP}
                      disabled={loading}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                    >
                      {loading ? (
                        <>
                          <Loader2
                            size={18}
                            className="animate-spin"
                          />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <ShieldCheck
                            size={18}
                          />
                          Verify OTP
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={sendOTP}
                      disabled={loading}
                      className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      Resend OTP
                    </button>
                  </>
                )}

              </div>

              <button
                type="button"
                onClick={goBack}
                className="mt-6 flex mx-auto items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
              >
                <ArrowLeft size={16} />
                Back to details
              </button>

            </div>
          )}

          {/* =====================
              STEP 4
          ===================== */}

          {step === 4 && (
            <div className="py-6 text-center">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
                <Check size={38} />
              </div>

              <h1 className="mt-6 text-3xl font-bold text-slate-900">
                Account Verified!
              </h1>

              <p className="mx-auto mt-3 max-w-md text-slate-500">
                Your college email has been
                successfully verified and your
                CampusConnect account is ready.
              </p>

              <div className="mx-auto mt-6 max-w-md rounded-xl border border-green-200 bg-green-50 p-4">
                <p className="text-sm font-medium text-green-800">
                  Account Status
                </p>

                <p className="mt-1 text-lg font-bold capitalize text-green-700">
                  {accountStatus ||
                    "approved"}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate("/login")
                }
                className="mt-7 w-full rounded-xl bg-blue-600 py-3.5 font-medium text-white hover:bg-blue-700"
              >
                Continue to Login
              </button>

            </div>
          )}

        </div>

        {/* LOGIN */}

        {step !== 4 && (
          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Login
            </Link>
          </p>
        )}

      </div>
    </div>
  );
}

export default Signup;