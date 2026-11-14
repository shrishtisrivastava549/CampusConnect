
import { useEffect, useState } from "react";
import {
  Bell,
  Check,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  FileText,
  FolderKanban,
  Package,
  Lightbulb,
  UserCheck,
} from "lucide-react";

import AppLayout from "../components/AppLayout";
import api from "../api/axios";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem(
    "campusconnect_token"
  );

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        setError("Login required. Please login again.");
        return;
      }

      const response = await api.get(
        "/notifications",
        authConfig
      );

      setNotifications(
        Array.isArray(response.data)
          ? response.data
          : response.data.notifications || []
      );
    } catch (err) {
      console.error("GET NOTIFICATIONS ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.put(
        `/notifications/${id}/read`,
        {},
        authConfig
      );

      setNotifications((current) =>
        current.map((notification) =>
          notification._id === id
            ? {
                ...notification,
                IsRead: true,
              }
            : notification
        )
      );
    } catch (err) {
      console.error("MARK NOTIFICATION ERROR:", err);

      alert(
        err.response?.data?.message ||
          "Unable to mark notification as read."
      );
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.IsRead
  ).length;

  const getNotificationIcon = (type) => {
    const value = String(type || "").toLowerCase();

    if (value.includes("user")) {
      return UserCheck;
    }

    if (value.includes("resource")) {
      return Package;
    }

    if (value.includes("note")) {
      return FileText;
    }

    if (value.includes("project")) {
      return FolderKanban;
    }

    if (value.includes("recommendation")) {
      return Lightbulb;
    }

    return Bell;
  };

  return (
    <AppLayout>
      <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-8">

        {/* BACKGROUND GLOW */}

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-blue-600/15 blur-3xl" />

          <div className="absolute right-[-120px] top-32 h-[420px] w-[420px] rounded-full bg-violet-600/15 blur-3xl" />

          <div className="absolute bottom-[-160px] left-1/3 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl">

          {/* HEADER */}

          <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-blue-600/15 via-violet-600/10 to-white/[0.03] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-start gap-4">

                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-400">
                  <Bell size={27} />

                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-slate-950 bg-blue-500 px-1 text-[10px] font-bold text-white">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </div>

                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-300">
                    <Sparkles size={12} />
                    Campus Updates
                  </div>

                  <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                    Notifications
                  </h1>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Stay updated about your submissions,
                    approvals, and campus activity.
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={fetchNotifications}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-blue-400/20 hover:bg-white/[0.1] disabled:cursor-not-allowed disabled:opacity-50"
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

          </section>

          {/* STATUS BAR */}

          {!loading && !error && (
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 backdrop-blur-xl">

              <div className="flex items-center gap-3">

                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                    unreadCount > 0
                      ? "bg-blue-500/10 text-blue-400"
                      : "bg-emerald-500/10 text-emerald-400"
                  }`}
                >
                  {unreadCount > 0 ? (
                    <Bell size={17} />
                  ) : (
                    <CheckCircle2 size={17} />
                  )}
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-200">
                    {unreadCount > 0
                      ? `${unreadCount} unread notification${
                          unreadCount !== 1 ? "s" : ""
                        }`
                      : "You're all caught up"}
                  </p>

                  <p className="text-xs text-slate-500">
                    {notifications.length} total notification
                    {notifications.length !== 1 ? "s" : ""}
                  </p>
                </div>

              </div>

              {unreadCount > 0 && (
                <span className="w-fit rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
                  New updates available
                </span>
              )}

            </div>
          )}

          {/* ERROR */}

          {error && (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-500/10 p-5 text-sm text-red-300">
              <Bell size={18} className="mt-0.5 shrink-0" />
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
                Loading your notifications...
              </p>

            </div>
          ) : notifications.length === 0 ? (

            /* EMPTY */

            <div className="mt-6 rounded-3xl border border-dashed border-white/10 bg-white/[0.035] p-14 text-center backdrop-blur-xl">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 size={30} />
              </div>

              <h2 className="mt-5 text-lg font-bold text-white">
                No Notifications
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                You're completely caught up. New campus
                updates will appear here.
              </p>

            </div>
          ) : (

            /* LIST */

            <div className="mt-6 space-y-3">

              {notifications.map((notification) => {
                const Icon = getNotificationIcon(
                  notification.Type
                );

                const isRead = notification.IsRead;

                return (
                  <article
                    key={notification._id}
                    className={`group relative overflow-hidden rounded-2xl border p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 ${
                      isRead
                        ? "border-white/10 bg-white/[0.035] hover:border-white/15 hover:bg-white/[0.055]"
                        : "border-blue-400/20 bg-blue-500/[0.07] shadow-lg shadow-blue-950/10 hover:border-blue-400/30 hover:bg-blue-500/[0.09]"
                    }`}
                  >

                    {!isRead && (
                      <div className="absolute bottom-0 left-0 top-0 w-0.5 bg-gradient-to-b from-blue-400 to-violet-500" />
                    )}

                    <div className="flex gap-4">

                      {/* ICON */}

                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${
                          isRead
                            ? "border-white/10 bg-white/[0.05] text-slate-500"
                            : "border-blue-400/20 bg-blue-500/10 text-blue-400"
                        }`}
                      >
                        <Icon size={20} />
                      </div>

                      {/* CONTENT */}

                      <div className="min-w-0 flex-1">

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                          <div className="min-w-0">

                            <div className="flex flex-wrap items-center gap-2">

                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider ${
                                  isRead
                                    ? "text-slate-600"
                                    : "text-blue-400"
                                }`}
                              >
                                {notification.Type
                                  ? String(
                                      notification.Type
                                    ).replace(
                                      /_/g,
                                      " "
                                    )
                                  : "Campus Update"}
                              </span>

                              {!isRead && (
                                <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-300">
                                  New
                                </span>
                              )}

                            </div>

                            <p
                              className={`mt-2 text-sm leading-6 ${
                                isRead
                                  ? "text-slate-400"
                                  : "font-medium text-slate-200"
                              }`}
                            >
                              {notification.Message}
                            </p>

                            {notification.createdAt && (
                              <p className="mt-2 text-xs text-slate-600">
                                {new Date(
                                  notification.createdAt
                                ).toLocaleString()}
                              </p>
                            )}

                          </div>

                        </div>

                        {/* MARK READ */}

                        {!isRead && (
                          <button
                            type="button"
                            onClick={() =>
                              markAsRead(
                                notification._id
                              )
                            }
                            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-blue-400/20 bg-blue-500/10 px-3.5 py-2 text-xs font-semibold text-blue-300 transition hover:border-blue-400/30 hover:bg-blue-500/20"
                          >
                            <Check size={14} />
                            Mark as read
                          </button>
                        )}

                        {isRead && (
                          <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-500/70">
                            <CheckCircle2 size={13} />
                            Read
                          </div>
                        )}

                      </div>

                    </div>

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

export default Notifications;

