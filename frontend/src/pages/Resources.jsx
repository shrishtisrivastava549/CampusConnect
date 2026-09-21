import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  BookOpen,
  Laptop,
  FileText,
  ArrowRight,
  RefreshCw,
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
    const value = `${resource.Category || ""} ${resource.Title || ""}`.toLowerCase();

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

  const fetchResources = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/resources");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.resources || [];

      setResources(data);
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
      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">

        {/* HEADER */}

        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-blue-600">
              Campus Marketplace
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Resources
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Discover books, study material, devices and useful resources shared by your campus community.
            </p>
          </div>

          <Link
            to="/resources/add"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Resource
          </Link>
        </div>

        {/* SEARCH + FILTER */}

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-3">

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
              <Search size={19} className="text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search resources..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
            </select>

          </div>

          <div className="mt-3 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              {filteredResources.length} resource
              {filteredResources.length !== 1 ? "s" : ""} found
            </p>

            <button
              onClick={fetchResources}
              className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              <RefreshCw size={15} />
              Refresh
            </button>
          </div>
        </section>

        {/* LOADING */}

        {loading && (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
            <RefreshCw
              size={30}
              className="mx-auto animate-spin text-blue-600"
            />

            <p className="mt-4 text-sm text-slate-500">
              Loading campus resources...
            </p>
          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center">
            <h3 className="text-lg font-semibold text-red-700">
              Unable to load resources
            </h3>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>

            <button
              onClick={fetchResources}
              className="mt-5 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* RESOURCE CARDS */}

        {!loading && !error && filteredResources.length > 0 && (
          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            {filteredResources.map((resource) => {
              const Icon = getIcon(resource);

              return (
                <div
                  key={resource._id}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Icon size={22} />
                    </div>

                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
                      {resource.Type || "Share"}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-slate-900">
                    {resource.Title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {resource.Description || "No description available."}
                  </p>

                  <div className="mt-4">
                    <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                      {resource.Category || "Other"}
                    </span>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    <div>
                      <p className="text-xs text-slate-400">
                        Shared by
                      </p>

                      <p className="mt-1 text-sm font-medium text-slate-700">
                        {resource.Owner?.Name || "Campus Student"}
                      </p>
                    </div>

                    <button className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700">
                      View
                      <ArrowRight
                        size={15}
                        className="transition group-hover:translate-x-1"
                      />
                    </button>
                  </div>
                </div>
              );
            })}

          </div>
        )}

        {/* EMPTY */}

        {!loading && !error && filteredResources.length === 0 && (
          <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <BookOpen size={35} className="mx-auto text-slate-300" />

            <h3 className="mt-4 text-lg font-semibold text-slate-800">
              No resources found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              There are no approved resources matching your search.
            </p>

            <Link
              to="/resources/add"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <Plus size={16} />
              Add Resource
            </Link>
          </div>
        )}

      </main>
    </AppLayout>
  );
}

export default Resources;