
import { useEffect, useState } from "react";
import {
  Check,
  X,
  RefreshCw,
  Clock,
  FileText,
  Package,
  Lightbulb,
  FolderKanban,
  Users,
  UserCheck,
  ShieldCheck,
  Activity,
  AlertCircle,
} from "lucide-react";

import AppLayout from "../components/AppLayout";
import api from "../api/axios";
import toast from "react-hot-toast";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [resources, setResources] = useState([]);
  const [notes, setNotes] = useState([]);
  const [projects, setProjects] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");

  const token = localStorage.getItem("campusconnect_token");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // =========================
  // FETCH PENDING DATA
  // =========================

  const fetchPending = async () => {
    try {
      setLoading(true);

      const [
        userRes,
        resourceRes,
        noteRes,
        projectRes,
        recommendationRes,
      ] = await Promise.all([
        api.get("/admin/pending-users", authConfig),
        api.get("/admin/pending-resources", authConfig),
        api.get("/admin/pending-notes", authConfig),
        api.get("/projects/pending", authConfig),
        api.get(
          "/admin/pending-recommendations",
          authConfig
        ),
      ]);

      setUsers(
        Array.isArray(userRes.data)
          ? userRes.data
          : userRes.data.users || []
      );

      setResources(
        Array.isArray(resourceRes.data)
          ? resourceRes.data
          : resourceRes.data.resources || []
      );

      setNotes(
        Array.isArray(noteRes.data)
          ? noteRes.data
          : noteRes.data.notes || []
      );

      setProjects(
        Array.isArray(projectRes.data)
          ? projectRes.data
          : projectRes.data.projects || []
      );

      setRecommendations(
        Array.isArray(recommendationRes.data)
          ? recommendationRes.data
          : recommendationRes.data.recommendations || []
      );
    } catch (err) {
      console.error("FETCH ADMIN DATA ERROR:", err);

      const message =
        err.response?.data?.message ||
        "Unable to load admin data.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  // =========================
  // USER ACTIONS
  // =========================

  const approveUser = async (id) => {
    try {
      setActionLoading(`user-approve-${id}`);

      await api.put(
        `/admin/approve/${id}`,
        {},
        authConfig
      );

      setUsers((current) =>
        current.filter((user) => user._id !== id)
      );

      toast.success("User approved successfully.");
    } catch (err) {
      console.error("APPROVE USER ERROR:", err);

      const message =
        err.response?.data?.message ||
        "Unable to approve user.";

      toast.error(message);
    } finally {
      setActionLoading("");
    }
  };

  const rejectUser = async (id) => {
    try {
      setActionLoading(`user-reject-${id}`);

      await api.put(
        `/admin/reject/${id}`,
        {},
        authConfig
      );

      setUsers((current) =>
        current.filter((user) => user._id !== id)
      );

      toast.success("User rejected successfully.");
    } catch (err) {
      console.error("REJECT USER ERROR:", err);

      const message =
        err.response?.data?.message ||
        "Unable to reject user.";

      toast.error(message);
    } finally {
      setActionLoading("");
    }
  };

  // =========================
  // RESOURCE ACTIONS
  // =========================

  const approveResource = async (id) => {
    try {
      setActionLoading(`resource-approve-${id}`);

      await api.put(
        `/admin/approve-resource/${id}`,
        {},
        authConfig
      );

      setResources((current) =>
        current.filter((item) => item._id !== id)
      );

      toast.success("Resource approved successfully.");
    } catch (err) {
      console.error("APPROVE RESOURCE ERROR:", err);

      const message =
        err.response?.data?.message ||
        "Unable to approve resource.";

      toast.error(message);
    } finally {
      setActionLoading("");
    }
  };

  const rejectResource = async (id) => {
    try {
      setActionLoading(`resource-reject-${id}`);

      await api.put(
        `/admin/reject-resource/${id}`,
        {},
        authConfig
      );

      setResources((current) =>
        current.filter((item) => item._id !== id)
      );

      toast.success("Resource rejected successfully.");
    } catch (err) {
      console.error("REJECT RESOURCE ERROR:", err);

      const message =
        err.response?.data?.message ||
        "Unable to reject resource.";

      toast.error(message);
    } finally {
      setActionLoading("");
    }
  };

  // =========================
  // NOTE ACTIONS
  // =========================

  const approveNote = async (id) => {
    try {
      setActionLoading(`note-approve-${id}`);

      await api.put(
        `/admin/approve-note/${id}`,
        {},
        authConfig
      );

      setNotes((current) =>
        current.filter((item) => item._id !== id)
      );

      toast.success("Note approved successfully.");
    } catch (err) {
      console.error("APPROVE NOTE ERROR:", err);

      const message =
        err.response?.data?.message ||
        "Unable to approve note.";

      toast.error(message);
    } finally {
      setActionLoading("");
    }
  };

  const rejectNote = async (id) => {
    try {
      setActionLoading(`note-reject-${id}`);

      await api.put(
        `/admin/reject-note/${id}`,
        {},
        authConfig
      );

      setNotes((current) =>
        current.filter((item) => item._id !== id)
      );

      toast.success("Note rejected successfully.");
    } catch (err) {
      console.error("REJECT NOTE ERROR:", err);

      const message =
        err.response?.data?.message ||
        "Unable to reject note.";

      toast.error(message);
    } finally {
      setActionLoading("");
    }
  };

  // =========================
  // PROJECT ACTIONS
  // =========================

  const approveProject = async (id) => {
    try {
      setActionLoading(`project-approve-${id}`);

      await api.put(
        `/projects/${id}/approve`,
        {},
        authConfig
      );

      setProjects((current) =>
        current.filter((item) => item._id !== id)
      );

      toast.success("Project approved successfully.");
    } catch (err) {
      console.error("APPROVE PROJECT ERROR:", err);

      const message =
        err.response?.data?.message ||
        "Unable to approve project.";

      toast.error(message);
    } finally {
      setActionLoading("");
    }
  };

  const rejectProject = async (id) => {
    try {
      setActionLoading(`project-reject-${id}`);

      await api.put(
        `/admin/reject-project/${id}`,
        {},
        authConfig
      );

      setProjects((current) =>
        current.filter((item) => item._id !== id)
      );

      toast.success("Project rejected successfully.");
    } catch (err) {
      console.error("REJECT PROJECT ERROR:", err);

      const message =
        err.response?.data?.message ||
        "Unable to reject project.";

      toast.error(message);
    } finally {
      setActionLoading("");
    }
  };

  // =========================
  // RECOMMENDATION ACTIONS
  // =========================

  const reviewRecommendation = async (id) => {
    try {
      setActionLoading(
        `recommendation-review-${id}`
      );

      await api.put(
        `/admin/review-recommendation/${id}`,
        {},
        authConfig
      );

      setRecommendations((current) =>
        current.map((item) =>
          item._id === id
            ? {
                ...item,
                Status: "reviewed",
              }
            : item
        )
      );

      toast.success(
        "Recommendation reviewed successfully."
      );
    } catch (err) {
      console.error(
        "REVIEW RECOMMENDATION ERROR:",
        err
      );

      const message =
        err.response?.data?.message ||
        "Unable to review recommendation.";

      toast.error(message);
    } finally {
      setActionLoading("");
    }
  };

  const resolveRecommendation = async (id) => {
    try {
      setActionLoading(
        `recommendation-resolve-${id}`
      );

      await api.put(
        `/admin/resolve-recommendation/${id}`,
        {},
        authConfig
      );

      setRecommendations((current) =>
        current.filter((item) => item._id !== id)
      );

      toast.success(
        "Recommendation resolved successfully."
      );
    } catch (err) {
      console.error(
        "RESOLVE RECOMMENDATION ERROR:",
        err
      );

      const message =
        err.response?.data?.message ||
        "Unable to resolve recommendation.";

      toast.error(message);
    } finally {
      setActionLoading("");
    }
  };

  // =========================
  // HELPERS
  // =========================

  const totalPending =
    users.length +
    resources.length +
    notes.length +
    projects.length +
    recommendations.length;

  const EmptyState = ({ title, text }) => (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center backdrop-blur-xl">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-500/10 text-emerald-400">
        <Check size={22} />
      </div>

      <h3 className="mt-4 font-semibold text-white">
        {title}
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        {text}
      </p>
    </div>
  );

  const ActionButtons = ({
    id,
    type,
    approve,
    reject,
  }) => {
    const approveKey = `${type}-approve-${id}`;
    const rejectKey = `${type}-reject-${id}`;

    const approving =
      actionLoading === approveKey;

    const rejecting =
      actionLoading === rejectKey;

    return (
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={reject}
          disabled={approving || rejecting}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-300 transition hover:border-red-400/30 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <X size={16} />
          {rejecting ? "Rejecting..." : "Reject"}
        </button>

        <button
          type="button"
          onClick={approve}
          disabled={approving || rejecting}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-950/30 transition hover:-translate-y-0.5 hover:from-emerald-400 hover:to-teal-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Check size={16} />
          {approving ? "Approving..." : "Approve"}
        </button>
      </div>
    );
  };

  const SectionHeader = ({
    icon: Icon,
    title,
    subtitle,
    count,
    iconClass,
  }) => (
    <div className="mb-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] ${iconClass}`}
        >
          <Icon size={20} />
        </div>

        <div>
          <h2 className="text-lg font-bold text-white">
            {title}
          </h2>

          <p className="text-xs text-slate-500">
            {subtitle}
          </p>
        </div>
      </div>

      <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-semibold text-slate-300">
        {count}
      </span>
    </div>
  );

  return (
    <AppLayout>
      <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-8">

        {/* Background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-blue-600/15 blur-3xl" />
          <div className="absolute right-[-120px] top-32 h-[420px] w-[420px] rounded-full bg-violet-600/15 blur-3xl" />
          <div className="absolute bottom-[-180px] left-1/3 h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl">

          {/* =========================
              ADMIN HERO
          ========================= */}

          <section className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-600/20 via-violet-600/10 to-white/[0.03] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex items-start gap-4">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-400 shadow-lg shadow-blue-950/30">
                  <ShieldCheck size={28} />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-300">
                      Administration
                    </span>

                    <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-300">
                      <Activity size={12} />
                      Control Center
                    </span>
                  </div>

                  <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                    Admin Dashboard
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                    Manage registrations, review campus content,
                    and keep the CampusConnect community organized.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={fetchPending}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-blue-400/20 hover:bg-white/[0.1] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  size={17}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh Queue
              </button>

            </div>

          </section>

          {/* =========================
              OVERVIEW
          ========================= */}

          {!loading && (
            <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">

              {[
                {
                  label: "Users",
                  value: users.length,
                  icon: Users,
                  iconClass: "text-indigo-400 bg-indigo-500/10",
                },
                {
                  label: "Resources",
                  value: resources.length,
                  icon: Package,
                  iconClass: "text-blue-400 bg-blue-500/10",
                },
                {
                  label: "Notes",
                  value: notes.length,
                  icon: FileText,
                  iconClass: "text-violet-400 bg-violet-500/10",
                },
                {
                  label: "Projects",
                  value: projects.length,
                  icon: FolderKanban,
                  iconClass: "text-emerald-400 bg-emerald-500/10",
                },
                {
                  label: "Recommendations",
                  value: recommendations.length,
                  icon: Lightbulb,
                  iconClass: "text-amber-400 bg-amber-500/10",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="group rounded-2xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/15 hover:bg-white/[0.07]"
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.iconClass}`}
                      >
                        <Icon size={19} />
                      </div>

                      <span className="text-2xl font-bold text-white">
                        {item.value}
                      </span>
                    </div>

                    <p className="mt-4 text-sm font-medium text-slate-400">
                      Pending {item.label}
                    </p>
                  </div>
                );
              })}

            </section>
          )}

          {/* =========================
              LOADING
          ========================= */}

          {loading ? (
            <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.045] p-14 text-center backdrop-blur-xl">

              <RefreshCw
                className="mx-auto animate-spin text-blue-400"
                size={30}
              />

              <p className="mt-4 text-sm text-slate-400">
                Loading administration queue...
              </p>

            </div>
          ) : (
            <>

              {/* =========================
                  QUEUE SUMMARY
              ========================= */}

              <div className="mt-8 flex items-center gap-3 rounded-2xl border border-amber-400/10 bg-amber-500/[0.04] px-5 py-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                  <AlertCircle size={18} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-200">
                    {totalPending === 0
                      ? "Everything is up to date"
                      : `${totalPending} item${totalPending !== 1 ? "s" : ""} awaiting review`}
                  </p>

                  <p className="text-xs text-slate-500">
                    Review the queues below to keep campus content
                    moderated.
                  </p>
                </div>
              </div>

              {/* =========================
                  USERS
              ========================= */}

              <section className="mt-8">

                <SectionHeader
                  icon={Users}
                  title="User Verification"
                  subtitle="Review new student and faculty registrations."
                  count={`${users.length} pending`}
                  iconClass="text-indigo-400"
                />

                {users.length === 0 ? (
                  <EmptyState
                    title="No Pending Users"
                    text="All user registrations have been reviewed."
                  />
                ) : (
                  <div className="space-y-3">
                    {users.map((user) => (
                      <div
                        key={user._id}
                        className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl transition hover:border-indigo-400/20 hover:bg-white/[0.06]"
                      >
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                          <div className="min-w-0">

                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-lg font-bold text-white">
                                {user.Name || "Unnamed User"}
                              </h3>

                              <span className="rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-[11px] font-semibold capitalize text-indigo-300">
                                {user.Role || "student"}
                              </span>

                              <span className="flex items-center gap-1 rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold text-amber-300">
                                <Clock size={12} />
                                Pending
                              </span>
                            </div>

                            <div className="mt-4 grid gap-2 text-sm text-slate-400 sm:grid-cols-2">

                              {user.CollegeEmail && (
                                <p>
                                  <span className="text-slate-600">
                                    College:
                                  </span>{" "}
                                  {user.CollegeEmail}
                                </p>
                              )}

                              {user.PersonalEmail && (
                                <p>
                                  <span className="text-slate-600">
                                    Personal:
                                  </span>{" "}
                                  {user.PersonalEmail}
                                </p>
                              )}

                              {user.Phone && (
                                <p>
                                  <span className="text-slate-600">
                                    Phone:
                                  </span>{" "}
                                  {user.Phone}
                                </p>
                              )}

                              {user.Course && (
                                <p>
                                  <span className="text-slate-600">
                                    Course:
                                  </span>{" "}
                                  {user.Course}
                                </p>
                              )}

                              {user.Department && (
                                <p>
                                  <span className="text-slate-600">
                                    Department:
                                  </span>{" "}
                                  {user.Department}
                                </p>
                              )}

                              {user.AcademicYear && (
                                <p>
                                  <span className="text-slate-600">
                                    Academic Year:
                                  </span>{" "}
                                  {user.AcademicYear}
                                </p>
                              )}

                              {user.Semester && (
                                <p>
                                  <span className="text-slate-600">
                                    Semester:
                                  </span>{" "}
                                  {user.Semester}
                                </p>
                              )}

                              {user.FacultyID && (
                                <p>
                                  <span className="text-slate-600">
                                    Faculty ID:
                                  </span>{" "}
                                  {user.FacultyID}
                                </p>
                              )}

                              {user.VerificationMethod && (
                                <p>
                                  <span className="text-slate-600">
                                    Verification:
                                  </span>{" "}
                                  <span className="capitalize">
                                    {user.VerificationMethod.replace(
                                      /_/g,
                                      " "
                                    )}
                                  </span>
                                </p>
                              )}

                            </div>

                          </div>

                          <ActionButtons
                            id={user._id}
                            type="user"
                            reject={() =>
                              rejectUser(user._id)
                            }
                            approve={() =>
                              approveUser(user._id)
                            }
                          />

                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </section>

              {/* =========================
                  RESOURCES
              ========================= */}

              <section className="mt-10">

                <SectionHeader
                  icon={Package}
                  title="Resource Moderation"
                  subtitle="Review books, devices, study material and other resources."
                  count={`${resources.length} pending`}
                  iconClass="text-blue-400"
                />

                {resources.length === 0 ? (
                  <EmptyState
                    title="No Pending Resources"
                    text="All resource submissions have been reviewed."
                  />
                ) : (
                  <div className="space-y-3">
                    {resources.map((item) => (
                      <div
                        key={item._id}
                        className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl transition hover:border-blue-400/20 hover:bg-white/[0.06]"
                      >
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                          <div className="min-w-0">
                            <h3 className="text-lg font-bold text-white">
                              {item.Title}
                            </h3>

                            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                              {item.Description ||
                                "No description provided."}
                            </p>

                            <div className="mt-3 flex flex-wrap gap-2">
                              {item.Category && (
                                <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-[11px] font-semibold text-blue-300">
                                  {item.Category}
                                </span>
                              )}

                              {item.Type && (
                                <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[11px] text-slate-400">
                                  {item.Type}
                                </span>
                              )}

                              <span className="rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold text-amber-300">
                                Pending Review
                              </span>
                            </div>
                          </div>

                          <ActionButtons
                            id={item._id}
                            type="resource"
                            reject={() =>
                              rejectResource(item._id)
                            }
                            approve={() =>
                              approveResource(item._id)
                            }
                          />

                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </section>

              {/* =========================
                  NOTES
              ========================= */}

              <section className="mt-10">

                <SectionHeader
                  icon={FileText}
                  title="Notes Moderation"
                  subtitle="Review academic notes submitted by students."
                  count={`${notes.length} pending`}
                  iconClass="text-violet-400"
                />

                {notes.length === 0 ? (
                  <EmptyState
                    title="No Pending Notes"
                    text="All note submissions have been reviewed."
                  />
                ) : (
                  <div className="space-y-3">
                    {notes.map((item) => (
                      <div
                        key={item._id}
                        className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl transition hover:border-violet-400/20 hover:bg-white/[0.06]"
                      >
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                          <div className="min-w-0">
                            <h3 className="text-lg font-bold text-white">
                              {item.Title}
                            </h3>

                            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                              {item.Description ||
                                "No description provided."}
                            </p>

                            <div className="mt-3 flex flex-wrap gap-2">
                              {item.Subject && (
                                <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-[11px] font-semibold text-violet-300">
                                  {item.Subject}
                                </span>
                              )}

                              {item.Course && (
                                <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-[11px] font-semibold text-blue-300">
                                  {item.Course}
                                </span>
                              )}

                              {item.Semester && (
                                <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[11px] text-slate-400">
                                  {item.Semester}
                                </span>
                              )}
                            </div>

                            {item.Owner && (
                              <p className="mt-3 text-xs text-slate-500">
                                Submitted by{" "}
                                <span className="font-semibold text-slate-400">
                                  {item.Owner.Name || "Student"}
                                </span>
                              </p>
                            )}
                          </div>

                          <ActionButtons
                            id={item._id}
                            type="note"
                            reject={() =>
                              rejectNote(item._id)
                            }
                            approve={() =>
                              approveNote(item._id)
                            }
                          />

                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </section>

              {/* =========================
                  PROJECTS
              ========================= */}

              <section className="mt-10">

                <SectionHeader
                  icon={FolderKanban}
                  title="Project Moderation"
                  subtitle="Review student projects before they become visible."
                  count={`${projects.length} pending`}
                  iconClass="text-emerald-400"
                />

                {projects.length === 0 ? (
                  <EmptyState
                    title="No Pending Projects"
                    text="All project submissions have been reviewed."
                  />
                ) : (
                  <div className="space-y-3">
                    {projects.map((item) => (
                      <div
                        key={item._id}
                        className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl transition hover:border-emerald-400/20 hover:bg-white/[0.06]"
                      >
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                          <div className="min-w-0">
                            <h3 className="text-lg font-bold text-white">
                              {item.Title}
                            </h3>

                            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                              {item.Description ||
                                "No description provided."}
                            </p>

                            <div className="mt-3 flex flex-wrap gap-2">
                              {item.Technology && (
                                <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-300">
                                  {item.Technology}
                                </span>
                              )}

                              {item.Course && (
                                <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-[11px] font-semibold text-blue-300">
                                  {item.Course}
                                </span>
                              )}

                              {item.Semester && (
                                <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[11px] text-slate-400">
                                  {item.Semester}
                                </span>
                              )}

                              {item.ProjectLink && (
                                <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold text-cyan-300">
                                  Project Link Added
                                </span>
                              )}
                            </div>
                          </div>

                          <ActionButtons
                            id={item._id}
                            type="project"
                            reject={() =>
                              rejectProject(item._id)
                            }
                            approve={() =>
                              approveProject(item._id)
                            }
                          />

                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </section>

              {/* =========================
                  RECOMMENDATIONS
              ========================= */}

              <section className="mt-10 pb-12">

                <SectionHeader
                  icon={Lightbulb}
                  title="Recommendation Review"
                  subtitle="Review and resolve recommendations from the community."
                  count={`${recommendations.length} pending`}
                  iconClass="text-amber-400"
                />

                {recommendations.length === 0 ? (
                  <EmptyState
                    title="No Pending Recommendations"
                    text="All recommendation submissions have been reviewed."
                  />
                ) : (
                  <div className="space-y-3">
                    {recommendations.map((item) => (
                      <div
                        key={item._id}
                        className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl transition hover:border-amber-400/20 hover:bg-white/[0.06]"
                      >
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                          <div className="min-w-0">

                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-lg font-bold text-white">
                                {item.Title}
                              </h3>

                              <span className="rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold capitalize text-amber-300">
                                {item.Status}
                              </span>
                            </div>

                            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                              {item.Description ||
                                "No description provided."}
                            </p>

                            {item.Category && (
                              <div className="mt-3">
                                <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-[11px] font-semibold capitalize text-blue-300">
                                  {item.Category}
                                </span>
                              </div>
                            )}

                            {item.Owner && (
                              <p className="mt-3 text-xs text-slate-500">
                                Submitted by{" "}
                                <span className="font-semibold text-slate-400">
                                  {item.Owner.Name || "Student"}
                                </span>
                              </p>
                            )}

                          </div>

                          <div className="flex shrink-0 gap-2">

                            {item.Status === "pending" && (
                              <button
                                type="button"
                                onClick={() =>
                                  reviewRecommendation(
                                    item._id
                                  )
                                }
                                disabled={
                                  actionLoading ===
                                  `recommendation-review-${item._id}`
                                }
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:-translate-y-0.5 hover:from-blue-500 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                <Check size={16} />

                                {actionLoading ===
                                `recommendation-review-${item._id}`
                                  ? "Reviewing..."
                                  : "Review"}
                              </button>
                            )}

                            {item.Status === "reviewed" && (
                              <button
                                type="button"
                                onClick={() =>
                                  resolveRecommendation(
                                    item._id
                                  )
                                }
                                disabled={
                                  actionLoading ===
                                  `recommendation-resolve-${item._id}`
                                }
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-950/30 transition hover:-translate-y-0.5 hover:from-emerald-400 hover:to-teal-400 disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                <Check size={16} />

                                {actionLoading ===
                                `recommendation-resolve-${item._id}`
                                  ? "Resolving..."
                                  : "Resolve"}
                              </button>
                            )}

                          </div>

                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </section>

            </>
          )}

        </div>
      </main>
    </AppLayout>
  );
}

export default AdminDashboard;


