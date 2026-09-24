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
  const [accountStatus, setAccountStatus] = useState("");

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const selectRole = (selectedRole) => {
    setRole(selectedRole);
    setStep(2);
  };

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
      toast.error("Password must be at least 6 characters");
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

  const createAccount = async () => {
    if (!validateDetails()) {
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...formData,

        Name: formData.Name.trim(),
        Department: formData.Department.trim(),
        Course: formData.Course.trim(),
        AcademicYear: formData.AcademicYear.trim(),
        Semester: formData.Semester.trim(),
        FacultyID: formData.FacultyID.trim(),

        CollegeEmail: formData.CollegeEmail
          .trim()
          .toLowerCase(),

        PersonalEmail: formData.PersonalEmail
          .trim()
          .toLowerCase(),

        Phone: formData.Phone.trim(),

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
      console.error("Signup Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const sendOTP = async () => {
    if (!formData.CollegeEmail.trim()) {
      toast.error("College email is required");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/send-otp", {
        Email: formData.CollegeEmail
          .trim()
          .toLowerCase(),
      });

      setOtpSent(true);

      toast.success(
        "OTP sent to your college email"
      );
    } catch (error) {
      console.error("Send OTP Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to send OTP"
      );
    } finally {
      setLoading(false);
    }
  };

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
          Email: formData.CollegeEmail
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

  const steps = [
    ["1", "Account"],
    ["2", "Details"],
    ["3", "Verify"],
    ["4", "Done"],
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-8 text-white">

      {/* BACKGROUND GLOW */}

      <div className="pointer-events-none absolute left-1/2 top-[-180px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[130px]" />

      <div className="pointer-events-none absolute right-[-150px] top-40 h-[350px] w-[350px] rounded-full bg-purple-600/20 blur-[110px]" />

      <div className="pointer-events-none absolute bottom-[-180px] left-[-100px] h-[350px] w-[350px] rounded-full bg-cyan-500/10 blur-[100px]" />

      <div className="relative z-10 mx-auto w-full max-w-4xl">

        {/* HEADER */}

        <div className="mb-8 text-center">

          <Link
            to="/"
            className="bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-3xl font-extrabold text-transparent"
          >
            CampusConnect
          </Link>

          <p className="mt-2 text-slate-400">
            Join your campus community
          </p>

        </div>

        {/* PROGRESS */}

        <div className="mb-8 flex items-center justify-center">

          {steps.map((item, index) => {
            const number = Number(item[0]);
            const active = step >= number;
            const completed = step > number;

            return (
              <div
                key={item[0]}
                className="flex items-center"
              >

                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition ${
                    active
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/30"
                      : "border border-white/10 bg-white/5 text-slate-500"
                  }`}
                >
                  {completed ? (
                    <Check size={17} />
                  ) : (
                    item[0]
                  )}
                </div>

                <span
                  className={`ml-2 hidden text-sm font-medium sm:block ${
                    active
                      ? "text-blue-300"
                      : "text-slate-600"
                  }`}
                >
                  {item[1]}
                </span>

                {index < 3 && (
                  <div
                    className={`mx-2 h-px w-7 transition sm:w-12 ${
                      step > number
                        ? "bg-blue-500"
                        : "bg-white/10"
                    }`}
                  />
                )}

              </div>
            );
          })}

        </div>

        {/* MAIN CARD */}

        <div className="rounded-[30px] border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-2xl sm:p-10">

          {/* STEP 1 */}

          {step === 1 && (
            <div>

              <div className="mb-8">

                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
                  Get Started
                </p>

                <h1 className="mt-3 text-3xl font-bold">
                  Choose account type
                </h1>

                <p className="mt-2 text-slate-400">
                  Select how you want to join
                  CampusConnect.
                </p>

              </div>

              <div className="grid gap-5 sm:grid-cols-2">

                {/* STUDENT */}

                <button
                  type="button"
                  onClick={() =>
                    selectRole("student")
                  }
                  className="group rounded-2xl border border-white/10 bg-white/5 p-6 text-left transition duration-300 hover:-translate-y-1 hover:border-blue-400/50 hover:bg-blue-500/10 hover:shadow-xl hover:shadow-blue-500/10"
                >

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-400 transition group-hover:scale-110">
                    <GraduationCap size={27} />
                  </div>

                  <h2 className="mt-5 text-xl font-semibold">
                    Student
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    Share and discover resources,
                    notes, projects and knowledge
                    with your campus.
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-blue-400">
                    Continue
                    <ArrowRight
                      size={17}
                      className="transition group-hover:translate-x-1"
                    />
                  </div>

                </button>

                {/* FACULTY */}

                <button
                  type="button"
                  onClick={() =>
                    selectRole("faculty")
                  }
                  className="group rounded-2xl border border-white/10 bg-white/5 p-6 text-left transition duration-300 hover:-translate-y-1 hover:border-purple-400/50 hover:bg-purple-500/10 hover:shadow-xl hover:shadow-purple-500/10"
                >

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-400 transition group-hover:scale-110">
                    <Users size={27} />
                  </div>

                  <h2 className="mt-5 text-xl font-semibold">
                    Faculty
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    Join as faculty using your
                    institutional information.
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-purple-400">
                    Continue
                    <ArrowRight
                      size={17}
                      className="transition group-hover:translate-x-1"
                    />
                  </div>

                </button>

              </div>

            </div>
          )}

          {/* STEP 2 */}

          {step === 2 && (
            <div>

              <button
                type="button"
                onClick={goBack}
                className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
              >
                <ArrowLeft size={16} />
                Back
              </button>

              <div className="mb-7">

                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
                  Step 2
                </p>

                <h1 className="mt-3 text-3xl font-bold">
                  {role === "student"
                    ? "Student details"
                    : "Faculty details"}
                </h1>

                <p className="mt-2 text-slate-400">
                  Enter your details to create
                  your CampusConnect account.
                </p>

              </div>

              <div className="grid gap-5 sm:grid-cols-2">

                {/* NAME */}

                <div className="sm:col-span-2">

                  <label className="mb-2 block text-sm font-medium text-slate-300">
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
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:bg-white/10 focus:ring-2 focus:ring-blue-500/10"
                  />

                </div>

                {/* COURSE */}

                {role === "student" && (
                  <div>

                    <label className="mb-2 block text-sm font-medium text-slate-300">
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
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
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

                  <label className="mb-2 block text-sm font-medium text-slate-300">
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
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:bg-white/10 focus:ring-2 focus:ring-blue-500/10"
                  />

                </div>

                {/* ACADEMIC YEAR */}

                {role === "student" && (
                  <div>

                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Academic Year
                    </label>

                    <select
                      value={formData.AcademicYear}
                      onChange={(e) =>
                        updateField(
                          "AcademicYear",
                          e.target.value
                        )
                      }
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
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

                    <label className="mb-2 block text-sm font-medium text-slate-300">
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
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
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

                    <label className="mb-2 block text-sm font-medium text-slate-300">
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
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
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

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    College Email
                  </label>

                  <input
                    type="email"
                    value={formData.CollegeEmail}
                    onChange={(e) =>
                      updateField(
                        "CollegeEmail",
                        e.target.value
                      )
                    }
                    placeholder="you@college.edu"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                  />

                </div>

                {/* PERSONAL EMAIL */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Personal Email
                    <span className="ml-1 text-xs text-slate-500">
                      (Optional)
                    </span>
                  </label>

                  <input
                    type="email"
                    value={formData.PersonalEmail}
                    onChange={(e) =>
                      updateField(
                        "PersonalEmail",
                        e.target.value
                      )
                    }
                    placeholder="you@gmail.com"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                  />

                </div>

                {/* PHONE */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Phone
                    <span className="ml-1 text-xs text-slate-500">
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
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                  />

                </div>

                {/* PASSWORD */}

                <div className="sm:col-span-2">

                  <label className="mb-2 block text-sm font-medium text-slate-300">
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
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:bg-white/10 focus:ring-2 focus:ring-blue-500/10"
                  />

                  <p className="mt-2 text-xs text-slate-500">
                    Minimum 6 characters
                  </p>

                </div>

              </div>

              {/* CREATE ACCOUNT */}

              <button
                type="button"
                onClick={createAccount}
                disabled={loading}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/10 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
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

          {/* STEP 3 */}

          {step === 3 && (
            <div className="py-6 text-center">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-blue-400/20 bg-blue-500/10 text-blue-400 shadow-lg shadow-blue-500/10">
                <Mail size={32} />
              </div>

              <p className="mt-7 text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
                Verification
              </p>

              <h1 className="mt-3 text-3xl font-bold">
                Verify your email
              </h1>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
                We will send a 6-digit OTP
                to your college email.
              </p>

              <div className="mx-auto mt-7 max-w-md">

                <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                  <span className="font-medium text-white">
                    {formData.CollegeEmail}
                  </span>
                </div>

                {!otpSent ? (
                  <button
                    type="button"
                    onClick={sendOTP}
                    disabled={loading}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-3.5 font-semibold transition hover:shadow-lg hover:shadow-blue-500/20 disabled:opacity-60"
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
                      className="mt-5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-center text-xl font-semibold tracking-[0.4em] text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:bg-white/10"
                    />

                    <button
                      type="button"
                      onClick={verifyOTP}
                      disabled={loading}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-3.5 font-semibold transition hover:shadow-lg hover:shadow-blue-500/20 disabled:opacity-60"
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
                          <ShieldCheck size={18} />
                          Verify OTP
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={sendOTP}
                      disabled={loading}
                      className="mt-4 text-sm font-medium text-blue-400 transition hover:text-blue-300"
                    >
                      Resend OTP
                    </button>
                  </>
                )}

              </div>

              <button
                type="button"
                onClick={goBack}
                className="mx-auto mt-7 flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
              >
                <ArrowLeft size={16} />
                Back to details
              </button>

            </div>
          )}

          {/* STEP 4 */}

          {step === 4 && (
            <div className="py-8 text-center">

              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-500/10 text-emerald-400 shadow-lg shadow-emerald-500/10">
                <Check size={42} />
              </div>

              <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
                All Set
              </p>

              <h1 className="mt-3 text-3xl font-bold">
                Account Verified!
              </h1>

              <p className="mx-auto mt-3 max-w-md leading-7 text-slate-400">
                Your college email has been
                successfully verified and your
                CampusConnect account is ready.
              </p>

              <div className="mx-auto mt-7 max-w-md rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-5">

                <p className="text-sm font-medium text-emerald-300">
                  Account Status
                </p>

                <p className="mt-1 text-lg font-bold capitalize text-emerald-400">
                  {accountStatus || "approved"}
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  navigate("/login")
                }
                className="mt-8 w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                Continue to Login
              </button>

            </div>
          )}

        </div>

        {/* LOGIN LINK */}

        {step !== 4 && (
          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-400 transition hover:text-blue-300"
            >
              Login
            </Link>
          </p>
        )}

        {/* FOOTER */}

        <p className="mt-8 text-center text-xs text-slate-600">
          Learn. Share. Grow Together.
        </p>

      </div>
    </div>
  );
}

export default Signup;