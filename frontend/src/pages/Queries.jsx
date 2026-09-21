import { useEffect, useMemo, useState } from "react";
import {
  HelpCircle,
  Plus,
  Search,
  CheckCircle2,
  RefreshCw,
  SlidersHorizontal,
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

  const statuses = [
    "All",
    "open",
    "resolved",
  ];

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

  return (
    <AppLayout>
      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">

        {/* HEADER */}

        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">
              Campus Help
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Queries
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Ask questions and help other students solve theirs.
            </p>
          </div>

          <Link
            to="/queries/add"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus size={18} />
            Ask a Query
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
                placeholder="Search queries..."
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
                  setCategoryFilter(e.target.value)
                }
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none focus:border-blue-500"
              >
                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category === "All"
                      ? "All Categories"
                      : category}
                  </option>
                ))}
              </select>
            </div>

            {/* STATUS */}

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
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
              onClick={fetchQueries}
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

          {/* CLEAR FILTERS */}

          {hasFilters && (
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">

              <p className="text-xs text-slate-400">
                Showing {filteredQueries.length} of{" "}
                {queries.length} queries
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
          <div className="mt-10 space-y-4">

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5"
              >
                <div className="flex gap-4">
                  <div className="h-11 w-11 rounded-xl bg-slate-100" />

                  <div className="flex-1">
                    <div className="h-5 w-1/3 rounded bg-slate-100" />

                    <div className="mt-3 h-4 w-full rounded bg-slate-100" />

                    <div className="mt-2 h-4 w-2/3 rounded bg-slate-100" />
                  </div>
                </div>
              </div>
            ))}

          </div>
        ) : filteredQueries.length === 0 ? (

          /* EMPTY */

          <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">

            <HelpCircle
              size={40}
              className="mx-auto text-slate-300"
            />

            <h2 className="mt-4 text-lg font-semibold text-slate-700">
              No queries found
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              {hasFilters
                ? "Try changing your search or filters."
                : "Be the first to ask something!"}
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
                to="/queries/add"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Plus size={16} />
                Ask a Query
              </Link>
            )}

          </div>

        ) : (

          /* QUERY LIST */

          <div className="mt-8 space-y-4">

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
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                >

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                    <div className="flex min-w-0 gap-4">

                      {/* ICON */}

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <HelpCircle size={21} />
                      </div>

                      {/* CONTENT */}

                      <div className="min-w-0">

                        <h2 className="text-lg font-bold text-slate-900">
                          {query.Title}
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          {query.Description}
                        </p>

                        {/* META */}

                        <div className="mt-3 flex flex-wrap items-center gap-2">

                          {query.Category && (
                            <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-600">
                              {query.Category}
                            </span>
                          )}

                          <span className="text-xs text-slate-400">
                            {query.createdAt
                              ? new Date(
                                  query.createdAt
                                ).toLocaleDateString()
                              : ""}
                          </span>

                        </div>

                        {/* OWNER */}

                        {query.Owner?.Name && (
                          <p className="mt-3 text-xs text-slate-400">
                            Asked by{" "}
                            <span className="font-medium text-slate-500">
                              {query.Owner.Name}
                            </span>
                          </p>
                        )}

                      </div>
                    </div>

                    {/* STATUS */}

                    <span
                      className={`shrink-0 self-start rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                        status === "open"
                          ? "bg-amber-50 text-amber-600"
                          : status === "resolved"
                          ? "bg-green-50 text-green-600"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {status}
                    </span>

                  </div>

                  {/* RESOLVE */}

                  {isOwner &&
                    status === "open" && (
                      <div className="mt-5 border-t border-slate-100 pt-4">

                        <button
                          type="button"
                          onClick={() =>
                            handleResolve(
                              query._id
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-100"
                        >
                          <CheckCircle2
                            size={16}
                          />
                          Mark as Resolved
                        </button>

                      </div>
                    )}

                </article>
              );
            })}

          </div>
        )}

      </main>
    </AppLayout>
  );
}

export default Queries;