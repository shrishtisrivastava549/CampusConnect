import { useEffect, useMemo, useState } from "react";
import {
  Lightbulb,
  Plus,
  Search,
  RefreshCw,
  SlidersHorizontal,
  Sparkles,
  UserRound,
  CalendarDays,
} from "lucide-react";
import { Link } from "react-router-dom";

import AppLayout from "../components/AppLayout";
import api from "../api/axios";

function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sort, setSort] = useState("latest");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categories = [
    "All",
    "resource",
    "notes",
    "project",
    "academic",
    "general",
  ];

  const statuses = ["All", "reviewed", "resolved"];

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/recommendations"
      );

      const data = response.data;

      setRecommendations(
        Array.isArray(data)
          ? data
          : data.recommendations || []
      );
    } catch (err) {
      console.error(
        "GET RECOMMENDATIONS ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load recommendations. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const filteredRecommendations = useMemo(() => {
    const query = search.trim().toLowerCase();

    let filtered = recommendations.filter(
      (recommendation) => {
        const title =
          recommendation.Title || "";

        const description =
          recommendation.Description || "";

        const category =
          recommendation.Category || "";

        const status =
          recommendation.Status || "";

        const ownerName =
          recommendation.Owner?.Name || "";

        const matchesSearch =
          !query ||
          title.toLowerCase().includes(query) ||
          description.toLowerCase().includes(query) ||
          category.toLowerCase().includes(query) ||
          ownerName.toLowerCase().includes(query);

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
      }
    );

    filtered.sort((a, b) => {
      const dateA = new Date(
        a.createdAt || 0
      );

      const dateB = new Date(
        b.createdAt || 0
      );

      if (sort === "latest") {
        return dateB - dateA;
      }

      return dateA - dateB;
    });

    return filtered;
  }, [
    recommendations,
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

  const reviewedCount = recommendations.filter(
    (item) =>
      (item.Status || "reviewed") === "reviewed"
  ).length;

  const resolvedCount = recommendations.filter(
    (item) => item.Status === "resolved"
  ).length;

  return (
    <AppLayout>
      <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-6 sm:px-6 lg:px-8">
        {/* BACKGROUND GLOW */}

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute right-0 top-32 h-96 w-96 rounded-full bg-violet-600/15 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          {/* HERO */}

          <section className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-600/20 via-slate-900/80 to-violet-600/20 p-6 shadow-2xl shadow-blue-950/30 backdrop-blur-xl sm:p-8">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-300">
                  <Sparkles size={14} />
                  Campus Recommendations
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Recommendations
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                  Discover useful resources, notes,
                  projects, and ideas shared by your
                  campus community.
                </p>
              </div>

              <Link
                to="/recommendations/add"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:shadow-blue-500/30"
              >
                <Plus size={18} />
                Add Recommendation
              </Link>
            </div>

            {/* STATS */}

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-xs font-medium text-slate-500">
                  Total
                </p>
                <p className="mt-1 text-2xl font-bold text-white">
                  {recommendations.length}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-xs font-medium text-slate-500">
                  Reviewed
                </p>
                <p className="mt-1 text-2xl font-bold text-blue-300">
                  {reviewedCount}
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
                  placeholder="Search recommendations..."
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 pl-11 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-blue-500/50 focus:bg-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:flex">
                <div className="relative">
                  <SlidersHorizontal
                    size={15}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <select
                    value={categoryFilter}
                    onChange={(e) =>
                      setCategoryFilter(
                        e.target.value
                      )
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

              <button
                type="button"
                onClick={fetchRecommendations}
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
                    {filteredRecommendations.length}
                  </span>{" "}
                  of {recommendations.length}{" "}
                  recommendations
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="self-start text-sm font-semibold text-blue-400 hover:text-blue-300"
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
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map(
                (item) => (
                  <div
                    key={item}
                    className="animate-pulse rounded-3xl border border-white/10 bg-white/[0.04] p-5"
                  >
                    <div className="flex items-start justify-between">
                      <div className="h-12 w-12 rounded-2xl bg-white/10" />
                      <div className="h-6 w-20 rounded-full bg-white/10" />
                    </div>

                    <div className="mt-5 h-5 w-3/4 rounded bg-white/10" />
                    <div className="mt-3 h-4 w-full rounded bg-white/10" />
                    <div className="mt-2 h-4 w-5/6 rounded bg-white/10" />
                    <div className="mt-5 h-6 w-20 rounded-lg bg-white/10" />
                  </div>
                )
              )}
            </div>
          ) : filteredRecommendations.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-12 text-center backdrop-blur-xl">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                <Lightbulb size={34} />
              </div>

              <h2 className="mt-5 text-xl font-bold text-white">
                No recommendations found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                {hasFilters
                  ? "Try changing your search or filters."
                  : "Be the first to share something useful."}
              </p>

              {hasFilters ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/10"
                >
                  Clear Filters
                </button>
              ) : (
                <Link
                  to="/recommendations/add"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white"
                >
                  <Plus size={16} />
                  Add Recommendation
                </Link>
              )}
            </div>
          ) : (
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredRecommendations.map(
                (recommendation) => {
                  const status =
                    recommendation.Status ||
                    "reviewed";

                  return (
                    <article
                      key={recommendation._id}
                      className="group rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-xl backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-blue-500/20 hover:bg-white/[0.06] hover:shadow-blue-950/20"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/10 bg-blue-500/10 text-blue-400 transition group-hover:scale-105">
                          <Lightbulb size={22} />
                        </div>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                            status === "resolved"
                              ? "bg-emerald-400/10 text-emerald-300"
                              : "bg-blue-400/10 text-blue-300"
                          }`}
                        >
                          {status}
                        </span>
                      </div>

                      <h2 className="mt-5 line-clamp-2 text-lg font-bold text-white">
                        {recommendation.Title}
                      </h2>

                      <p className="mt-2 line-clamp-4 text-sm leading-6 text-slate-400">
                        {recommendation.Description}
                      </p>

                      {recommendation.Category && (
                        <div className="mt-5">
                          <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium capitalize text-slate-300">
                            {recommendation.Category}
                          </span>
                        </div>
                      )}

                      <div className="mt-5 space-y-2 border-t border-white/10 pt-4">
                        {recommendation.Owner?.Name && (
                          <p className="flex items-center gap-2 text-xs text-slate-500">
                            <UserRound size={13} />
                            Shared by{" "}
                            <span className="font-medium text-slate-400">
                              {recommendation.Owner.Name}
                            </span>
                          </p>
                        )}

                        {recommendation.createdAt && (
                          <p className="flex items-center gap-2 text-xs text-slate-600">
                            <CalendarDays size={13} />
                            {new Date(
                              recommendation.createdAt
                            ).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          )}
        </div>
      </main>
    </AppLayout>
  );
}

export default Recommendations;