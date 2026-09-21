import { useEffect, useMemo, useState } from "react";
import {
  FolderKanban,
  Plus,
  Search,
  ExternalLink,
  RefreshCw,
  Code2,
} from "lucide-react";
import { Link } from "react-router-dom";

import AppLayout from "../components/AppLayout";
import api from "../api/axios";

function Projects() {
  const [projects, setProjects] = useState([]);

  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [semesterFilter, setSemesterFilter] = useState("All");
  const [technologyFilter, setTechnologyFilter] = useState("All");
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
  // FETCH PROJECTS
  // =========================

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/projects");

      const data = response.data;

      setProjects(
        Array.isArray(data)
          ? data
          : data.projects || []
      );
    } catch (err) {
      console.error("GET PROJECTS ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load projects. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // =========================
  // DYNAMIC TECHNOLOGIES
  // =========================

  const technologies = useMemo(() => {
    const values = projects
      .map((project) => project.Technology)
      .filter(Boolean)
      .map((technology) => technology.trim())
      .filter(Boolean);

    return [
      "All",
      ...Array.from(new Set(values)),
    ];
  }, [projects]);

  // =========================
  // SEARCH + FILTER + SORT
  // =========================

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    let filtered = projects.filter((project) => {
      const title = project.Title || "";
      const description = project.Description || "";
      const technology = project.Technology || "";
      const course = project.Course || "";
      const semester = project.Semester || "";

      const matchesSearch =
        !query ||
        title.toLowerCase().includes(query) ||
        description.toLowerCase().includes(query) ||
        technology.toLowerCase().includes(query) ||
        course.toLowerCase().includes(query) ||
        semester.toLowerCase().includes(query);

      const matchesCourse =
        courseFilter === "All" ||
        course === courseFilter;

      const matchesSemester =
        semesterFilter === "All" ||
        semester === semesterFilter;

      const matchesTechnology =
        technologyFilter === "All" ||
        technology === technologyFilter;

      return (
        matchesSearch &&
        matchesCourse &&
        matchesSemester &&
        matchesTechnology
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
    projects,
    search,
    courseFilter,
    semesterFilter,
    technologyFilter,
    sort,
  ]);

  // =========================
  // CLEAR FILTERS
  // =========================

  const clearFilters = () => {
    setSearch("");
    setCourseFilter("All");
    setSemesterFilter("All");
    setTechnologyFilter("All");
    setSort("latest");
  };

  const hasFilters =
    search ||
    courseFilter !== "All" ||
    semesterFilter !== "All" ||
    technologyFilter !== "All";

  return (
    <AppLayout>
      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">

        {/* =========================
            HEADER
        ========================= */}

        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

          <div>
            <p className="text-sm font-medium text-blue-600">
              Campus Projects
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Projects
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Explore projects shared by students across your campus.
            </p>
          </div>

          <Link
            to="/projects/add"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Project
          </Link>

        </div>

        {/* =========================
            SEARCH + FILTERS
        ========================= */}

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

          <div className="grid gap-3 lg:grid-cols-5">

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
                placeholder="Search projects..."
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

            {/* TECHNOLOGY */}

            <select
              value={technologyFilter}
              onChange={(e) =>
                setTechnologyFilter(e.target.value)
              }
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-500"
            >
              {technologies.map((technology) => (
                <option
                  key={technology}
                  value={technology}
                >
                  {technology === "All"
                    ? "All Technologies"
                    : technology}
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

          <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-sm text-slate-500">
              {filteredProjects.length} project
              {filteredProjects.length !== 1
                ? "s"
                : ""}{" "}
              found
            </p>

            <div className="flex items-center gap-4">

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm font-medium text-slate-500 hover:text-slate-700"
                >
                  Clear Filters
                </button>
              )}

              <button
                type="button"
                onClick={fetchProjects}
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

          </div>

        </section>

        {/* =========================
            ERROR
        ========================= */}

        {!loading && error && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6">

            <p className="text-sm font-medium text-red-700">
              Unable to load projects
            </p>

            <p className="mt-1 text-sm text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchProjects}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              <RefreshCw size={15} />
              Try Again
            </button>

          </div>
        )}

        {/* =========================
            LOADING
        ========================= */}

        {loading && (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-12 text-center">

            <RefreshCw
              size={30}
              className="mx-auto animate-spin text-blue-600"
            />

            <p className="mt-4 text-sm text-slate-500">
              Loading campus projects...
            </p>

          </div>
        )}

        {/* =========================
            EMPTY STATE
        ========================= */}

        {!loading &&
          !error &&
          filteredProjects.length === 0 && (
            <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                {hasFilters ? (
                  <Search size={25} />
                ) : (
                  <FolderKanban size={25} />
                )}
              </div>

              <h2 className="mt-4 text-lg font-semibold text-slate-900">
                No projects found
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                {hasFilters
                  ? "Try changing your search or filters."
                  : "Be the first student to share a project with your campus."}
              </p>

              {hasFilters ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Clear Filters
                </button>
              ) : (
                <Link
                  to="/projects/add"
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <Plus size={17} />
                  Add Project
                </Link>
              )}

            </div>
          )}

        {/* =========================
            PROJECT GRID
        ========================= */}

        {!loading &&
          !error &&
          filteredProjects.length > 0 && (
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

              {filteredProjects.map((project) => (
                <article
                  key={project._id}
                  className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
                >

                  {/* ICON + STATUS */}

                  <div className="flex items-start justify-between gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <FolderKanban size={21} />
                    </div>

                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
                      Approved
                    </span>

                  </div>

                  {/* TITLE */}

                  <h2 className="mt-5 line-clamp-2 text-lg font-bold text-slate-900">
                    {project.Title}
                  </h2>

                  {/* DESCRIPTION */}

                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                    {project.Description ||
                      "No description available."}
                  </p>

                  {/* PROJECT DETAILS */}

                  <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">

                    {project.Technology && (
                      <div className="flex items-start justify-between gap-3 text-sm">
                        <span className="flex items-center gap-2 text-slate-400">
                          <Code2 size={15} />
                          Technology
                        </span>

                        <span className="text-right font-medium text-slate-700">
                          {project.Technology}
                        </span>
                      </div>
                    )}

                    {project.Course && (
                      <div className="flex justify-between gap-3 text-sm">
                        <span className="text-slate-400">
                          Course
                        </span>

                        <span className="text-right font-medium text-slate-700">
                          {project.Course}
                        </span>
                      </div>
                    )}

                    {project.Semester && (
                      <div className="flex justify-between gap-3 text-sm">
                        <span className="text-slate-400">
                          Semester
                        </span>

                        <span className="text-right font-medium text-slate-700">
                          {project.Semester}
                        </span>
                      </div>
                    )}

                  </div>

                  {/* OWNER */}

                  {project.Owner && (
                    <p className="mt-4 text-xs text-slate-400">
                      Shared by{" "}

                      <span className="font-medium text-slate-500">
                        {project.Owner.Name ||
                          "Student"}
                      </span>
                    </p>
                  )}

                  {/* VIEW PROJECT */}

                  <button
                    type="button"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    <ExternalLink size={16} />
                    View Project
                  </button>

                </article>
              ))}

            </div>
          )}

      </main>
    </AppLayout>
  );
}

export default Projects;