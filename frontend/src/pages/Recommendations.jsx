import { useEffect, useMemo, useState } from "react";
import {
  Lightbulb,
  Plus,
  Search,
  RefreshCw,
  SlidersHorizontal,
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

  const statuses = [
    "All",
    "reviewed",
    "resolved",
  ];

  // =========================
  // FETCH RECOMMENDATIONS
  // =========================

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

  // =========================
  // FILTER + SORT
  // =========================

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
          description
            .toLowerCase()
            .includes(query) ||
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

  // =========================
  // CLEAR FILTERS
  // =========================

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

  return (
    <AppLayout>
      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">

        {/* HEADER */}

        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <p className="text-sm font-medium text-blue-600">
              Campus Recommendations
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Recommendations
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Discover useful resources, notes, projects,
              and ideas shared by your campus community.
            </p>
          </div>

          <Link
            to="/recommendations/add"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Recommendation
          </Link>

        </div>

        {/* SEARCH + FILTERS */}

        <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">

            {/* SEARCH */}

            <div className="relative flex-1">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search recommendations..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pl-11 text-sm outline-none focus:border-blue-500 focus:bg-white"
              />

            </div>

            {/* CATEGORY */}

            <div className="flex items-center gap-2">

              <SlidersHorizontal
                size={17}
                className="text-slate-400"
              />

              <select
                value={categoryFilter}
                onChange={(e) =>
                  setCategoryFilter(
                    e.target.value
                  )
                }
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none focus:border-blue-500"
              >

                {categories.map(
                  (category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category === "All"
                        ? "All Categories"
                        : category}
                    </option>
                  )
                )}

              </select>

            </div>

            {/* STATUS */}

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none focus:border-blue-500"
            >

              {statuses.map((status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status === "All"
                    ? "All Status"
                    : status}
                </option>
              ))}

            </select>

            {/* SORT */}

            <select
              value={sort}
              onChange={(e) =>
                setSort(e.target.value)
              }
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none focus:border-blue-500"
            >

              <option value="latest">
                Latest
              </option>

              <option value="oldest">
                Oldest
              </option>

            </select>

            {/* REFRESH */}

            <button
              type="button"
              onClick={fetchRecommendations}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >

              <RefreshCw
                size={17}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh

            </button>

          </div>

          {/* FILTER INFO */}

          {hasFilters && (
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">

              <p className="text-xs text-slate-400">
                Showing{" "}
                {filteredRecommendations.length}{" "}
                of{" "}
                {recommendations.length}{" "}
                recommendations
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Clear filters
              </button>

            </div>
          )}

        </div>

        {/* ERROR */}

        {error && (
          <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* LOADING */}

        {loading ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            {[1, 2, 3, 4, 5, 6].map(
              (item) => (
                <div
                  key={item}
                  className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5"
                >

                  <div className="flex items-start justify-between">

                    <div className="h-11 w-11 rounded-xl bg-slate-100" />

                    <div className="h-6 w-20 rounded-full bg-slate-100" />

                  </div>

                  <div className="mt-5 h-5 w-3/4 rounded bg-slate-100" />

                  <div className="mt-3 h-4 w-full rounded bg-slate-100" />

                  <div className="mt-2 h-4 w-5/6 rounded bg-slate-100" />

                  <div className="mt-4 h-6 w-20 rounded-lg bg-slate-100" />

                </div>
              )
            )}

          </div>
        ) : filteredRecommendations.length === 0 ? (

          /* EMPTY STATE */

          <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">

            <Lightbulb
              size={40}
              className="mx-auto text-slate-300"
            />

            <h2 className="mt-4 text-lg font-semibold text-slate-700">
              No recommendations found
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              {hasFilters
                ? "Try changing your search or filters."
                : "Be the first to share something useful."}
            </p>

            {hasFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Clear Filters
              </button>
            ) : (
              <Link
                to="/recommendations/add"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Plus size={16} />
                Add Recommendation
              </Link>
            )}

          </div>

        ) : (

          /* RECOMMENDATIONS */

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            {filteredRecommendations.map(
              (recommendation) => {

                const status =
                  recommendation.Status ||
                  "reviewed";

                return (
                  <article
                    key={recommendation._id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >

                    {/* TOP */}

                    <div className="flex items-start justify-between gap-4">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <Lightbulb size={21} />
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                          status ===
                          "resolved"
                            ? "bg-green-50 text-green-600"
                            : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        {status}
                      </span>

                    </div>

                    {/* TITLE */}

                    <h2 className="mt-5 text-lg font-bold text-slate-900">
                      {recommendation.Title}
                    </h2>

                    {/* DESCRIPTION */}

                    <p className="mt-2 line-clamp-4 text-sm leading-6 text-slate-500">
                      {recommendation.Description}
                    </p>

                    {/* CATEGORY */}

                    {recommendation.Category && (
                      <div className="mt-4">

                        <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-600">
                          {recommendation.Category}
                        </span>

                      </div>
                    )}

                    {/* OWNER */}

                    {recommendation.Owner?.Name && (
                      <p className="mt-4 text-xs text-slate-400">
                        Shared by{" "}
                        <span className="font-medium text-slate-500">
                          {recommendation.Owner.Name}
                        </span>
                      </p>
                    )}

                    {/* DATE */}

                    {recommendation.createdAt && (
                      <p className="mt-2 text-xs text-slate-400">
                        {new Date(
                          recommendation.createdAt
                        ).toLocaleDateString()}
                      </p>
                    )}

                  </article>
                );
              }
            )}

          </div>
        )}

      </main>
    </AppLayout>
  );
}

export default Recommendations;