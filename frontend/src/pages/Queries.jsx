import { useEffect, useMemo, useState } from "react";
import {
  HelpCircle,
  Plus,
  Search,
  CheckCircle2,
  RefreshCw,
  SlidersHorizontal,
  Sparkles,
  Clock3,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";

import AppLayout from "../components/AppLayout";
import api from "../api/axios";

function Queries() {
  const [queries, setQueries] = useState([]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sort, setSort] = useState("latest");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(
    localStorage.getItem("campusconnect_user") || "{}"
  );

  const token = localStorage.getItem("campusconnect_token");

  const categories = [
    "All",
    "resource",
    "notes",
    "project",
    "academic",
    "general",
  ];

  const statuses = ["All", "open", "resolved"];

  const fetchQueries = async () => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        setError("Login required. Please login again.");
        return;
      }

      const response = await api.get("/queries", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setQueries(response.data.queries || []);
    } catch (err) {
      console.error("GET QUERIES ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load queries. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  const handleResolve = async (queryId) => {
    try {
      await api.put(
        `/queries/${queryId}/resolve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setQueries((current) =>
        current.map((query) =>
          query._id === queryId
            ? {
                ...query,
                Status: "resolved",
              }
            : query
        )
      );
    } catch (err) {
      console.error("RESOLVE QUERY ERROR:", err);

      alert(
        err.response?.data?.message ||
          "Unable to resolve query."
      );
    }
  };

  const filteredQueries = useMemo(() => {
    const queryText = search.trim().toLowerCase();

    let filtered = queries.filter((query) => {
      const title = query.Title || "";
      const description = query.Description || "";
      const category = query.Category || "";
      const status = query.Status || "open";
      const ownerName = query.Owner?.Name || "";

      const matchesSearch =
        !queryText ||
        title.toLowerCase().includes(queryText) ||
        description.toLowerCase().includes(queryText) ||
        category.toLowerCase().includes(queryText) ||
        ownerName.toLowerCase().includes(queryText);

      const matchesCategory =
        categoryFilter === "All" ||
        category === categoryFilter;

      const matchesStatus =
        statusFilter === "All" ||
        status === statusFilter;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
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
    queries,
    search,
    categoryFilter,
    statusFilter,
    sort,
  ]);

  const clearFilters = () => {
    setSearch("");
    setCategoryFilter("All");
    setStatusFilter("All");
    setSort("latest");
  };

  const hasFilters =
    search.trim() ||
    categoryFilter !== "All" ||
    statusFilter !== "All";

  const currentUserId =
    user._id ||
    user.id ||
    user.Id;

  const openCount = queries.filter(
    (query) => (query.Status || "open") === "open"
  ).length;

  const resolvedCount = queries.filter(
    (query) => query.Status === "resolved"
  ).length;

  return (
    <AppLayout>
      <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-6 sm:px-6 lg:px-8">
        {/* BACKGROUND GLOW */}

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-violet-600/15 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          {/* HERO */}

          <section className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-600/20 via-slate-900/80 to-violet-600/20 p-6 shadow-2xl shadow-blue-950/30 backdrop-blur-xl sm:p-8">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-300">
                  <Sparkles size={14} />
                  Campus Help Center
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Queries
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                  Ask questions, share knowledge, and help
                  other students solve their campus problems.
                </p>
              </div>

              <Link
                to="/queries/add"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:shadow-blue-500/30"
              >
                <Plus size={18} />
                Ask a Query
              </Link>
            </div>

            {/* MINI STATS */}

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-xs font-medium text-slate-500">
                  Total Queries
                </p>
                <p className="mt-1 text-2xl font-bold text-white">
                  {queries.length}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-xs font-medium text-slate-500">
                  Open
                </p>
                <p className="mt-1 text-2xl font-bold text-amber-300">
                  {openCount}
                </p>
              </div>

              <div className="col-span-2 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur sm:col-span-1">
                <p className="text-xs font-medium text-slate-500">
                  Resolved
                </p>
                <p className="mt-1 text-2xl font-bold text-emerald-300">
                  {resolvedCount}
                </p>
              </div>
            </div>
          </section>

          {/* SEARCH + FILTERS */}

          <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-xl backdrop-blur-xl sm:p-5">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
              {/* SEARCH */}

              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search queries, topics or students..."
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 pl-11 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-blue-500/50 focus:bg-slate-900"
                />
              </div>

              {/* FILTERS */}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:flex">
                <div className="relative">
                  <SlidersHorizontal
                    size={15}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <select
                    value={categoryFilter}
                    onChange={(e) =>
                      setCategoryFilter(e.target.value)
                    }
                    className="w-full appearance-none rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 pl-9 text-sm capitalize text-slate-300 outline-none focus:border-blue-500/50"
                  >
                    {categories.map((category) => (
                      <option
                        key={category}
                        value={category}
                        className="bg-slate-900"
                      >
                        {category === "All"
                          ? "All Categories"
                          : category}
                      </option>
                    ))}
                  </select>
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value)
                  }
                  className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm capitalize text-slate-300 outline-none focus:border-blue-500/50"
                >
                  {statuses.map((status) => (
                    <option
                      key={status}
                      value={status}
                      className="bg-slate-900"
                    >
                      {status === "All"
                        ? "All Status"
                        : status}
                    </option>
                  ))}
                </select>

                <select
                  value={sort}
                  onChange={(e) =>
                    setSort(e.target.value)
                  }
                  className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-300 outline-none focus:border-blue-500/50"
                >
                  <option
                    value="latest"
                    className="bg-slate-900"
                  >
                    Latest
                  </option>

                  <option
                    value="oldest"
                    className="bg-slate-900"
                  >
                    Oldest
                  </option>
                </select>
              </div>

              {/* REFRESH */}

              <button
                type="button"
                onClick={fetchQueries}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  size={17}
                  className={
                    loading ? "animate-spin" : ""
                  }
                />
                Refresh
              </button>
            </div>

            {hasFilters && (
              <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-slate-500">
                  Showing{" "}
                  <span className="font-semibold text-slate-300">
                    {filteredQueries.length}
                  </span>{" "}
                  of {queries.length} queries
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="self-start text-sm font-semibold text-blue-400 transition hover:text-blue-300"
                >
                  Clear filters
                </button>
              </div>
            )}
          </section>

          {/* ERROR */}

          {error && (
            <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* LOADING */}

          {loading ? (
            <div className="mt-6 space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="animate-pulse rounded-3xl border border-white/10 bg-white/[0.04] p-5"
                >
                  <div className="flex gap-4">
                    <div className="h-12 w-12 shrink-0 rounded-2xl bg-white/10" />

                    <div className="flex-1">
                      <div className="h-5 w-1/3 rounded bg-white/10" />
                      <div className="mt-3 h-4 w-full rounded bg-white/10" />
                      <div className="mt-2 h-4 w-2/3 rounded bg-white/10" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredQueries.length === 0 ? (
            /* EMPTY */

            <div className="mt-6 rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-12 text-center backdrop-blur-xl">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                <HelpCircle size={34} />
              </div>

              <h2 className="mt-5 text-xl font-bold text-white">
                No queries found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                {hasFilters
                  ? "Try changing your search or filters."
                  : "Be the first student to ask something!"}
              </p>

              {hasFilters ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/10"
                >
                  Clear Filters
                </button>
              ) : (
                <Link
                  to="/queries/add"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white"
                >
                  <Plus size={16} />
                  Ask a Query
                </Link>
              )}
            </div>
          ) : (
            /* QUERY LIST */

            <div className="mt-6 space-y-4">
              {filteredQueries.map((query) => {
                const ownerId =
                  query.Owner?._id ||
                  query.Owner;

                const isOwner =
                  ownerId &&
                  currentUserId &&
                  String(ownerId) ===
                    String(currentUserId);

                const status =
                  query.Status || "open";

                return (
                  <article
                    key={query._id}
                    className="group rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-xl backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-blue-500/20 hover:bg-white/[0.06] hover:shadow-blue-950/20 sm:p-6"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex min-w-0 gap-4">
                        {/* ICON */}

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-blue-400/10 bg-blue-500/10 text-blue-400 transition group-hover:scale-105">
                          <HelpCircle size={22} />
                        </div>

                        {/* CONTENT */}

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-lg font-bold text-white">
                              {query.Title}
                            </h2>

                            <span
                              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${
                                status === "open"
                                  ? "bg-amber-400/10 text-amber-300"
                                  : status === "resolved"
                                  ? "bg-emerald-400/10 text-emerald-300"
                                  : "bg-white/10 text-slate-400"
                              }`}
                            >
                              {status}
                            </span>
                          </div>

                          <p className="mt-2 text-sm leading-6 text-slate-400">
                            {query.Description}
                          </p>

                          {/* META */}

                          <div className="mt-4 flex flex-wrap items-center gap-2">
                            {query.Category && (
                              <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium capitalize text-slate-300">
                                {query.Category}
                              </span>
                            )}

                            {query.createdAt && (
                              <span className="inline-flex items-center gap-1.5 text-xs text-slate-600">
                                <Clock3 size={13} />
                                {new Date(
                                  query.createdAt
                                ).toLocaleDateString()}
                              </span>
                            )}
                          </div>

                          {/* OWNER */}

                          {query.Owner?.Name && (
                            <div className="mt-4 inline-flex items-center gap-2 text-xs text-slate-500">
                              <UserRound size={14} />
                              Asked by{" "}
                              <span className="font-medium text-slate-400">
                                {query.Owner.Name}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* RESOLVE */}

                    {isOwner &&
                      status === "open" && (
                        <div className="mt-5 border-t border-white/10 pt-4">
                          <button
                            type="button"
                            onClick={() =>
                              handleResolve(query._id)
                            }
                            className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2.5 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-400/15 hover:shadow-lg hover:shadow-emerald-950/20"
                          >
                            <CheckCircle2 size={16} />
                            Mark as Resolved
                          </button>
                        </div>
                      )}
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

export default Queries;