import { useEffect, useMemo, useState } from "react";
import {
  FileText,
  Plus,
  Search,
  ExternalLink,
  BookOpen,
  RefreshCw,
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

  // =========================
  // FIXED COURSE OPTIONS
  // =========================

  const courses = [
    "All",
    "MCA",
    "B.Tech",
    "MBA",
    "BBA",
    "BCA",
  ];

  // =========================
  // FIXED SEMESTER OPTIONS
  // =========================

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

  // =========================
  // FETCH NOTES
  // =========================

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

  // =========================
  // SEARCH + FILTER + SORT
  // =========================

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

  // =========================
  // FILE URL
  // =========================

  const getFileUrl = (filePath) => {
    if (!filePath) {
      return null;
    }

    if (filePath.startsWith("http")) {
      return filePath;
    }

    return `http://localhost:5000${filePath}`;
  };

  return (
    <AppLayout>
      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">

        {/* =========================
            HEADER
        ========================= */}

        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

          <div>
            <p className="text-sm font-medium text-blue-600">
              Campus Learning
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Notes
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Find and share useful notes with your campus community.
            </p>
          </div>

          <Link
            to="/notes/add"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Notes
          </Link>

        </div>

        {/* =========================
            SEARCH + FILTERS
        ========================= */}

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

          <div className="grid gap-3 lg:grid-cols-4">

            {/* SEARCH */}

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">

              <Search
                size={19}
                className="shrink-0 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search notes..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />

            </div>

            {/* COURSE */}

            <select
              value={courseFilter}
              onChange={(e) =>
                setCourseFilter(e.target.value)
              }
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-500"
            >
              {courses.map((course) => (
                <option
                  key={course}
                  value={course}
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
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-500"
            >
              {semesters.map((semester) => (
                <option
                  key={semester}
                  value={semester}
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
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-500"
            >
              <option value="latest">
                Latest First
              </option>

              <option value="oldest">
                Oldest First
              </option>
            </select>

          </div>

          {/* FILTER SUMMARY */}

          <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-sm text-slate-500">
              {filteredNotes.length} note
              {filteredNotes.length !== 1
                ? "s"
                : ""}{" "}
              found
            </p>

            <button
              type="button"
              onClick={fetchNotes}
              disabled={loading}
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"
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

        {/* =========================
            LOADING
        ========================= */}

        {loading && (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-10 text-center">

            <RefreshCw
              size={30}
              className="mx-auto animate-spin text-blue-600"
            />

            <p className="mt-4 text-sm text-slate-500">
              Loading notes...
            </p>

          </div>
        )}

        {/* =========================
            ERROR
        ========================= */}

        {!loading && error && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6">

            <p className="text-sm text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchNotes}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Try Again
            </button>

          </div>
        )}

        {/* =========================
            EMPTY STATE
        ========================= */}

        {!loading &&
          !error &&
          filteredNotes.length === 0 && (
            <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <BookOpen size={25} />
              </div>

              <h2 className="mt-4 text-lg font-semibold text-slate-900">
                No notes found
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                {search ||
                courseFilter !== "All" ||
                semesterFilter !== "All"
                  ? "Try changing your search or filters."
                  : "Be the first student to share notes."}
              </p>

              {search ||
              courseFilter !== "All" ||
              semesterFilter !== "All" ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setCourseFilter("All");
                    setSemesterFilter("All");
                    setSort("latest");
                  }}
                  className="mt-5 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Clear Filters
                </button>
              ) : (
                <Link
                  to="/notes/add"
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <Plus size={17} />
                  Add Notes
                </Link>
              )}

            </div>
          )}

        {/* =========================
            NOTES GRID
        ========================= */}

        {!loading &&
          !error &&
          filteredNotes.length > 0 && (
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

              {filteredNotes.map((note) => {
                const fileUrl = getFileUrl(
                  note.File
                );

                return (
                  <article
                    key={note._id}
                    className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
                  >

                    {/* ICON + STATUS */}

                    <div className="flex items-start justify-between">

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <FileText size={21} />
                      </div>

                      <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
                        Approved
                      </span>

                    </div>

                    {/* TITLE */}

                    <h2 className="mt-4 line-clamp-2 text-lg font-bold text-slate-900">
                      {note.Title}
                    </h2>

                    {/* DESCRIPTION */}

                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                      {note.Description ||
                        "No description available."}
                    </p>

                    {/* DETAILS */}

                    <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">

                      <div className="flex justify-between gap-3 text-sm">
                        <span className="text-slate-400">
                          Subject
                        </span>

                        <span className="text-right font-medium text-slate-700">
                          {note.Subject || "—"}
                        </span>
                      </div>

                      <div className="flex justify-between gap-3 text-sm">
                        <span className="text-slate-400">
                          Course
                        </span>

                        <span className="text-right font-medium text-slate-700">
                          {note.Course || "—"}
                        </span>
                      </div>

                      <div className="flex justify-between gap-3 text-sm">
                        <span className="text-slate-400">
                          Semester
                        </span>

                        <span className="text-right font-medium text-slate-700">
                          {note.Semester || "—"}
                        </span>
                      </div>

                    </div>

                    {/* OWNER */}

                    {note.Owner && (
                      <p className="mt-4 text-xs text-slate-400">
                        Shared by{" "}

                        <span className="font-medium text-slate-500">
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
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
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
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
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

      </main>
    </AppLayout>
  );
}

export default Notes;