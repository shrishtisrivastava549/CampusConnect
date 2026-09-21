import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  BookOpen,
  FileText,
  FolderKanban,
  ArrowRight,
  RefreshCw,
  Clock,
  Sparkles,
} from "lucide-react";
import api from "../api/axios";

function Explore() {
  const [resources, setResources] = useState([]);
  const [notes, setNotes] = useState([]);
  const [projects, setProjects] = useState([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const getArray = (response) => {
    const data = response?.data;

    if (Array.isArray(data)) return data;

    if (Array.isArray(data?.resources)) return data.resources;
    if (Array.isArray(data?.notes)) return data.notes;
    if (Array.isArray(data?.projects)) return data.projects;
    if (Array.isArray(data?.data)) return data.data;

    return [];
  };

  const fetchExploreData = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const [resourcesRes, notesRes, projectsRes] =
        await Promise.all([
          api.get("/resources"),
          api.get("/notes"),
          api.get("/projects"),
        ]);

      setResources(getArray(resourcesRes));
      setNotes(getArray(notesRes));
      setProjects(getArray(projectsRes));
    } catch (err) {
      console.error("Explore fetch error:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to load explore content."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchExploreData();
  }, []);

  const filteredResources = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return resources;

    return resources.filter((item) =>
      [
        item.Title,
        item.Description,
        item.Subject,
        item.Course,
        item.Semester,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(query)
        )
    );
  }, [resources, search]);

  const filteredNotes = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return notes;

    return notes.filter((item) =>
      [
        item.Title,
        item.Description,
        item.Subject,
        item.Course,
        item.Semester,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(query)
        )
    );
  }, [notes, search]);

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return projects;

    return projects.filter((item) =>
      [
        item.Title,
        item.Description,
        item.Technology,
        item.Course,
        item.Semester,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(query)
        )
    );
  }, [projects, search]);

  const latestResources = [...filteredResources]
    .sort(
      (a, b) =>
        new Date(b.createdAt || b.createdAt) -
        new Date(a.createdAt || a.createdAt)
    )
    .slice(0, 4);

  const latestNotes = [...filteredNotes]
    .sort(
      (a, b) =>
        new Date(b.createdAt || b.createdAt) -
        new Date(a.createdAt || a.createdAt)
    )
    .slice(0, 4);

  const latestProjects = [...filteredProjects]
    .sort(
      (a, b) =>
        new Date(b.createdAt || b.createdAt) -
        new Date(a.createdAt || a.createdAt)
    )
    .slice(0, 4);

  const totalResults =
    filteredResources.length +
    filteredNotes.length +
    filteredProjects.length;

  const formatDate = (date) => {
    if (!date) return "Recently";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "Recently";
    }

    return parsed.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const LoadingCard = () => (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5">
      <div className="h-10 w-10 rounded-xl bg-slate-200" />
      <div className="mt-4 h-5 w-3/4 rounded bg-slate-200" />
      <div className="mt-3 h-4 w-full rounded bg-slate-100" />
      <div className="mt-2 h-4 w-2/3 rounded bg-slate-100" />
    </div>
  );

  const ContentCard = ({ item, type }) => {
    const isResource = type === "resource";
    const isNote = type === "note";

    const Icon = isResource
      ? BookOpen
      : isNote
      ? FileText
      : FolderKanban;

    const title = item.Title || "Untitled";
    const description =
      item.Description || "No description available.";

    const meta = isResource
      ? item.Subject || item.Course || "Resource"
      : isNote
      ? item.Subject || item.Course || "Note"
      : item.Technology || item.Course || "Project";

    const link = isResource
      ? "/resources"
      : isNote
      ? "/notes"
      : "/projects";

    return (
      <Link
        to={link}
        className="group block rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Icon size={20} />
          </div>

          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
            {meta}
          </span>
        </div>

        <h3 className="mt-4 line-clamp-1 text-base font-semibold text-slate-900 group-hover:text-blue-600">
          {title}
        </h3>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
          {description}
        </p>

        <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
          <Clock size={14} />
          {formatDate(item.createdAt)}
        </div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-blue-600">
              <Sparkles size={18} />

              <span className="text-sm font-semibold">
                Discover Campus
              </span>
            </div>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Explore
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Discover useful resources, notes, and projects
              shared by your campus community.
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchExploreData(true)}
            disabled={refreshing}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* SEARCH */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search resources, notes, projects..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {!loading && (
            <p className="mt-3 text-xs text-slate-400">
              {totalResults} result
              {totalResults !== 1 ? "s" : ""} found
            </p>
          )}
        </div>

        {/* ERROR */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* RESOURCES */}
        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <BookOpen size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Resources
                </h2>

                <p className="text-xs text-slate-500">
                  Study material and useful files
                </p>
              </div>
            </div>

            <Link
              to="/resources"
              className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View all
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <LoadingCard />
              <LoadingCard />
              <LoadingCard />
              <LoadingCard />
            </div>
          ) : latestResources.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {latestResources.map((item) => (
                <ContentCard
                  key={item._id}
                  item={item}
                  type="resource"
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <BookOpen
                size={30}
                className="mx-auto text-slate-300"
              />

              <p className="mt-3 text-sm text-slate-500">
                No resources found.
              </p>
            </div>
          )}
        </section>

        {/* NOTES */}
        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <FileText size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Notes
                </h2>

                <p className="text-xs text-slate-500">
                  Notes shared by students
                </p>
              </div>
            </div>

            <Link
              to="/notes"
              className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View all
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <LoadingCard />
              <LoadingCard />
              <LoadingCard />
              <LoadingCard />
            </div>
          ) : latestNotes.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {latestNotes.map((item) => (
                <ContentCard
                  key={item._id}
                  item={item}
                  type="note"
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <FileText
                size={30}
                className="mx-auto text-slate-300"
              />

              <p className="mt-3 text-sm text-slate-500">
                No notes found.
              </p>
            </div>
          )}
        </section>

        {/* PROJECTS */}
        <section className="mt-10 pb-10">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <FolderKanban size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Projects
                </h2>

                <p className="text-xs text-slate-500">
                  Interesting projects from your campus
                </p>
              </div>
            </div>

            <Link
              to="/projects"
              className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View all
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <LoadingCard />
              <LoadingCard />
              <LoadingCard />
              <LoadingCard />
            </div>
          ) : latestProjects.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {latestProjects.map((item) => (
                <ContentCard
                  key={item._id}
                  item={item}
                  type="project"
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <FolderKanban
                size={30}
                className="mx-auto text-slate-300"
              />

              <p className="mt-3 text-sm text-slate-500">
                No projects found.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Explore;