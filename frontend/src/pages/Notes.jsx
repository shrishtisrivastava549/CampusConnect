
import { useEffect, useMemo, useState } from "react";
import {
  FileText,
  Plus,
  Search,
  ExternalLink,
  BookOpen,
  RefreshCw,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";
import { Link } from "react-router-dom";

import AppLayout from "../components/AppLayout";
import api from "../api/axios";

function Notes() {
  const [notes, setNotes] = useState([]);

  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [semesterFilter, setSemesterFilter] = useState("All");
  const [sort, setSort] = useState("latest");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const courses = [
    "All",
    "MCA",
    "B.Tech",
    "MBA",
    "BBA",
    "BCA",
  ];

  const semesters = [
    "All",
    "1st",
    "2nd",
    "3rd",
    "4th",
    "5th",
    "6th",
    "7th",
    "8th",
  ];

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/notes");
      const data = response.data;

      setNotes(
        Array.isArray(data)
          ? data
          : data.notes || []
      );
    } catch (err) {
      console.error("FETCH NOTES ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load notes. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const filteredNotes = useMemo(() => {
    const query = search.trim().toLowerCase();

    let filtered = notes.filter((note) => {
      const title = note.Title || "";
      const description = note.Description || "";
      const subject = note.Subject || "";
      const course = note.Course || "";
      const semester = note.Semester || "";

      const matchesSearch =
        !query ||
        title.toLowerCase().includes(query) ||
        description.toLowerCase().includes(query) ||
        subject.toLowerCase().includes(query) ||
        course.toLowerCase().includes(query) ||
        semester.toLowerCase().includes(query);

      const matchesCourse =
        courseFilter === "All" ||
        course === courseFilter;

      const matchesSemester =
        semesterFilter === "All" ||
        semester === semesterFilter;

      return (
        matchesSearch &&
        matchesCourse &&
        matchesSemester
      );
    });

    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);

      if (sort === "latest") {
        return dateB - dateA;
      }

      return dateA - dateB;
    });

    return filtered;
  }, [
    notes,
    search,
    courseFilter,
    semesterFilter,
    sort,
  ]);

  const getFileUrl = (filePath) => {
    if (!filePath) {
      return null;
    }

    if (typeof filePath !== "string") {
      return null;
    }

    if (filePath.startsWith("http")) {
      return filePath;
    }

    return `https://campusconnect-backend-0ms4.onrender.com${filePath}`;
  };

  const clearFilters = () => {
    setSearch("");
    setCourseFilter("All");
    setSemesterFilter("All");
    setSort("latest");
  };

  return (
    <AppLayout>
      <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-8">

        {/* BACKGROUND GLOW */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-violet-600/15 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl">

          {/* HEADER */}
          <section className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-300">
                <Sparkles size={14} />
                Campus Learning
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Notes
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                Find and share useful notes with your campus community.
              </p>
            </div>

            <Link
              to="/notes/add"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:-translate-y-0.5 hover:from-blue-500 hover:to-violet-500"
            >
              <Plus size={18} />
              Add Notes
            </Link>

          </section>

          {/* SEARCH + FILTERS */}
          <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-2xl shadow-black/20 backdrop-blur-xl">

            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-200">
              <SlidersHorizontal size={17} className="text-blue-400" />
              Find the right notes
            </div>

            <div className="grid gap-3 lg:grid-cols-4">

              {/* SEARCH */}
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 transition focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/10">
                <Search
                  size={19}
                  className="shrink-0 text-slate-500"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search notes..."
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                />
              </div>

              {/* COURSE */}
              <select
                value={courseFilter}
                onChange={(e) =>
                  setCourseFilter(e.target.value)
                }
                className="rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-300 outline-none transition focus:border-blue-500/50"
              >
                {courses.map((course) => (
                  <option
                    key={course}
                    value={course}
                    className="bg-slate-900"
                  >
                    {course === "All"
                      ? "All Courses"
                      : course}
                  </option>
                ))}
              </select>

              {/* SEMESTER */}
              <select
                value={semesterFilter}
                onChange={(e) =>
                  setSemesterFilter(e.target.value)
                }
                className="rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-300 outline-none transition focus:border-blue-500/50"
              >
                {semesters.map((semester) => (
                  <option
                    key={semester}
                    value={semester}
                    className="bg-slate-900"
                  >
                    {semester === "All"
                      ? "All Semesters"
                      : semester}
                  </option>
                ))}
              </select>

              {/* SORT */}
              <select
                value={sort}
                onChange={(e) =>
                  setSort(e.target.value)
                }
                className="rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-300 outline-none transition focus:border-blue-500/50"
              >
                <option
                  value="latest"
                  className="bg-slate-900"
                >
                  Latest First
                </option>

                <option
                  value="oldest"
                  className="bg-slate-900"
                >
                  Oldest First
                </option>
              </select>

            </div>

            {/* FILTER SUMMARY */}
            <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">

              <p className="text-sm text-slate-400">
                <span className="font-semibold text-slate-200">
                  {filteredNotes.length}
                </span>{" "}
                note
                {filteredNotes.length !== 1
                  ? "s"
                  : ""}{" "}
                found
              </p>

              <button
                type="button"
                onClick={fetchNotes}
                disabled={loading}
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 transition hover:text-blue-300 disabled:opacity-50"
              >
                <RefreshCw
                  size={15}
                  className={
                    loading
                      ? "animate-spin"
                      : ""
                  }
                />
                Refresh
              </button>

            </div>
          </section>

          {/* LOADING */}
          {loading && (
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.05] p-12 text-center backdrop-blur-xl">
              <RefreshCw
                size={32}
                className="mx-auto animate-spin text-blue-400"
              />

              <p className="mt-4 text-sm text-slate-400">
                Loading notes...
              </p>
            </div>
          )}

          {/* ERROR */}
          {!loading && error && (
            <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
              <p className="text-sm text-red-300">
                {error}
              </p>

              <button
                type="button"
                onClick={fetchNotes}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
              >
                Try Again
              </button>
            </div>
          )}

          {/* EMPTY STATE */}
          {!loading &&
            !error &&
            filteredNotes.length === 0 && (
              <div className="mt-8 rounded-2xl border border-dashed border-white/15 bg-white/[0.04] p-12 text-center backdrop-blur-xl">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-400">
                  <BookOpen size={27} />
                </div>

                <h2 className="mt-5 text-xl font-bold text-white">
                  No notes found
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                  {search ||
                  courseFilter !== "All" ||
                  semesterFilter !== "All"
                    ? "Try changing your search or filters."
                    : "Be the first student to share notes with the campus community."}
                </p>

                {search ||
                courseFilter !== "All" ||
                semesterFilter !== "All" ? (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-5 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/10"
                  >
                    Clear Filters
                  </button>
                ) : (
                  <Link
                    to="/notes/add"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                  >
                    <Plus size={17} />
                    Add Notes
                  </Link>
                )}

              </div>
            )}

          {/* NOTES GRID */}
          {!loading &&
            !error &&
            filteredNotes.length > 0 && (
              <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

                {filteredNotes.map((note) => {
                  const fileUrl = getFileUrl(note.File);

                  return (
                    <article
                      key={note._id}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-black/10 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-blue-400/30 hover:bg-white/[0.08] hover:shadow-2xl hover:shadow-blue-950/30"
                    >

                      {/* TOP */}
                      <div className="flex items-start justify-between gap-4">

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-400 transition group-hover:bg-blue-500/15">
                          <FileText size={22} />
                        </div>

                        <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                          Approved
                        </span>

                      </div>

                      {/* TITLE */}
                      <h2 className="mt-5 line-clamp-2 text-lg font-bold leading-7 text-white">
                        {note.Title}
                      </h2>

                      {/* DESCRIPTION */}
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-400">
                        {note.Description ||
                          "No description available."}
                      </p>

                      {/* DETAILS */}
                      <div className="mt-5 space-y-3 border-t border-white/10 pt-4">

                        <div className="flex justify-between gap-4 text-sm">
                          <span className="text-slate-500">
                            Subject
                          </span>

                          <span className="max-w-[65%] truncate text-right font-medium text-slate-300">
                            {note.Subject || "—"}
                          </span>
                        </div>

                        <div className="flex justify-between gap-4 text-sm">
                          <span className="text-slate-500">
                            Course
                          </span>

                          <span className="text-right font-medium text-slate-300">
                            {note.Course || "—"}
                          </span>
                        </div>

                        <div className="flex justify-between gap-4 text-sm">
                          <span className="text-slate-500">
                            Semester
                          </span>

                          <span className="text-right font-medium text-slate-300">
                            {note.Semester || "—"}
                          </span>
                        </div>

                      </div>

                      {/* OWNER */}
                      {note.Owner && (
                        <p className="mt-4 text-xs text-slate-500">
                          Shared by{" "}
                          <span className="font-medium text-slate-400">
                            {note.Owner.Name ||
                              "Student"}
                          </span>
                        </p>
                      )}

                      {/* BUTTONS */}
                      <div className="mt-5 flex gap-2">

                        {fileUrl && (
                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-950/20 transition hover:from-blue-500 hover:to-blue-400"
                          >
                            <ExternalLink size={16} />
                            View File
                          </a>
                        )}

                        {note.DriveLink && (
                          <a
                            href={note.DriveLink}
                            target="_blank"
                            rel="noreferrer"
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
                          >
                            <ExternalLink size={16} />
                            Drive
                          </a>
                        )}

                      </div>

                    </article>
                  );
                })}

              </div>
            )}

        </div>
      </main>
    </AppLayout>
  );
}

export default Notes;

