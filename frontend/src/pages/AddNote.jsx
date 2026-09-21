import { useState } from "react";
import {
  ArrowLeft,
  Plus,
  Upload,
  FileText,
  X,
  Link as LinkIcon,
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

  // =========================
  // FILE CHANGE
  // =========================

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

  // =========================
  // REMOVE FILE
  // =========================

  const removeFile = () => {
    setFile(null);

    const input = document.getElementById("note-file");

    if (input) {
      input.value = "";
    }

    toast.success("File removed.");
  };

  // =========================
  // SUBMIT
  // =========================

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
      <main className="mx-auto max-w-3xl px-6 py-8 lg:px-8">

        {/* BACK */}

        <Link
          to="/notes"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600"
        >
          <ArrowLeft size={17} />
          Back to Notes
        </Link>

        {/* HEADER */}

        <div className="mt-6">
          <p className="text-sm font-medium text-blue-600">
            Campus Learning
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Add Notes
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Share your notes with your campus community.
          </p>
        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >

          {/* TITLE */}

          <div>
            <label className="text-sm font-semibold text-slate-700">
              Note Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Data Structures Complete Notes"
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
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what these notes contain..."
              rows={4}
              className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          {/* SUBJECT + COURSE */}

          <div className="mt-5 grid gap-5 sm:grid-cols-2">

            {/* SUBJECT */}

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Subject
              </label>

              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Data Structures"
                required
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
              />
            </div>

            {/* COURSE */}

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Course
              </label>

              <select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                required
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-500"
              >
                <option value="">
                  Select Course
                </option>

                {courses.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* SEMESTER */}

          <div className="mt-5">

            <label className="text-sm font-semibold text-slate-700">
              Semester
            </label>

            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              required
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-500"
            >
              <option value="">
                Select Semester
              </option>

              {semesters.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

          </div>

          {/* FILE UPLOAD */}

          <div className="mt-5">

            <label className="text-sm font-semibold text-slate-700">
              Note File

              <span className="ml-1 font-normal text-slate-400">
                (optional if link is provided)
              </span>
            </label>

            <label
              htmlFor="note-file"
              className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-8 text-center transition hover:border-blue-300 hover:bg-blue-50"
            >

              <Upload
                size={28}
                className="text-blue-600"
              />

              <p className="mt-3 text-sm font-semibold text-slate-700">
                Click to upload notes
              </p>

              <p className="mt-1 text-xs text-slate-400">
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
              <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3">

                <div className="flex min-w-0 items-center gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <FileText size={19} />
                  </div>

                  <div className="min-w-0">

                    <p className="truncate text-sm font-semibold text-slate-700">
                      {file.name}
                    </p>

                    <p className="text-xs text-slate-400">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={removeFile}
                  className="ml-3 rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
                  title="Remove file"
                >
                  <X size={18} />
                </button>

              </div>
            )}

          </div>

          {/* DRIVE / EXTERNAL LINK */}

          <div className="mt-5">

            <label className="text-sm font-semibold text-slate-700">
              External / Drive Link

              <span className="ml-1 font-normal text-slate-400">
                (optional)
              </span>
            </label>

            <div className="relative">

              <LinkIcon
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="url"
                value={driveLink}
                onChange={(e) => setDriveLink(e.target.value)}
                placeholder="https://drive.google.com/..."
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 pl-11 text-sm outline-none focus:border-blue-500"
              />

            </div>

            <p className="mt-2 text-xs text-slate-400">
              You can provide a link instead of uploading a file.
            </p>

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
              : "Submit Notes"}
          </button>

          <p className="mt-3 text-center text-xs text-slate-400">
            Your notes will be reviewed by an administrator before appearing
            publicly.
          </p>

        </form>

      </main>
    </AppLayout>
  );
}

export default AddNote;