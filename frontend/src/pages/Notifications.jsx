import { useEffect, useState } from "react";
import {
  Bell,
  Check,
  RefreshCw,
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
      console.error(
        "GET NOTIFICATIONS ERROR:",
        err
      );

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
      console.error(
        "MARK NOTIFICATION ERROR:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Unable to mark notification as read."
      );
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.IsRead
  ).length;

  return (
    <AppLayout>
      <main className="mx-auto max-w-5xl px-6 py-8 lg:px-8">

        {/* HEADER */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">
              Campus Updates
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Notifications
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Stay updated about your submissions and campus activity.
            </p>
          </div>

          <button
            onClick={fetchNotifications}
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

        {/* UNREAD COUNT */}

        {!loading && notifications.length > 0 && (
          <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            You have{" "}
            <span className="font-bold">
              {unreadCount}
            </span>{" "}
            unread notification
            {unreadCount !== 1 ? "s" : ""}.
          </div>
        )}

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
              Loading notifications...
            </p>
          </div>
        ) : notifications.length === 0 ? (
          /* EMPTY */

          <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <Bell
              size={42}
              className="mx-auto text-slate-300"
            />

            <h2 className="mt-4 text-lg font-semibold text-slate-700">
              No Notifications
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              You're all caught up!
            </p>
          </div>
        ) : (
          /* LIST */

          <div className="mt-8 space-y-3">
            {notifications.map(
              (notification) => (
                <article
                  key={notification._id}
                  className={`rounded-2xl border p-5 transition ${
                    notification.IsRead
                      ? "border-slate-200 bg-white"
                      : "border-blue-200 bg-blue-50/40"
                  }`}
                >
                  <div className="flex gap-4">

                    {/* ICON */}

                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                        notification.IsRead
                          ? "bg-slate-100 text-slate-500"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      <Bell size={20} />
                    </div>

                    {/* CONTENT */}

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p
                            className={`text-sm leading-6 ${
                              notification.IsRead
                                ? "text-slate-600"
                                : "font-semibold text-slate-800"
                            }`}
                          >
                            {notification.Message}
                          </p>

                          {notification.createdAt && (
                            <p className="mt-2 text-xs text-slate-400">
                              {new Date(
                                notification.createdAt
                              ).toLocaleString()}
                            </p>
                          )}
                        </div>

                        {!notification.IsRead && (
                          <span className="shrink-0 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                            New
                          </span>
                        )}
                      </div>

                      {/* MARK READ */}

                      {!notification.IsRead && (
                        <button
                          type="button"
                          onClick={() =>
                            markAsRead(
                              notification._id
                            )
                          }
                          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50"
                        >
                          <Check size={15} />
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </main>
    </AppLayout>
  );
}

export default Notifications;