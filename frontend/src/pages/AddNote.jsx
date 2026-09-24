
import { useState } from "react";
import {
  ArrowLeft,
  Plus,
  Upload,
  FileText,
  X,
  Link as LinkIcon,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AppLayout from "../components/AppLayout";
import api from "../api/axios";

function AddNote() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [course, setCourse] = useState("");
  const [semester, setSemester] = useState("");
  const [file, setFile] = useState(null);
  const [driveLink, setDriveLink] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const courses = [
    "MCA",
    "B.Tech",
    "MBA",
    "BBA",
    "BCA",
  ];

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

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      const message = "File size must be 10 MB or less.";

      setError(message);
      toast.error(message);

      event.target.value = "";
      setFile(null);
      return;
    }

    setError("");
    setFile(selectedFile);

    toast.success("File selected successfully.");
  };

  const removeFile = () => {
    setFile(null);

    const input = document.getElementById("note-file");

    if (input) {
      input.value = "";
    }

    toast.success("File removed.");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("campusconnect_token");

      if (!token) {
        const message = "Login required. Please login again.";

        setError(message);
        toast.error(message);

        navigate("/login");
        return;
      }

      if (!file && !driveLink.trim()) {
        const message = "Please upload a file or provide a link.";

        setError(message);
        toast.error(message);

        setLoading(false);
        return;
      }

      if (!title.trim() || !subject.trim()) {
        const message = "Title and Subject are required.";

        setError(message);
        toast.error(message);

        setLoading(false);
        return;
      }

      if (!course) {
        const message = "Please select a course.";

        setError(message);
        toast.error(message);

        setLoading(false);
        return;
      }

      if (!semester) {
        const message = "Please select a semester.";

        setError(message);
        toast.error(message);

        setLoading(false);
        return;
      }

      const formData = new FormData();

      formData.append("Title", title.trim());
      formData.append("Description", description.trim());
      formData.append("Subject", subject.trim());
      formData.append("Course", course);
      formData.append("Semester", semester);

      if (file) {
        formData.append("file", file);
      }

      if (driveLink.trim()) {
        formData.append("DriveLink", driveLink.trim());
      }

      await api.post("/notes", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(
        "Note submitted successfully! Waiting for admin approval."
      );

      navigate("/notes");
    } catch (err) {
      console.error("ADD NOTE ERROR:", err);

      const message =
        err.response?.data?.message ||
        "Unable to submit note. Please try again.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-8">

        {/* BACKGROUND GLOW */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute right-0 top-48 h-96 w-96 rounded-full bg-violet-600/15 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-3xl">

          {/* BACK */}
          <Link
            to="/notes"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-blue-400"
          >
            <ArrowLeft size={17} />
            Back to Notes
          </Link>

          {/* HEADER */}
          <div className="mt-7">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-300">
              <Sparkles size={14} />
              Campus Learning
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-400">
                <BookOpen size={23} />
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">
                  Add Notes
                </h1>

                <p className="mt-1 text-sm text-slate-400">
                  Share your notes with your campus community.
                </p>
              </div>
            </div>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="mt-8 rounded-2xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-7"
          >

            {/* TITLE */}
            <div>
              <label className="text-sm font-semibold text-slate-200">
                Note Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Data Structures Complete Notes"
                required
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10"
              />
            </div>

            {/* DESCRIPTION */}
            <div className="mt-5">
              <label className="text-sm font-semibold text-slate-200">
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what these notes contain..."
                rows={4}
                className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10"
              />
            </div>

            {/* SUBJECT + COURSE */}
            <div className="mt-5 grid gap-5 sm:grid-cols-2">

              {/* SUBJECT */}
              <div>
                <label className="text-sm font-semibold text-slate-200">
                  Subject
                </label>

                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Data Structures"
                  required
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>

              {/* COURSE */}
              <div>
                <label className="text-sm font-semibold text-slate-200">
                  Course
                </label>

                <select
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  required
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-300 outline-none transition focus:border-blue-500/60"
                >
                  <option value="" className="bg-slate-900">
                    Select Course
                  </option>

                  {courses.map((item) => (
                    <option
                      key={item}
                      value={item}
                      className="bg-slate-900"
                    >
                      {item}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* SEMESTER */}
            <div className="mt-5">
              <label className="text-sm font-semibold text-slate-200">
                Semester
              </label>

              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                required
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-300 outline-none transition focus:border-blue-500/60"
              >
                <option value="" className="bg-slate-900">
                  Select Semester
                </option>

                {semesters.map((item) => (
                  <option
                    key={item}
                    value={item}
                    className="bg-slate-900"
                  >
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* FILE UPLOAD */}
            <div className="mt-5">
              <label className="text-sm font-semibold text-slate-200">
                Note File

                <span className="ml-1 font-normal text-slate-500">
                  (optional if link is provided)
                </span>
              </label>

              <label
                htmlFor="note-file"
                className="group mt-2 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 bg-slate-900/50 px-6 py-9 text-center transition hover:border-blue-400/40 hover:bg-blue-500/[0.04]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-400 transition group-hover:scale-105">
                  <Upload size={26} />
                </div>

                <p className="mt-4 text-sm font-semibold text-slate-200">
                  Click to upload notes
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Any file type • Maximum 10 MB
                </p>

                <input
                  id="note-file"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {/* SELECTED FILE */}
              {file && (
                <div className="mt-3 flex items-center justify-between rounded-xl border border-blue-400/20 bg-blue-500/[0.06] p-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-blue-400/20 bg-blue-500/10 text-blue-400">
                      <FileText size={19} />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-200">
                        {file.name}
                      </p>

                      <p className="text-xs text-slate-500">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={removeFile}
                    className="ml-3 rounded-lg p-2 text-slate-500 transition hover:bg-red-500/10 hover:text-red-400"
                    title="Remove file"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
            </div>

            {/* DRIVE / EXTERNAL LINK */}
            <div className="mt-5">
              <label className="text-sm font-semibold text-slate-200">
                External / Drive Link

                <span className="ml-1 font-normal text-slate-500">
                  (optional)
                </span>
              </label>

              <div className="relative">
                <LinkIcon
                  size={18}
                  className="absolute left-4 top-[27px] -translate-y-1/2 text-slate-500"
                />

                <input
                  type="url"
                  value={driveLink}
                  onChange={(e) => setDriveLink(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 pl-11 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>

              <p className="mt-2 text-xs text-slate-500">
                You can provide a link instead of uploading a file.
              </p>
            </div>

            {/* ERROR */}
            {error && (
              <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                {error}
              </div>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-blue-950/20 transition hover:-translate-y-0.5 hover:from-blue-500 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={18} />

              {loading
                ? "Submitting..."
                : "Submit Notes"}
            </button>

            <p className="mt-3 text-center text-xs leading-5 text-slate-500">
              Your notes will be reviewed by an administrator before appearing
              publicly.
            </p>

          </form>
        </div>
      </main>
    </AppLayout>
  );
}

export default AddNote;

