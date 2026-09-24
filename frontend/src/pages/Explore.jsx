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
    <div className="animate-pulse rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <div className="h-11 w-11 rounded-xl bg-white/10" />
      <div className="mt-5 h-5 w-3/4 rounded bg-white/10" />
      <div className="mt-3 h-4 w-full rounded bg-white/5" />
      <div className="mt-2 h-4 w-2/3 rounded bg-white/5" />
      <div className="mt-5 h-3 w-1/3 rounded bg-white/5" />
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

    const iconStyle = isResource
      ? "bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20"
      : isNote
      ? "bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20"
      : "bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20";

    return (
      <Link
        to={link}
        className="group block rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.08] hover:shadow-2xl active:scale-[0.99]"
      >
        <div className="flex items-start justify-between gap-4">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition duration-300 group-hover:scale-110 ${iconStyle}`}
          >
            <Icon size={20} />
          </div>

          <span className="max-w-[55%] truncate rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-500 transition group-hover:text-slate-300">
            {meta}
          </span>
        </div>

        <h3 className="mt-5 line-clamp-1 text-base font-semibold text-slate-100 transition group-hover:text-blue-400">
          {title}
        </h3>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
          {description}
        </p>

        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Clock size={14} />
            {formatDate(item.createdAt)}
          </div>

          <ArrowRight
            size={15}
            className="text-slate-700 transition group-hover:translate-x-1 group-hover:text-blue-400"
          />
        </div>
      </Link>
    );
  };

  const EmptyState = ({ icon: Icon, message }) => (
    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-slate-600">
        <Icon size={28} />
      </div>

      <p className="mt-4 text-sm text-slate-500">
        {message}
      </p>
    </div>
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">

      {/* BACKGROUND GLOW */}

      <div className="pointer-events-none absolute left-1/2 top-[-180px] h-[500px] w-[750px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[130px]" />

      <div className="pointer-events-none absolute right-[-160px] top-[400px] h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[120px]" />

      <div className="pointer-events-none absolute bottom-[-180px] left-[-100px] h-[350px] w-[350px] rounded-full bg-cyan-500/10 blur-[110px]" />

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

        {/* =========================
            HEADER
        ========================== */}

        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

          <div>

            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-300">
              <Sparkles size={14} />
              Discover Campus
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Explore
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Discover useful resources, notes, and projects
              shared by your campus community.
            </p>

          </div>

          <button
            type="button"
            onClick={() => fetchExploreData(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-400 shadow-lg backdrop-blur-md transition duration-300 hover:border-blue-400/30 hover:bg-white/10 hover:text-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 lg:self-auto"
          >
            <RefreshCw
              size={17}
              className={
                refreshing ? "animate-spin" : ""
              }
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>

        </div>

        {/* =========================
            SEARCH
        ========================== */}

        <div className="mt-7 max-w-5xl rounded-2xl border border-white/10 bg-white/5 p-3 shadow-xl backdrop-blur-xl sm:p-4">

          <div className="relative">

            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search resources, notes, projects..."
              className="w-full rounded-xl border border-white/10 bg-slate-950/50 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/50 focus:bg-white/5 focus:ring-2 focus:ring-blue-500/10"
            />

          </div>

          {!loading && (
            <div className="mt-3 flex items-center justify-between px-1">

              <p className="text-xs text-slate-600">
                {totalResults} result
                {totalResults !== 1 ? "s" : ""} found
              </p>

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="text-xs font-medium text-blue-400 transition hover:text-blue-300"
                >
                  Clear search
                </button>
              )}

            </div>
          )}

        </div>

        {/* =========================
            ERROR
        ========================== */}

        {error && (
          <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* =========================
            RESOURCES
        ========================== */}

        <section className="mt-9">

          <div className="mb-5 flex items-center justify-between gap-4">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <BookOpen size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-white">
                  Resources
                </h2>

                <p className="text-xs text-slate-600">
                  Study material and useful files
                </p>
              </div>

            </div>

            <Link
              to="/resources"
              className="flex items-center gap-1 text-sm font-medium text-blue-400 transition hover:text-blue-300"
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
            <EmptyState
              icon={BookOpen}
              message="No resources found."
            />
          )}

        </section>

        {/* =========================
            NOTES
        ========================== */}

        <section className="mt-10">

          <div className="mb-5 flex items-center justify-between gap-4">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <FileText size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-white">
                  Notes
                </h2>

                <p className="text-xs text-slate-600">
                  Notes shared by students
                </p>
              </div>

            </div>

            <Link
              to="/notes"
              className="flex items-center gap-1 text-sm font-medium text-blue-400 transition hover:text-blue-300"
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
            <EmptyState
              icon={FileText}
              message="No notes found."
            />
          )}

        </section>

        {/* =========================
            PROJECTS
        ========================== */}

        <section className="mt-10 pb-10">

          <div className="mb-5 flex items-center justify-between gap-4">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                <FolderKanban size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-white">
                  Projects
                </h2>

                <p className="text-xs text-slate-600">
                  Interesting projects from your campus
                </p>
              </div>

            </div>

            <Link
              to="/projects"
              className="flex items-center gap-1 text-sm font-medium text-blue-400 transition hover:text-blue-300"
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
            <EmptyState
              icon={FolderKanban}
              message="No projects found."
            />
          )}

        </section>

      </main>
    </div>
  );
}

export default Explore;