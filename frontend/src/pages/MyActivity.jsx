import { useEffect, useState } from "react";
import {
  Activity,
  Package,
  FileText,
  Code2,
  HelpCircle,
  Lightbulb,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Clock3,
  XCircle,
  CircleDot,
} from "lucide-react";

import AppLayout from "../components/AppLayout";
import api from "../api/axios";

function MyActivity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("campusconnect_token");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchActivity = async () => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        setError("Login required. Please login again.");
        return;
      }

      const [
        resourcesResponse,
        notesResponse,
        projectsResponse,
        queriesResponse,
        recommendationsResponse,
      ] = await Promise.all([
        api.get("/resources/my", authConfig),
        api.get("/notes/my", authConfig),
        api.get("/projects/my", authConfig),
        api.get("/queries/my", authConfig),
        api.get("/recommendations/my", authConfig),
      ]);

      const resources =
        resourcesResponse.data.resources || [];

      const notes =
        notesResponse.data.notes || [];

      const projects =
        projectsResponse.data.projects || [];

      const queries =
        queriesResponse.data.queries || [];

      const recommendations =
        recommendationsResponse.data.recommendations || [];

      const combined = [
        ...resources.map((item) => ({
          id: item._id,
          type: "Resource",
          title: item.Title,
          description: item.Description,
          status: item.Status,
          date: item.createdAt,
          icon: Package,
        })),

        ...notes.map((item) => ({
          id: item._id,
          type: "Note",
          title: item.Title,
          description: item.Description,
          status: item.Status,
          date: item.createdAt,
          icon: FileText,
        })),

        ...projects.map((item) => ({
          id: item._id,
          type: "Project",
          title: item.Title,
          description: item.Description,
          status: item.Status,
          date: item.createdAt,
          icon: Code2,
        })),

        ...queries.map((item) => ({
          id: item._id,
          type: "Query",
          title: item.Title,
          description: item.Description,
          status: item.Status,
          date: item.createdAt,
          icon: HelpCircle,
        })),

        ...recommendations.map((item) => ({
          id: item._id,
          type: "Recommendation",
          title: item.Title,
          description: item.Description,
          status: item.Status,
          date: item.createdAt,
          icon: Lightbulb,
        })),
      ];

      combined.sort(
        (a, b) =>
          new Date(b.date || 0) -
          new Date(a.date || 0)
      );

      setActivities(combined);
    } catch (err) {
      console.error(
        "GET MY ACTIVITY ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load your activity."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, []);

  const getStatusConfig = (status) => {
    switch (status) {
      case "approved":
        return {
          label: "Approved",
          classes:
            "border-emerald-400/20 bg-emerald-500/10 text-emerald-300",
          icon: CheckCircle2,
        };

      case "pending":
        return {
          label: "Pending",
          classes:
            "border-amber-400/20 bg-amber-500/10 text-amber-300",
          icon: Clock3,
        };

      case "rejected":
        return {
          label: "Rejected",
          classes:
            "border-red-400/20 bg-red-500/10 text-red-300",
          icon: XCircle,
        };

      case "resolved":
        return {
          label: "Resolved",
          classes:
            "border-blue-400/20 bg-blue-500/10 text-blue-300",
          icon: CheckCircle2,
        };

      case "reviewed":
        return {
          label: "Reviewed",
          classes:
            "border-violet-400/20 bg-violet-500/10 text-violet-300",
          icon: CheckCircle2,
        };

      case "open":
        return {
          label: "Open",
          classes:
            "border-orange-400/20 bg-orange-500/10 text-orange-300",
          icon: CircleDot,
        };

      default:
        return {
          label: status || "Unknown",
          classes:
            "border-white/10 bg-white/[0.05] text-slate-400",
          icon: CircleDot,
        };
    }
  };

  return (
    <AppLayout>
      <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-8">

        {/* BACKGROUND GLOW */}

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-blue-600/15 blur-3xl" />

          <div className="absolute right-[-140px] top-24 h-[430px] w-[430px] rounded-full bg-violet-600/15 blur-3xl" />

          <div className="absolute bottom-[-180px] left-1/3 h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl">

          {/* HEADER */}

          <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-blue-600/15 via-violet-600/10 to-white/[0.03] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-start gap-4">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-400">
                  <Activity size={27} />
                </div>

                <div>

                  <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-300">
                    <Sparkles size={12} />
                    Personal Dashboard
                  </div>

                  <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                    My Activity
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                    Track everything you have submitted
                    across CampusConnect.
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={fetchActivity}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-blue-400/20 hover:bg-white/[0.1] disabled:cursor-not-allowed disabled:opacity-50"
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

          </section>

          {/* ACTIVITY SUMMARY */}

          {!loading && !error && activities.length > 0 && (
            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 backdrop-blur-xl">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                <Activity size={17} />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-200">
                  {activities.length}{" "}
                  {activities.length === 1
                    ? "activity"
                    : "activities"}{" "}
                  found
                </p>

                <p className="text-xs text-slate-500">
                  Your latest submissions are shown first.
                </p>
              </div>

            </div>
          )}

          {/* ERROR */}

          {error && (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-500/10 p-5 text-sm text-red-300">
              <Activity
                size={18}
                className="mt-0.5 shrink-0"
              />
              <span>{error}</span>
            </div>
          )}

          {/* LOADING */}

          {loading ? (
            <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.045] p-14 text-center backdrop-blur-xl">

              <RefreshCw
                className="mx-auto animate-spin text-blue-400"
                size={30}
              />

              <p className="mt-4 text-sm text-slate-400">
                Loading your activity...
              </p>

            </div>
          ) : activities.length === 0 ? (

            /* EMPTY */

            <div className="mt-6 rounded-3xl border border-dashed border-white/10 bg-white/[0.035] p-14 text-center backdrop-blur-xl">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-400">
                <Activity size={30} />
              </div>

              <h2 className="mt-5 text-lg font-bold text-white">
                No Activity Yet
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Your submissions and activity will
                appear here.
              </p>

            </div>

          ) : (

            /* ACTIVITY TIMELINE */

            <div className="relative mt-8">

              {/* TIMELINE LINE */}

              <div className="absolute bottom-6 left-[23px] top-6 hidden w-px bg-gradient-to-b from-blue-500/40 via-violet-500/20 to-transparent sm:block" />

              <div className="space-y-4">

                {activities.map((activity) => {
                  const Icon = activity.icon;

                  const statusConfig =
                    getStatusConfig(
                      activity.status
                    );

                  const StatusIcon =
                    statusConfig.icon;

                  return (
                    <article
                      key={`${activity.type}-${activity.id}`}
                      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/[0.055] hover:shadow-xl hover:shadow-black/20"
                    >

                      {/* ACCENT */}

                      <div className="absolute bottom-0 left-0 top-0 w-0.5 bg-gradient-to-b from-blue-500 to-violet-500 opacity-50 transition group-hover:opacity-100" />

                      <div className="flex gap-4">

                        {/* ICON */}

                        <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-400 shadow-lg shadow-blue-950/10">
                          <Icon size={21} />
                        </div>

                        {/* CONTENT */}

                        <div className="min-w-0 flex-1">

                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                            <div className="min-w-0">

                              {/* BADGES */}

                              <div className="flex flex-wrap items-center gap-2">

                                <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                  {activity.type}
                                </span>

                                <span
                                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${statusConfig.classes}`}
                                >
                                  <StatusIcon size={12} />
                                  {statusConfig.label}
                                </span>

                              </div>

                              {/* TITLE */}

                              <h2 className="mt-3 text-lg font-semibold leading-7 text-slate-100 transition group-hover:text-white">
                                {activity.title ||
                                  "Untitled"}
                              </h2>

                              {/* DESCRIPTION */}

                              {activity.description && (
                                <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-slate-500">
                                  {activity.description}
                                </p>
                              )}

                              {/* DATE */}

                              {activity.date && (
                                <div className="mt-4 flex items-center gap-2 text-xs text-slate-600">
                                  <Clock3 size={13} />

                                  <span>
                                    Submitted{" "}
                                    {new Date(
                                      activity.date
                                    ).toLocaleString()}
                                  </span>
                                </div>
                              )}

                            </div>

                          </div>

                        </div>

                      </div>

                    </article>
                  );
                })}

              </div>

            </div>
          )}

        </div>
      </main>
    </AppLayout>
  );
}

export default MyActivity;