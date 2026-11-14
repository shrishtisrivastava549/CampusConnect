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
        api.get("/queries", authConfig),
        api.get("/recommendations"),
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
      glow: "hover:border-blue-400/40 hover:shadow-blue-500/10",
      iconBg: "bg-blue-500/10 text-blue-400",
    },
    {
      title: "Browse Projects",
      description:
        "Discover project ideas shared by students.",
      icon: FolderKanban,
      link: "/projects",
      glow: "hover:border-purple-400/40 hover:shadow-purple-500/10",
      iconBg: "bg-purple-500/10 text-purple-400",
    },
    {
      title: "Ask a Question",
      description:
        "Get help from your campus community.",
      icon: HelpCircle,
      link: "/queries",
      glow: "hover:border-cyan-400/40 hover:shadow-cyan-500/10",
      iconBg: "bg-cyan-500/10 text-cyan-400",
    },
    {
      title: "Share Something",
      description:
        "Upload a resource or share your knowledge.",
      icon: Upload,
      link: "/resources",
      glow: "hover:border-emerald-400/40 hover:shadow-emerald-500/10",
      iconBg: "bg-emerald-500/10 text-emerald-400",
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
      iconBg: "bg-blue-500/10 text-blue-400",
    },
    {
      title: "Notes",
      value: stats.notes,
      icon: FileText,
      link: "/notes",
      description: "Shared notes",
      iconBg: "bg-purple-500/10 text-purple-400",
    },
    {
      title: "Projects",
      value: stats.projects,
      icon: FolderKanban,
      link: "/projects",
      description: "Student projects",
      iconBg: "bg-cyan-500/10 text-cyan-400",
    },
    {
      title: "Open Queries",
      value: stats.queries,
      icon: HelpCircle,
      link: "/queries",
      description: "Questions needing help",
      iconBg: "bg-emerald-500/10 text-emerald-400",
    },
    {
      title: "Recommendations",
      value: stats.recommendations,
      icon: Lightbulb,
      link: "/recommendations",
      description: "Community ideas",
      iconBg: "bg-amber-500/10 text-amber-400",
    },
  ];

  return (
    <AppLayout>
      <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-6 text-white sm:px-6 sm:py-8 lg:px-8">

        {/* BACKGROUND GLOW */}

        <div className="pointer-events-none absolute left-1/2 top-[-180px] h-[450px] w-[700px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[130px]" />

        <div className="pointer-events-none absolute right-[-180px] top-[350px] h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[120px]" />

        <div className="pointer-events-none absolute bottom-[-200px] left-[-100px] h-[350px] w-[350px] rounded-full bg-cyan-500/10 blur-[110px]" />

        <div className="relative z-10 mx-auto max-w-7xl">

          {/* =========================
              TOP BAR
          ========================== */}

          <div className="flex items-start justify-between gap-4">

            <div className="min-w-0">

              <div className="inline-flex items-center rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
                Campus Community
              </div>

              <h1 className="mt-4 text-2xl font-bold leading-tight sm:text-4xl">
                Hey {firstName}, ready to learn?
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                Discover useful resources, connect with
                your campus community, and share what
                you know.
              </p>

            </div>

            <Link
              to="/notifications"
              aria-label="Open notifications"
              className="relative shrink-0 rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-400 backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:border-blue-400/30 hover:bg-blue-500/10 hover:text-blue-400 active:scale-95"
            >
              <Bell size={21} />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" />
            </Link>

          </div>

          {/* =========================
              SEARCH
          ========================== */}

          <Link
            to="/resources"
            className="group mt-7 flex w-full max-w-4xl items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 shadow-xl backdrop-blur-xl transition duration-300 hover:border-blue-400/30 hover:bg-white/[0.08] hover:shadow-blue-500/10 sm:mt-9 sm:px-5"
          >

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <Search size={19} />
            </div>

            <span className="truncate text-sm text-slate-500 transition group-hover:text-slate-300 sm:text-base">
              Search resources, notes, projects, questions...
            </span>

            <ArrowRight
              size={18}
              className="ml-auto shrink-0 text-slate-600 transition group-hover:translate-x-1 group-hover:text-blue-400"
            />

          </Link>

          {/* =========================
              CAMPUS OVERVIEW
          ========================== */}

          <section className="mt-9 sm:mt-11">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

              <div>

                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                  Overview
                </p>

                <h2 className="mt-2 text-xl font-bold sm:text-2xl">
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
                className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-400 backdrop-blur-md transition hover:border-blue-400/30 hover:bg-white/10 hover:text-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
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

            {/* ERROR */}

            {statsError && (
              <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <p className="text-sm font-semibold text-red-300">
                    Unable to load overview
                  </p>

                  <p className="mt-1 text-sm text-red-400">
                    {statsError}
                  </p>

                </div>

                <button
                  type="button"
                  onClick={fetchStats}
                  disabled={loadingStats}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/20 disabled:opacity-50"
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

            {/* STATS */}

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">

              {statCards.map((stat) => {
                const Icon = stat.icon;

                return (
                  <Link
                    key={stat.title}
                    to={stat.link}
                    className="group rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.08] hover:shadow-2xl active:scale-[0.99]"
                  >

                    <div className="flex items-center justify-between">

                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconBg} transition duration-300 group-hover:scale-110`}
                      >
                        <Icon size={20} />
                      </div>

                      <ArrowRight
                        size={16}
                        className="text-slate-600 transition group-hover:translate-x-1 group-hover:text-blue-400"
                      />

                    </div>

                    <p className="mt-5 text-sm font-medium text-slate-400">
                      {stat.title}
                    </p>

                    {loadingStats ? (
                      <div className="mt-2 h-9 w-16 animate-pulse rounded-lg bg-white/10" />
                    ) : (
                      <p className="mt-1 text-3xl font-bold">
                        {stat.value}
                      </p>
                    )}

                    <p className="mt-1 text-xs text-slate-600">
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

          <section className="mt-9 sm:mt-11">

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-400">
              Shortcuts
            </p>

            <h2 className="mt-2 text-xl font-bold sm:text-2xl">
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
                    className={`group rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/[0.08] hover:shadow-2xl ${action.glow}`}
                  >

                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${action.iconBg} transition duration-300 group-hover:scale-110`}
                    >
                      <Icon size={21} />
                    </div>

                    <h3 className="mt-5 font-semibold text-white">
                      {action.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {action.description}
                    </p>

                    <div className="mt-4 flex items-center gap-1 text-sm font-medium text-blue-400">
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

          <section className="mt-9 grid gap-6 sm:mt-11 lg:grid-cols-3">

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-xl sm:p-6 lg:col-span-2">

              <div className="flex items-start justify-between gap-4">

                <div>

                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                    Community
                  </p>

                  <h2 className="mt-2 text-xl font-bold">
                    Recent Campus Activity
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    See what your campus community is sharing.
                  </p>

                </div>

                <Link
                  to="/resources"
                  className="hidden shrink-0 items-center gap-1 text-sm font-medium text-blue-400 transition hover:text-blue-300 sm:flex"
                >
                  View all
                  <ArrowRight size={15} />
                </Link>

              </div>

              <div className="mt-6 space-y-3">

                {/* RESOURCES */}

                <div className="flex gap-4 rounded-xl border border-white/5 bg-white/[0.03] p-4 transition hover:bg-white/[0.06]">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                    <BookOpen size={19} />
                  </div>

                  <div className="min-w-0">

                    <p className="text-sm font-semibold text-slate-200">
                      {loadingStats
                        ? "Loading resources..."
                        : `${stats.resources} resources available`}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Explore study material and useful
                      resources shared by students.
                    </p>

                  </div>

                </div>

                {/* PROJECTS */}

                <div className="flex gap-4 rounded-xl border border-white/5 bg-white/[0.03] p-4 transition hover:bg-white/[0.06]">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                    <FolderKanban size={19} />
                  </div>

                  <div className="min-w-0">

                    <p className="text-sm font-semibold text-slate-200">
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

                <div className="flex gap-4 rounded-xl border border-white/5 bg-white/[0.03] p-4 transition hover:bg-white/[0.06]">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                    <HelpCircle size={19} />
                  </div>

                  <div className="min-w-0">

                    <p className="text-sm font-semibold text-slate-200">
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

            {/* COMMUNITY CARD */}

            <div className="relative overflow-hidden rounded-2xl border border-blue-400/20 bg-gradient-to-br from-blue-600/30 via-purple-600/20 to-cyan-500/10 p-5 shadow-xl shadow-blue-500/10 backdrop-blur-xl sm:p-6">

              <div className="absolute right-[-50px] top-[-50px] h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />

              <div className="relative">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-blue-300">
                  <Users size={22} />
                </div>

                <h2 className="mt-6 text-xl font-bold">
                  Learn from your campus
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Seniors can share what they know,
                  juniors can discover what they need,
                  and everyone grows together.
                </p>

                <Link
                  to="/resources"
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-slate-100 active:scale-[0.98] sm:w-auto"
                >
                  Explore CampusConnect
                  <ArrowRight size={16} />
                </Link>

              </div>

            </div>

          </section>

          {/* MOBILE VIEW ALL */}

          <div className="mt-6 sm:hidden">

            <Link
              to="/resources"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-blue-400 transition hover:bg-white/10"
            >
              View all resources
              <ArrowRight size={16} />
            </Link>

          </div>

        </div>

      </main>
    </AppLayout>
  );
}

export default Dashboard;