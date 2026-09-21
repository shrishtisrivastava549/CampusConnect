
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
      description: "Access campus resources and learning content",
    },
    {
      id: "faculty",
      label: "Faculty",
      icon: Users,
      description: "Manage and share academic resources",
    },
    {
      id: "admin",
      label: "Admin",
      icon: ShieldCheck,
      description: "Manage and moderate CampusConnect",
    },
  ];

  const handleLogin = async () => {
    console.log("LOGIN BUTTON CLICKED");

    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      console.log("Sending login request...");

      const response = await api.post("/auth/login", {
        Email: email.trim(),
        Password: password,
      });

      console.log("Backend response:", response.data);

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
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center">

        <div className="grid w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm md:grid-cols-2">

          {/* LEFT SIDE */}
          <div className="hidden bg-blue-600 p-10 text-white md:flex md:flex-col md:justify-between">
            <div>
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-100 hover:text-white"
              >
                <ArrowLeft size={18} />
                Back to CampusConnect
              </Link>

              <div className="mt-20">
                <p className="text-sm font-semibold uppercase tracking-wider text-blue-200">
                  CampusConnect
                </p>

                <h1 className="mt-4 text-4xl font-bold leading-tight">
                  Your campus.
                  <br />
                  Your community.
                  <br />
                  Your knowledge.
                </h1>

                <p className="mt-6 max-w-md text-base leading-7 text-blue-100">
                  Discover resources, share notes, explore project ideas
                  and connect with your campus community.
                </p>
              </div>
            </div>

            <p className="text-sm text-blue-200">
              Learn. Share. Grow Together.
            </p>
          </div>

          {/* RIGHT SIDE */}
          <div className="p-6 sm:p-8 md:p-10">

            {/* Mobile Back */}
            <div className="md:hidden">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600"
              >
                <ArrowLeft size={18} />
                Back
              </Link>
            </div>

            {/* Heading */}
            <div className="mt-6 md:mt-0">
              <h2 className="text-3xl font-bold text-slate-900">
                Welcome Back
              </h2>

              <p className="mt-2 text-slate-500">
                Login to your CampusConnect account
              </p>
            </div>

            {/* LOGIN TYPE */}
            <div className="mt-8">
              <p className="mb-3 text-sm font-medium text-slate-700">
                Login as
              </p>

              <div className="grid grid-cols-3 gap-2">
                {loginOptions.map((option) => {
                  const Icon = option.icon;
                  const isActive = loginType === option.id;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        setLoginType(option.id);
                        setError("");
                      }}
                      className={`flex flex-col items-center gap-2 rounded-xl border px-2 py-4 text-center transition ${
                        isActive
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <Icon size={21} />

                      <span className="text-sm font-medium">
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <p className="mt-3 text-xs leading-5 text-slate-400">
                {
                  loginOptions.find(
                    (option) => option.id === loginType
                  )?.description
                }
              </p>
            </div>

            {/* ERROR */}
            {error && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* EMAIL */}
            <div className="mt-7">
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                {loginType === "admin"
                  ? "Admin Email"
                  : "Email Address"}
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={
                  loginType === "admin"
                    ? "Enter admin email"
                    : "you@college.com"
                }
                disabled={loading}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              />
            </div>

            {/* PASSWORD */}
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700"
                >
                  Password
                </label>

                <button
                  type="button"
                  className="text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  Forgot Password?
                </button>
              </div>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter your password"
                disabled={loading}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              />
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className="mt-7 w-full rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading
                ? "Logging in..."
                : `Login as ${
                    loginType.charAt(0).toUpperCase() +
                    loginType.slice(1)
                  }`}
            </button>

            {/* SIGNUP */}
            <div className="mt-7 border-t border-slate-100 pt-6 text-center">
              <p className="text-sm text-slate-500">
                Don't have a CampusConnect account?{" "}
                <Link
                  to="/signup"
                  className="font-semibold text-blue-600 hover:text-blue-700"
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