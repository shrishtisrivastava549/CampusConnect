import { useState } from "react";
import {
  ArrowLeft,
  Plus,
  FolderKanban,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import AppLayout from "../components/AppLayout";
import api from "../api/axios";

function AddProject() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [technology, setTechnology] = useState("");
  const [course, setCourse] = useState("");
  const [semester, setSemester] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // COURSE OPTIONS
  // =========================

  const courses = [
    "MCA",
    "B.Tech",
    "MBA",
    "BBA",
    "BCA",
  ];

  // =========================
  // SEMESTER OPTIONS
  // =========================

  const semesters = [
    "1st",
    "2nd",
    "3rd",
    "4th",
    "5th",
    "6th",
    "7th",
    "8th",
  ];

  // =========================
  // SUBMIT PROJECT
  // =========================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem(
        "campusconnect_token"
      );

      if (!token) {
        const message =
          "Login required. Please login again.";

        setError(message);
        toast.error(message);

        navigate("/login");
        return;
      }

      // =========================
      // VALIDATION
      // =========================

      if (
        !title.trim() ||
        !description.trim()
      ) {
        const message =
          "Project Title and Description are required.";

        setError(message);
        toast.error(message);

        setLoading(false);
        return;
      }

      if (!course) {
        const message =
          "Please select a course.";

        setError(message);
        toast.error(message);

        setLoading(false);
        return;
      }

      if (!semester) {
        const message =
          "Please select a semester.";

        setError(message);
        toast.error(message);

        setLoading(false);
        return;
      }

      // =========================
      // API REQUEST
      // =========================

      await api.post(
        "/projects",
        {
          Title: title.trim(),
          Description: description.trim(),
          Technology: technology.trim(),
          Course: course,
          Semester: semester,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // =========================
      // SUCCESS
      // =========================

      toast.success(
        "Project submitted successfully! Waiting for admin approval."
      );

      navigate("/projects");
    } catch (err) {
      console.error(
        "ADD PROJECT ERROR:",
        err
      );

      const message =
        err.response?.data?.message ||
        "Unable to submit project. Please try again.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <main className="mx-auto max-w-3xl px-6 py-8 lg:px-8">

        {/* BACK */}

        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600"
        >
          <ArrowLeft size={17} />
          Back to Projects
        </Link>

        {/* HEADER */}

        <div className="mt-6">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <FolderKanban size={23} />
          </div>

          <p className="mt-5 text-sm font-medium text-blue-600">
            Campus Projects
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Add Project
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Share your project and help other students learn from it.
          </p>

        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >

          {/* PROJECT TITLE */}

          <div>

            <label className="text-sm font-semibold text-slate-700">
              Project Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="e.g. CampusConnect Resource Platform"
              required
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
            />

          </div>

          {/* DESCRIPTION */}

          <div className="mt-5">

            <label className="text-sm font-semibold text-slate-700">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Explain what your project does..."
              rows={6}
              required
              className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
            />

          </div>

          {/* TECHNOLOGY */}

          <div className="mt-5">

            <label className="text-sm font-semibold text-slate-700">
              Technology
            </label>

            <input
              type="text"
              value={technology}
              onChange={(e) =>
                setTechnology(e.target.value)
              }
              placeholder="e.g. React, Node.js, MongoDB"
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
            />

            <p className="mt-2 text-xs text-slate-400">
              You can mention multiple technologies separated by commas.
            </p>

          </div>

          {/* COURSE + SEMESTER */}

          <div className="mt-5 grid gap-5 sm:grid-cols-2">

            {/* COURSE */}

            <div>

              <label className="text-sm font-semibold text-slate-700">
                Course
              </label>

              <select
                value={course}
                onChange={(e) =>
                  setCourse(e.target.value)
                }
                required
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-500"
              >

                <option value="">
                  Select Course
                </option>

                {courses.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}

              </select>

            </div>

            {/* SEMESTER */}

            <div>

              <label className="text-sm font-semibold text-slate-700">
                Semester
              </label>

              <select
                value={semester}
                onChange={(e) =>
                  setSemester(e.target.value)
                }
                required
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-500"
              >

                <option value="">
                  Select Semester
                </option>

                {semesters.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}

              </select>

            </div>

          </div>

          {/* ERROR */}

          {error && (
            <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >

            <Plus size={18} />

            {loading
              ? "Submitting..."
              : "Submit Project"}

          </button>

          <p className="mt-3 text-center text-xs text-slate-400">
            Your project will be reviewed by an administrator before appearing
            publicly.
          </p>

        </form>

      </main>
    </AppLayout>
  );
}

export default AddProject;