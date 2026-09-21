import { useEffect, useState } from "react";
import {
  BookOpen,
  FolderKanban,
  HelpCircle,
  Search,
  Upload,
  Users,
  Bell,
  ArrowRight,
  Lightbulb,
  RefreshCw,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";

import AppLayout from "../components/AppLayout";
import api from "../api/axios";

function Dashboard() {
  const user = JSON.parse(
    localStorage.getItem("campusconnect_user") || "{}"
  );

  const firstName =
    user.Name?.split(" ")[0] ||
    user.name?.split(" ")[0] ||
    "Student";

  const token = localStorage.getItem(
    "campusconnect_token"
  );

  const [stats, setStats] = useState({
    resources: 0,
    notes: 0,
    projects: 0,
    queries: 0,
    recommendations: 0,
  });

  const [loadingStats, setLoadingStats] =
    useState(true);

  const [statsError, setStatsError] =
    useState("");


  // =========================
  // FETCH DASHBOARD STATS
  // =========================

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      setStatsError("");

      if (!token) {
        setStatsError(
          "Login required. Please login again."
        );

        setLoadingStats(false);
        return;
      }

      const authConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [
        resourcesResponse,
        notesResponse,
        projectsResponse,
        queriesResponse,
        recommendationsResponse,
      ] = await Promise.all([
        api.get("/resources"),
        api.get("/notes"),
        api.get("/projects"),
        api.get(
          "/queries",
          authConfig
        ),
        api.get(
          "/recommendations"
        ),
      ]);

      const resourcesData =
        resourcesResponse.data;

      const notesData =
        notesResponse.data;

      const projectsData =
        projectsResponse.data;

      const queriesData =
        queriesResponse.data;

      const recommendationsData =
        recommendationsResponse.data;

      const resources =
        Array.isArray(resourcesData)
          ? resourcesData
          : resourcesData.resources || [];

      const notes =
        Array.isArray(notesData)
          ? notesData
          : notesData.notes || [];

      const projects =
        Array.isArray(projectsData)
          ? projectsData
          : projectsData.projects || [];

      const queries =
        queriesData.queries || [];

      const recommendations =
        Array.isArray(
          recommendationsData
        )
          ? recommendationsData
          : recommendationsData.recommendations ||
            [];

      const openQueries =
        queries.filter(
          (query) =>
            query.Status === "open"
        );

      setStats({
        resources: resources.length,
        notes: notes.length,
        projects: projects.length,
        queries: openQueries.length,
        recommendations:
          recommendations.length,
      });
    } catch (err) {
      console.error(
        "GET DASHBOARD STATS ERROR:",
        err
      );

      setStatsError(
        err.response?.data?.message ||
          "Unable to load dashboard statistics."
      );
    } finally {
      setLoadingStats(false);
    }
  };


  useEffect(() => {
    fetchStats();
  }, []);


  // =========================
  // QUICK ACTIONS
  // =========================

  const quickActions = [
    {
      title: "Explore Resources",
      description:
        "Find books, notes, study material and more.",
      icon: BookOpen,
      link: "/resources",
    },
    {
      title: "Browse Projects",
      description:
        "Discover project ideas shared by students.",
      icon: FolderKanban,
      link: "/projects",
    },
    {
      title: "Ask a Question",
      description:
        "Get help from your campus community.",
      icon: HelpCircle,
      link: "/queries",
    },
    {
      title: "Share Something",
      description:
        "Upload a resource or share your knowledge.",
      icon: Upload,
      link: "/resources",
    },
  ];


  // =========================
  // STATS
  // =========================

  const statCards = [
    {
      title: "Resources",
      value: stats.resources,
      icon: BookOpen,
      link: "/resources",
      description: "Study materials",
    },
    {
      title: "Notes",
      value: stats.notes,
      icon: FileText,
      link: "/notes",
      description: "Shared notes",
    },
    {
      title: "Projects",
      value: stats.projects,
      icon: FolderKanban,
      link: "/projects",
      description: "Student projects",
    },
    {
      title: "Open Queries",
      value: stats.queries,
      icon: HelpCircle,
      link: "/queries",
      description: "Questions needing help",
    },
    {
      title: "Recommendations",
      value: stats.recommendations,
      icon: Lightbulb,
      link: "/recommendations",
      description: "Community ideas",
    },
  ];


  return (
    <AppLayout>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

        {/* =========================
            TOP BAR
        ========================== */}

        <div className="flex items-start justify-between gap-4">

          <div className="min-w-0">
            <p className="text-sm font-medium text-blue-600">
              Welcome back 👋
            </p>

            <h1 className="mt-1 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
              Hey {firstName}, ready to learn?
            </h1>
          </div>

          <Link
            to="/notifications"
            aria-label="Open notifications"
            className="relative shrink-0 rounded-full p-2.5 text-slate-500 transition hover:bg-white hover:text-blue-600 active:scale-95 sm:p-3"
          >
            <Bell size={21} />

            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-blue-600 sm:right-2 sm:top-2" />
          </Link>

        </div>


        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
          Discover useful resources, connect with your campus community,
          and share what you know.
        </p>


        {/* =========================
            SEARCH
        ========================== */}

        <Link
          to="/resources"
          className="mt-6 flex w-full max-w-4xl items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm transition hover:border-blue-200 hover:shadow-md active:scale-[0.995] sm:mt-8 sm:px-5 sm:py-4"
        >
          <Search
            size={21}
            className="shrink-0 text-slate-400"
          />

          <span className="truncate text-sm text-slate-400 sm:text-base">
            Search resources, notes, projects, questions...
          </span>
        </Link>


        {/* =========================
            DASHBOARD STATS
        ========================== */}

        <section className="mt-8 sm:mt-10">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Campus Overview
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                See what is happening across CampusConnect.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchStats}
              disabled={loadingStats}
              className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
            >
              <RefreshCw
                size={16}
                className={
                  loadingStats
                    ? "animate-spin"
                    : ""
                }
              />

              {loadingStats
                ? "Refreshing..."
                : "Refresh"}
            </button>

          </div>


          {/* STATS ERROR */}

          {statsError && (
            <div className="mt-5 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="text-sm font-semibold text-red-700">
                  Unable to load overview
                </p>

                <p className="mt-1 text-sm text-red-600">
                  {statsError}
                </p>
              </div>

              <button
                type="button"
                onClick={fetchStats}
                disabled={loadingStats}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
              >
                <RefreshCw
                  size={15}
                  className={
                    loadingStats
                      ? "animate-spin"
                      : ""
                  }
                />
                Retry
              </button>

            </div>
          )}


          {/* STAT CARDS */}

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">

            {statCards.map((stat) => {
              const Icon = stat.icon;

              return (
                <Link
                  key={stat.title}
                  to={stat.link}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md active:scale-[0.99]"
                >

                  <div className="flex items-center justify-between">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-100">
                      <Icon size={20} />
                    </div>

                    <ArrowRight
                      size={16}
                      className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-400"
                    />

                  </div>

                  <p className="mt-5 text-sm font-medium text-slate-500">
                    {stat.title}
                  </p>


                  {loadingStats ? (
                    <div className="mt-2 h-9 w-16 animate-pulse rounded-lg bg-slate-100" />
                  ) : (
                    <p className="mt-1 text-3xl font-bold text-slate-900">
                      {stat.value}
                    </p>
                  )}

                  <p className="mt-1 text-xs text-slate-400">
                    {stat.description}
                  </p>

                </Link>
              );
            })}

          </div>

        </section>


        {/* =========================
            QUICK ACCESS
        ========================== */}

        <section className="mt-8 sm:mt-10">

          <h2 className="text-xl font-bold text-slate-900">
            Quick Access
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Jump into what you need.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.title}
                  to={action.link}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md active:scale-[0.99]"
                >

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-100">
                    <Icon size={21} />
                  </div>

                  <h3 className="mt-5 font-semibold text-slate-900">
                    {action.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {action.description}
                  </p>

                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-blue-600">
                    Explore

                    <ArrowRight
                      size={15}
                      className="transition group-hover:translate-x-1"
                    />
                  </div>

                </Link>
              );
            })}

          </div>

        </section>


        {/* =========================
            ACTIVITY
        ========================== */}

        <section className="mt-8 grid gap-6 sm:mt-10 lg:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 lg:col-span-2">

            <div className="flex items-start justify-between gap-4">

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Recent Campus Activity
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  See what your campus community is sharing.
                </p>
              </div>

              <Link
                to="/resources"
                className="hidden shrink-0 items-center gap-1 text-sm font-medium text-blue-600 transition hover:text-blue-700 sm:flex"
              >
                View all
                <ArrowRight size={15} />
              </Link>

            </div>


            <div className="mt-6 space-y-4">

              {/* RESOURCES */}

              <div className="flex gap-4 rounded-xl bg-slate-50 p-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <BookOpen size={19} />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800">
                    {loadingStats
                      ? "Loading resources..."
                      : `${stats.resources} resources available`}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Explore study material and useful resources shared by students.
                  </p>
                </div>

              </div>


              {/* PROJECTS */}

              <div className="flex gap-4 rounded-xl bg-slate-50 p-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                  <FolderKanban size={19} />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800">
                    {loadingStats
                      ? "Loading projects..."
                      : `${stats.projects} projects shared`}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Find inspiration and ideas for your next academic project.
                  </p>
                </div>

              </div>


              {/* QUERIES */}

              <div className="flex gap-4 rounded-xl bg-slate-50 p-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-600">
                  <HelpCircle size={19} />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800">
                    {loadingStats
                      ? "Loading queries..."
                      : `${stats.queries} open queries`}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Help another student or ask the community for support.
                  </p>
                </div>

              </div>

            </div>

          </div>


          {/* =========================
              COMMUNITY CARD
          ========================== */}

          <div className="rounded-2xl bg-blue-600 p-5 text-white sm:p-6">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
              <Users size={22} />
            </div>

            <h2 className="mt-6 text-xl font-bold">
              Learn from your campus
            </h2>

            <p className="mt-3 text-sm leading-6 text-blue-100">
              Seniors can share what they know, juniors can discover
              what they need, and everyone grows together.
            </p>

            <Link
              to="/resources"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 active:scale-[0.98] sm:w-auto"
            >
              Explore CampusConnect
              <ArrowRight size={16} />
            </Link>

          </div>

        </section>


        {/* MOBILE VIEW ALL */}

        <div className="mt-6 sm:hidden">
          <Link
            to="/resources"
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-blue-600 transition hover:bg-slate-50 active:scale-[0.99]"
          >
            View all resources
            <ArrowRight size={16} />
          </Link>
        </div>

      </main>
    </AppLayout>
  );
}

export default Dashboard;