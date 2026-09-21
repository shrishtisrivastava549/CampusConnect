import { useEffect, useState } from "react";
import {
  Activity,
  Package,
  FileText,
  Code2,
  HelpCircle,
  Lightbulb,
  RefreshCw,
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

  const getStatusClasses = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";

      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      case "resolved":
        return "bg-blue-100 text-blue-700";

      case "reviewed":
        return "bg-purple-100 text-purple-700";

      case "open":
        return "bg-orange-100 text-orange-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <AppLayout>
      <main className="mx-auto max-w-6xl px-6 py-8 lg:px-8">

        {/* HEADER */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="text-sm font-medium text-blue-600">
              Personal
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              My Activity
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Track everything you have submitted on CampusConnect.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchActivity}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>

        </div>

        {/* ERROR */}

        {error && (
          <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* LOADING */}

        {loading ? (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-10 text-center">

            <RefreshCw
              className="mx-auto animate-spin text-blue-600"
              size={28}
            />

            <p className="mt-3 text-sm text-slate-500">
              Loading your activity...
            </p>

          </div>
        ) : activities.length === 0 ? (

          /* EMPTY */

          <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">

            <Activity
              size={44}
              className="mx-auto text-slate-300"
            />

            <h2 className="mt-4 text-lg font-semibold text-slate-700">
              No Activity Yet
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Your submissions and activity will appear here.
            </p>

          </div>

        ) : (

          /* ACTIVITY LIST */

          <div className="mt-8 space-y-4">

            {activities.map((activity) => {
              const Icon = activity.icon;

              return (
                <article
                  key={`${activity.type}-${activity.id}`}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >

                  <div className="flex gap-4">

                    {/* ICON */}

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Icon size={21} />
                    </div>

                    {/* CONTENT */}

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                        <div>

                          <div className="flex flex-wrap items-center gap-2">

                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                              {activity.type}
                            </span>

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                                activity.status
                              )}`}
                            >
                              {activity.status}
                            </span>

                          </div>

                          <h2 className="mt-3 text-lg font-semibold text-slate-900">
                            {activity.title || "Untitled"}
                          </h2>

                          {activity.description && (
                            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                              {activity.description}
                            </p>
                          )}

                        </div>

                      </div>

                      {activity.date && (
                        <p className="mt-4 text-xs text-slate-400">
                          Submitted{" "}
                          {new Date(
                            activity.date
                          ).toLocaleString()}
                        </p>
                      )}

                    </div>

                  </div>

                </article>
              );
            })}

          </div>
        )}

      </main>
    </AppLayout>
  );
}

export default MyActivity;