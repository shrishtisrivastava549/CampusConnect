import { useState } from "react";
import {
  ArrowLeft,
  Plus,
  FolderKanban,
  Link as LinkIcon,
  Sparkles,
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
  const [projectLink, setProjectLink] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const courses = ["MCA", "B.Tech", "MBA", "BBA", "BCA"];

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("campusconnect_token");

      if (!token) {
        toast.error("Login required.");
        navigate("/login");
        return;
      }

      if (!title.trim() || !description.trim()) {
        const msg = "Project Title and Description are required.";
        setError(msg);
        toast.error(msg);
        setLoading(false);
        return;
      }

      if (!course) {
        const msg = "Please select a course.";
        setError(msg);
        toast.error(msg);
        setLoading(false);
        return;
      }

      if (!semester) {
        const msg = "Please select a semester.";
        setError(msg);
        toast.error(msg);
        setLoading(false);
        return;
      }

      await api.post(
        "/projects",
        {
          Title: title.trim(),
          Description: description.trim(),
          Technology: technology.trim(),
          Course: course,
          Semester: semester,
          ProjectLink: projectLink.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        "Project submitted successfully! Waiting for admin approval."
      );

      navigate("/projects");
    } catch (err) {
      console.error("ADD PROJECT ERROR:", err);

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
      <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-8">

        {/* Background Glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute right-0 top-48 h-96 w-96 rounded-full bg-violet-600/15 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-3xl">

          {/* Back */}
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-blue-400"
          >
            <ArrowLeft size={17} />
            Back to Projects
          </Link>

          {/* Header */}
          <div className="mt-7">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-300">
              <Sparkles size={14} />
              Campus Innovation
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-400">
                <FolderKanban size={23} />
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Add Project
                </h1>

                <p className="mt-1 text-sm text-slate-400">
                  Showcase your project and help other students learn from it.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="mt-8 rounded-2xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-7"
          >

            {/* Project Title */}
            <div>
              <label className="text-sm font-semibold text-slate-200">
                Project Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. CampusConnect Resource Platform"
                required
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500/60"
              />
            </div>

            {/* Description */}
            <div className="mt-5">
              <label className="text-sm font-semibold text-slate-200">
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what your project does..."
                rows={5}
                required
                className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500/60"
              />
            </div>

            {/* Technology */}
            <div className="mt-5">
              <label className="text-sm font-semibold text-slate-200">
                Technology Stack
              </label>

              <input
                type="text"
                value={technology}
                onChange={(e) => setTechnology(e.target.value)}
                placeholder="React, Node.js, MongoDB..."
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500/60"
              />

              <p className="mt-2 text-xs text-slate-500">
                Separate multiple technologies with commas.
              </p>
            </div>

            {/* Project Link */}
            <div className="mt-5">
              <label className="text-sm font-semibold text-slate-200">
                GitHub / Drive / Live Demo Link
              </label>

              <div className="relative">
                <LinkIcon
                  size={18}
                  className="absolute left-4 top-[27px] -translate-y-1/2 text-slate-500"
                />

                <input
                  type="url"
                  value={projectLink}
                  onChange={(e) => setProjectLink(e.target.value)}
                  placeholder="https://github.com/username/project"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 pl-11 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500/60"
                />
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Optional, but recommended.
              </p>
            </div>

            {/* Course + Semester */}
            <div className="mt-5 grid gap-5 sm:grid-cols-2">

              <div>
                <label className="text-sm font-semibold text-slate-200">
                  Course
                </label>

                <select
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  required
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-300 outline-none focus:border-blue-500/60"
                >
                  <option value="">Select Course</option>

                  {courses.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-200">
                  Semester
                </label>

                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  required
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-300 outline-none focus:border-blue-500/60"
                >
                  <option value="">Select Semester</option>

                  {semesters.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* Error */}
            {error && (
              <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3.5 font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:from-blue-500 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={18} />

              {loading ? "Submitting..." : "Submit Project"}
            </button>

            <p className="mt-3 text-center text-xs text-slate-500">
              Your project will be reviewed by an administrator before appearing
              publicly.
            </p>

          </form>
        </div>
      </main>
    </AppLayout>
  );
}

export default AddProject;