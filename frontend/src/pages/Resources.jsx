import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  BookOpen,
  Laptop,
  FileText,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import api from "../api/axios";

function Resources() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("latest");

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categories = [
    "All",
    "Books",
    "Study Material",
    "Devices",
    "Other",
  ];

  const getIcon = (resource) => {
    const value = `${resource.Category || ""} ${
      resource.Title || ""
    }`.toLowerCase();

    if (value.includes("book")) return BookOpen;

    if (
      value.includes("device") ||
      value.includes("laptop") ||
      value.includes("arduino")
    ) {
      return Laptop;
    }

    return FileText;
  };

  const getFileUrl = (resource) => {
    const backendUrl =
      "https://campusconnect-backend-0ms4.onrender.com";

    const fileValue =
      resource.fileUrl ||
      resource.FileUrl ||
      resource.fileURL ||
      resource.FileURL ||
      resource.file ||
      resource.File ||
      resource.filePath ||
      resource.FilePath ||
      resource.path ||
      resource.Path ||
      resource.url ||
      resource.URL;

    if (!fileValue) {
      return null;
    }

    if (typeof fileValue === "object") {
      const nestedUrl =
        fileValue.url ||
        fileValue.URL ||
        fileValue.path ||
        fileValue.Path;

      if (!nestedUrl) {
        return null;
      }

      if (
        nestedUrl.startsWith("http://") ||
        nestedUrl.startsWith("https://")
      ) {
        return nestedUrl;
      }

      return `${backendUrl}/${nestedUrl.replace(/^\/+/, "")}`;
    }

    if (
      fileValue.startsWith("http://") ||
      fileValue.startsWith("https://")
    ) {
      return fileValue;
    }

    return `${backendUrl}/${fileValue.replace(/^\/+/, "")}`;
  };

  const handleViewResource = (resource) => {
    const fileUrl = getFileUrl(resource);

    if (!fileUrl) {
      alert("File is not available for this resource.");
      return;
    }

    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };

  const fetchResources = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/resources");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.resources || [];

      setResources(data);

      console.log("RESOURCE DATA:", data);
    } catch (err) {
      console.error("RESOURCE FETCH ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load resources right now."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const filteredResources = useMemo(() => {
    let filtered = resources.filter((resource) => {
      const title = resource.Title || "";
      const description = resource.Description || "";
      const resourceCategory = resource.Category || "";

      const searchValue = search.toLowerCase();

      const matchesSearch =
        title.toLowerCase().includes(searchValue) ||
        description.toLowerCase().includes(searchValue);

      const matchesCategory =
        category === "All" || resourceCategory === category;

      return matchesSearch && matchesCategory;
    });

    filtered.sort((a, b) => {
      if (sort === "latest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }

      return new Date(a.createdAt) - new Date(b.createdAt);
    });

    return filtered;
  }, [resources, search, category, sort]);

  return (
    <AppLayout>
      <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">

        {/* BACKGROUND GLOW */}

        <div className="pointer-events-none absolute left-1/2 top-[-180px] h-[500px] w-[750px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[130px]" />

        <div className="pointer-events-none absolute right-[-180px] top-[450px] h-[420px] w-[420px] rounded-full bg-purple-600/10 blur-[130px]" />

        <div className="pointer-events-none absolute bottom-[-180px] left-[-120px] h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[120px]" />

        <main className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

          {/* HEADER */}

          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">

            <div>

              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-300">
                <Sparkles size={14} />
                Campus Resources
              </div>

              <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Resources
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Discover books, study material, devices and useful
                resources shared by your campus community.
              </p>

            </div>

            <Link
              to="/resources/add"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition duration-300 hover:-translate-y-0.5 hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-500/20 active:scale-[0.98]"
            >
              <Plus size={18} />
              Add Resource
            </Link>

          </div>

          {/* SEARCH + FILTER */}

          <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur-xl">

            <div className="grid gap-3 lg:grid-cols-3">

              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 transition focus-within:border-blue-500/40 focus-within:bg-white/5">

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
                  placeholder="Search resources..."
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                />

              </div>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                className="rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-slate-300 outline-none transition focus:border-blue-500/40"
              >
                {categories.map((item) => (
                  <option
                    key={item}
                    value={item}
                    className="bg-slate-900"
                  >
                    {item}
                  </option>
                ))}
              </select>

              <select
                value={sort}
                onChange={(e) =>
                  setSort(e.target.value)
                }
                className="rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-slate-300 outline-none transition focus:border-blue-500/40"
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

            <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">

              <p className="text-xs text-slate-600 sm:text-sm">
                {filteredResources.length} resource
                {filteredResources.length !== 1
                  ? "s"
                  : ""}{" "}
                found
              </p>

              <button
                type="button"
                onClick={fetchResources}
                disabled={loading}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-blue-400 transition hover:bg-blue-500/10 hover:text-blue-300 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
              >
                <RefreshCw
                  size={15}
                  className={
                    loading ? "animate-spin" : ""
                  }
                />

                Refresh
              </button>

            </div>

          </section>

          {/* LOADING */}

          {loading && (
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="animate-pulse rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
                >
                  <div className="h-12 w-12 rounded-xl bg-white/10" />

                  <div className="mt-5 h-5 w-3/4 rounded bg-white/10" />

                  <div className="mt-3 h-4 w-full rounded bg-white/5" />

                  <div className="mt-2 h-4 w-2/3 rounded bg-white/5" />

                  <div className="mt-6 h-px bg-white/5" />

                  <div className="mt-4 h-4 w-1/2 rounded bg-white/5" />
                </div>
              ))}

            </div>
          )}

          {/* ERROR */}

          {!loading && error && (
            <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/10 px-6 py-12 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
                <RefreshCw size={25} />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-red-300">
                Unable to load resources
              </h3>

              <p className="mt-2 text-sm text-red-400">
                {error}
              </p>

              <button
                type="button"
                onClick={fetchResources}
                className="mt-6 rounded-xl bg-red-500/15 px-4 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-500/25"
              >
                Try Again
              </button>

            </div>
          )}

          {/* RESOURCE CARDS */}

          {!loading &&
            !error &&
            filteredResources.length > 0 && (
              <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                {filteredResources.map((resource) => {
                  const Icon = getIcon(resource);
                  const fileUrl = getFileUrl(resource);

                  return (
                    <div
                      key={resource._id}
                      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-blue-400/20 hover:bg-white/[0.08] hover:shadow-2xl"
                    >

                      {/* CARD GLOW */}

                      <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl opacity-0 transition duration-300 group-hover:opacity-100" />

                      <div className="relative">

                        <div className="flex items-start justify-between gap-4">

                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 transition duration-300 group-hover:scale-110 group-hover:bg-blue-500/15">
                            <Icon size={22} />
                          </div>

                          <span className="rounded-full border border-emerald-400/10 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                            {resource.Type || "Share"}
                          </span>

                        </div>

                        <h3 className="mt-5 line-clamp-2 text-lg font-semibold text-slate-100 transition group-hover:text-blue-400">
                          {resource.Title ||
                            "Untitled Resource"}
                        </h3>

                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                          {resource.Description ||
                            "No description available."}
                        </p>

                        <div className="mt-4">

                          <span className="inline-flex rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-400">
                            {resource.Category ||
                              "Other"}
                          </span>

                        </div>

                        <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">

                          <div className="min-w-0">

                            <p className="text-xs text-slate-600">
                              Shared by
                            </p>

                            <p className="mt-1 max-w-[150px] truncate text-sm font-medium text-slate-300">
                              {resource.Owner?.Name ||
                                "Campus Student"}
                            </p>

                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              handleViewResource(
                                resource
                              )
                            }
                            disabled={!fileUrl}
                            className={`flex shrink-0 items-center gap-1.5 text-sm font-semibold transition ${
                              fileUrl
                                ? "text-blue-400 hover:text-blue-300"
                                : "cursor-not-allowed text-slate-600"
                            }`}
                          >
                            {fileUrl
                              ? "View"
                              : "No File"}

                            {fileUrl ? (
                              <ArrowRight
                                size={15}
                                className="transition group-hover:translate-x-1"
                              />
                            ) : (
                              <ExternalLink
                                size={15}
                              />
                            )}
                          </button>

                        </div>

                      </div>

                    </div>
                  );
                })}

              </div>
            )}

          {/* EMPTY */}

          {!loading &&
            !error &&
            filteredResources.length === 0 && (
              <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-6 py-16 text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-slate-600">
                  <BookOpen size={32} />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-slate-200">
                  No resources found
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                  There are no approved resources matching
                  your search or selected category.
                </p>

                <Link
                  to="/resources/add"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
                >
                  <Plus size={16} />
                  Add Resource
                </Link>

              </div>
            )}

        </main>
      </div>
    </AppLayout>
  );
}

export default Resources;