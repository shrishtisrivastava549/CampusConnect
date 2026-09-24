
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  GraduationCap,
  ShieldCheck,
  Users,
} from "lucide-react";
import api from "../api/axios";

function Login() {
  const navigate = useNavigate();

  const [loginType, setLoginType] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loginOptions = [
    {
      id: "student",
      label: "Student",
      icon: GraduationCap,
      description: "Access campus resources",
    },
    {
      id: "faculty",
      label: "Faculty",
      icon: Users,
      description: "Manage academic resources",
    },
    {
      id: "admin",
      label: "Admin",
      icon: ShieldCheck,
      description: "Moderate CampusConnect",
    },
  ];

  const handleLogin = async () => {
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        Email: email.trim(),
        Password: password,
      });

      const { token, user } = response.data;

      localStorage.setItem("campusconnect_token", token);
      localStorage.setItem(
        "campusconnect_user",
        JSON.stringify(user)
      );

      if (user.Role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">

      {/* Background Glow */}
      <div className="absolute left-1/2 top-0 h-[450px] w-[650px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[120px]" />
      <div className="absolute right-[-120px] top-40 h-[300px] w-[300px] rounded-full bg-purple-600/20 blur-[90px]" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center justify-center px-5 py-10">

        <div className="grid w-full max-w-6xl overflow-hidden rounded-[32px] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl md:grid-cols-2">

          {/* LEFT */}
          <div className="hidden flex-col justify-between bg-gradient-to-br from-blue-700/70 via-blue-600/40 to-purple-700/40 p-10 md:flex">

            <div>

              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm text-blue-100 hover:text-white"
              >
                <ArrowLeft size={18} />
                Back to Home
              </Link>

              <div className="mt-20">

                <p className="text-sm uppercase tracking-[0.3em] text-blue-200">
                  CampusConnect
                </p>

                <h1 className="mt-4 text-5xl font-extrabold leading-tight">
                  Welcome
                  <br />
                  Back.
                </h1>

                <p className="mt-6 max-w-md leading-7 text-blue-100">
                  Login to access notes, resources, projects,
                  recommendations and your campus community.
                </p>

              </div>
            </div>

            <div className="space-y-3">

              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 p-3">
                <span>📚</span>
                <span className="text-sm">Campus Resources</span>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 p-3">
                <span>🚀</span>
                <span className="text-sm">Student Projects</span>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 p-3">
                <span>🤝</span>
                <span className="text-sm">Community Support</span>
              </div>

            </div>

          </div>

          {/* RIGHT */}
          <div className="bg-slate-950/30 p-6 sm:p-10">

            <div className="md:hidden">

              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm text-slate-300"
              >
                <ArrowLeft size={18} />
                Back
              </Link>

            </div>

            <div className="mt-6 md:mt-0">

              <h2 className="text-3xl font-bold">
                Sign in
              </h2>

              <p className="mt-2 text-slate-400">
                Continue your CampusConnect journey.
              </p>

            </div>

            {/* Login Type */}
            <div className="mt-8">

              <p className="mb-3 text-sm text-slate-300">
                Continue as
              </p>

              <div className="grid grid-cols-3 gap-2">

                {loginOptions.map((option) => {
                  const Icon = option.icon;
                  const active = loginType === option.id;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setLoginType(option.id)}
                      className={`rounded-xl border p-3 transition ${
                        active
                          ? "border-blue-500 bg-blue-500/20 text-white"
                          : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Icon size={20} />
                        <span className="text-xs font-medium">
                          {option.label}
                        </span>
                      </div>
                    </button>
                  );
                })}

              </div>

              <p className="mt-3 text-xs text-slate-500">
                {
                  loginOptions.find(
                    (o) => o.id === loginType
                  )?.description
                }
              </p>

            </div>

            {/* Error */}
            {error && (
              <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="mt-7">

              <label className="mb-2 block text-sm text-slate-300">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@college.com"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:bg-white/10"
              />

            </div>

            {/* Password */}
            <div className="mt-5">

              <div className="mb-2 flex justify-between">

                <label className="text-sm text-slate-300">
                  Password
                </label>

                <button
                  type="button"
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  Forgot?
                </button>

              </div>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:bg-white/10"
              />

            </div>

            {/* Button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="mt-8 w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-3.5 font-semibold transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Login"}
            </button>

            {/* Signup */}
            <div className="mt-8 border-t border-white/10 pt-6 text-center">

              <p className="text-sm text-slate-400">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-semibold text-blue-400 hover:text-blue-300"
                >
                  Create Account
                </Link>
              </p>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;