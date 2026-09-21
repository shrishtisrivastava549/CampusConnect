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
        api.get(
          "/admin/pending-users",
          authConfig
        ),

        api.get(
          "/admin/pending-resources",
          authConfig
        ),

        api.get(
          "/admin/pending-notes",
          authConfig
        ),

        api.get(
          "/projects/pending",
          authConfig
        ),

        api.get(
          "/admin/pending-recommendations",
          authConfig
        ),
      ]);

      // USERS

      setUsers(
        Array.isArray(userRes.data)
          ? userRes.data
          : userRes.data.users || []
      );

      // RESOURCES

      setResources(
        Array.isArray(resourceRes.data)
          ? resourceRes.data
          : resourceRes.data.resources || []
      );

      // NOTES

      setNotes(
        Array.isArray(noteRes.data)
          ? noteRes.data
          : noteRes.data.notes || []
      );

      // PROJECTS

      setProjects(
        Array.isArray(projectRes.data)
          ? projectRes.data
          : projectRes.data.projects || []
      );

      // RECOMMENDATIONS

      setRecommendations(
        Array.isArray(recommendationRes.data)
          ? recommendationRes.data
          : recommendationRes.data.recommendations || []
      );
    } catch (err) {
      console.error(
        "FETCH ADMIN DATA ERROR:",
        err
      );

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
      setActionLoading(
        `user-approve-${id}`
      );

      await api.put(
        `/admin/approve/${id}`,
        {},
        authConfig
      );

      setUsers((current) =>
        current.filter(
          (user) => user._id !== id
        )
      );

      toast.success(
        "User approved successfully."
      );
    } catch (err) {
      console.error(
        "APPROVE USER ERROR:",
        err
      );

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
      setActionLoading(
        `user-reject-${id}`
      );

      await api.put(
        `/admin/reject/${id}`,
        {},
        authConfig
      );

      setUsers((current) =>
        current.filter(
          (user) => user._id !== id
        )
      );

      toast.success(
        "User rejected successfully."
      );
    } catch (err) {
      console.error(
        "REJECT USER ERROR:",
        err
      );

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
      setActionLoading(
        `resource-approve-${id}`
      );

      await api.put(
        `/admin/approve-resource/${id}`,
        {},
        authConfig
      );

      setResources((current) =>
        current.filter(
          (item) => item._id !== id
        )
      );

      toast.success(
        "Resource approved successfully."
      );
    } catch (err) {
      console.error(
        "APPROVE RESOURCE ERROR:",
        err
      );

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
      setActionLoading(
        `resource-reject-${id}`
      );

      await api.put(
        `/admin/reject-resource/${id}`,
        {},
        authConfig
      );

      setResources((current) =>
        current.filter(
          (item) => item._id !== id
        )
      );

      toast.success(
        "Resource rejected successfully."
      );
    } catch (err) {
      console.error(
        "REJECT RESOURCE ERROR:",
        err
      );

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
      setActionLoading(
        `note-approve-${id}`
      );

      await api.put(
        `/admin/approve-note/${id}`,
        {},
        authConfig
      );

      setNotes((current) =>
        current.filter(
          (item) => item._id !== id
        )
      );

      toast.success(
        "Note approved successfully."
      );
    } catch (err) {
      console.error(
        "APPROVE NOTE ERROR:",
        err
      );

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
      setActionLoading(
        `note-reject-${id}`
      );

      await api.put(
        `/admin/reject-note/${id}`,
        {},
        authConfig
      );

      setNotes((current) =>
        current.filter(
          (item) => item._id !== id
        )
      );

      toast.success(
        "Note rejected successfully."
      );
    } catch (err) {
      console.error(
        "REJECT NOTE ERROR:",
        err
      );

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
      setActionLoading(
        `project-approve-${id}`
      );

      await api.put(
        `/projects/${id}/approve`,
        {},
        authConfig
      );

      setProjects((current) =>
        current.filter(
          (item) => item._id !== id
        )
      );

      toast.success(
        "Project approved successfully."
      );
    } catch (err) {
      console.error(
        "APPROVE PROJECT ERROR:",
        err
      );

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
      setActionLoading(
        `project-reject-${id}`
      );

      await api.put(
        `/admin/reject-project/${id}`,
        {},
        authConfig
      );

      setProjects((current) =>
        current.filter(
          (item) => item._id !== id
        )
      );

      toast.success(
        "Project rejected successfully."
      );
    } catch (err) {
      console.error(
        "REJECT PROJECT ERROR:",
        err
      );

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
        current.filter(
          (item) => item._id !== id
        )
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
  // EMPTY STATE
  // =========================

  const EmptyState = ({
    title,
    text,
  }) => (
    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-8 text-center">
      <Clock
        className="mx-auto text-slate-300"
        size={36}
      />

      <h3 className="mt-3 font-semibold text-slate-700">
        {title}
      </h3>

      <p className="mt-1 text-sm text-slate-400">
        {text}
      </p>
    </div>
  );

  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl px-6 py-8">

        {/* =========================
            HEADER
        ========================= */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="font-medium text-blue-600">
              Administration
            </p>

            <h1 className="text-3xl font-bold text-slate-900">
              Admin Dashboard
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Review users and content submitted to CampusConnect.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchPending}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
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

        {/* =========================
            LOADING
        ========================= */}

        {loading ? (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-10 text-center">

            <RefreshCw
              className="mx-auto animate-spin text-blue-600"
              size={28}
            />

            <p className="mt-3 text-sm text-slate-500">
              Loading pending submissions...
            </p>

          </div>
        ) : (
          <>

            {/* =========================
                PENDING USERS
            ========================= */}

            <section className="mt-8">

              <div className="mb-4 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Users size={20} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Pending Users
                  </h2>

                  <p className="text-sm text-slate-500">
                    {users.length} pending user
                    {users.length !== 1
                      ? "s"
                      : ""}
                  </p>
                </div>

              </div>

              {users.length === 0 ? (
                <EmptyState
                  title="No Pending Users"
                  text="All user registrations have been reviewed."
                />
              ) : (
                <div className="space-y-4">

                  {users.map((user) => (

                    <div
                      key={user._id}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                    >

                      <div className="flex flex-col gap-5 md:flex-row md:justify-between">

                        <div className="min-w-0">

                          <div className="flex flex-wrap items-center gap-2">

                            <h3 className="text-lg font-bold text-slate-900">
                              {user.Name || "Unnamed User"}
                            </h3>

                            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold capitalize text-indigo-700">
                              {user.Role || "student"}
                            </span>

                          </div>

                          <div className="mt-3 grid gap-2 text-sm text-slate-600">

                            {user.CollegeEmail && (
                              <p>
                                <span className="font-medium text-slate-700">
                                  College Email:
                                </span>{" "}
                                {user.CollegeEmail}
                              </p>
                            )}

                            {user.PersonalEmail && (
                              <p>
                                <span className="font-medium text-slate-700">
                                  Personal Email:
                                </span>{" "}
                                {user.PersonalEmail}
                              </p>
                            )}

                            {user.Phone && (
                              <p>
                                <span className="font-medium text-slate-700">
                                  Phone:
                                </span>{" "}
                                {user.Phone}
                              </p>
                            )}

                            {user.Course && (
                              <p>
                                <span className="font-medium text-slate-700">
                                  Course:
                                </span>{" "}
                                {user.Course}
                              </p>
                            )}

                            {user.Department && (
                              <p>
                                <span className="font-medium text-slate-700">
                                  Department:
                                </span>{" "}
                                {user.Department}
                              </p>
                            )}

                            {user.AcademicYear && (
                              <p>
                                <span className="font-medium text-slate-700">
                                  Academic Year:
                                </span>{" "}
                                {user.AcademicYear}
                              </p>
                            )}

                            {user.Semester && (
                              <p>
                                <span className="font-medium text-slate-700">
                                  Semester:
                                </span>{" "}
                                {user.Semester}
                              </p>
                            )}

                            {user.FacultyID && (
                              <p>
                                <span className="font-medium text-slate-700">
                                  Faculty ID:
                                </span>{" "}
                                {user.FacultyID}
                              </p>
                            )}

                            {user.VerificationMethod && (
                              <p>
                                <span className="font-medium text-slate-700">
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

                          <div className="mt-3">

                            <span className="inline-flex items-center gap-2 rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700">
                              <Clock size={13} />
                              Pending Approval
                            </span>

                          </div>

                        </div>

                        <div className="flex shrink-0 gap-3">

                          <button
                            type="button"
                            onClick={() =>
                              rejectUser(user._id)
                            }
                            disabled={
                              actionLoading ===
                              `user-reject-${user._id}` ||
                              actionLoading ===
                              `user-approve-${user._id}`
                            }
                            className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >

                            <X size={17} />

                            {actionLoading ===
                            `user-reject-${user._id}`
                              ? "Rejecting..."
                              : "Reject"}

                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              approveUser(user._id)
                            }
                            disabled={
                              actionLoading ===
                              `user-approve-${user._id}` ||
                              actionLoading ===
                              `user-reject-${user._id}`
                            }
                            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                          >

                            <UserCheck size={17} />

                            {actionLoading ===
                            `user-approve-${user._id}`
                              ? "Approving..."
                              : "Approve"}

                          </button>

                        </div>

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

              <div className="mb-4 flex items-center gap-3">

                <Package className="text-blue-600" />

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Pending Resources
                  </h2>

                  <p className="text-sm text-slate-500">
                    {resources.length} pending
                  </p>
                </div>

              </div>

              {resources.length === 0 ? (
                <EmptyState
                  title="No Pending Resources"
                  text="All resource submissions have been reviewed."
                />
              ) : (
                <div className="space-y-4">

                  {resources.map((item) => (

                    <div
                      key={item._id}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                    >

                      <div className="flex flex-col gap-5 md:flex-row md:justify-between">

                        <div className="min-w-0">

                          <h3 className="text-lg font-bold text-slate-900">
                            {item.Title}
                          </h3>

                          <p className="mt-2 text-slate-600">
                            {item.Description}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-2">

                            {item.Category && (
                              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700">
                                {item.Category}
                              </span>
                            )}

                            {item.Type && (
                              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                                {item.Type}
                              </span>
                            )}

                          </div>

                        </div>

                        <div className="flex shrink-0 gap-3">

                          <button
                            type="button"
                            onClick={() =>
                              rejectResource(item._id)
                            }
                            disabled={
                              actionLoading ===
                              `resource-reject-${item._id}` ||
                              actionLoading ===
                              `resource-approve-${item._id}`
                            }
                            className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >

                            <X size={17} />

                            {actionLoading ===
                            `resource-reject-${item._id}`
                              ? "Rejecting..."
                              : "Reject"}

                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              approveResource(item._id)
                            }
                            disabled={
                              actionLoading ===
                              `resource-approve-${item._id}` ||
                              actionLoading ===
                              `resource-reject-${item._id}`
                            }
                            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 disabled:opacity-50"
                          >

                            <Check size={17} />

                            {actionLoading ===
                            `resource-approve-${item._id}`
                              ? "Approving..."
                              : "Approve"}

                          </button>

                        </div>

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

              <div className="mb-4 flex items-center gap-3">

                <FileText className="text-purple-600" />

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Pending Notes
                  </h2>

                  <p className="text-sm text-slate-500">
                    {notes.length} pending
                  </p>
                </div>

              </div>

              {notes.length === 0 ? (
                <EmptyState
                  title="No Pending Notes"
                  text="All note submissions have been reviewed."
                />
              ) : (
                <div className="space-y-4">

                  {notes.map((item) => (

                    <div
                      key={item._id}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                    >

                      <div className="flex flex-col gap-5 md:flex-row md:justify-between">

                        <div className="min-w-0">

                          <h3 className="text-lg font-bold text-slate-900">
                            {item.Title}
                          </h3>

                          <p className="mt-2 text-slate-600">
                            {item.Description ||
                              "No description provided."}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-2">

                            {item.Subject && (
                              <span className="rounded-full bg-purple-50 px-3 py-1 text-xs text-purple-700">
                                {item.Subject}
                              </span>
                            )}

                            {item.Course && (
                              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700">
                                {item.Course}
                              </span>
                            )}

                            {item.Semester && (
                              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                                {item.Semester}
                              </span>
                            )}

                          </div>

                          {item.Owner && (
                            <p className="mt-3 text-xs text-slate-400">
                              Submitted by{" "}
                              <span className="font-medium text-slate-500">
                                {item.Owner.Name ||
                                  "Student"}
                              </span>
                            </p>
                          )}

                        </div>

                        <div className="flex shrink-0 gap-3">

                          <button
                            type="button"
                            onClick={() =>
                              rejectNote(item._id)
                            }
                            disabled={
                              actionLoading ===
                              `note-reject-${item._id}` ||
                              actionLoading ===
                              `note-approve-${item._id}`
                            }
                            className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >

                            <X size={17} />

                            {actionLoading ===
                            `note-reject-${item._id}`
                              ? "Rejecting..."
                              : "Reject"}

                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              approveNote(item._id)
                            }
                            disabled={
                              actionLoading ===
                              `note-approve-${item._id}` ||
                              actionLoading ===
                              `note-reject-${item._id}`
                            }
                            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 disabled:opacity-50"
                          >

                            <Check size={17} />

                            {actionLoading ===
                            `note-approve-${item._id}`
                              ? "Approving..."
                              : "Approve"}

                          </button>

                        </div>

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

              <div className="mb-4 flex items-center gap-3">

                <FolderKanban className="text-green-600" />

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Pending Projects
                  </h2>

                  <p className="text-sm text-slate-500">
                    {projects.length} pending
                  </p>
                </div>

              </div>

              {projects.length === 0 ? (
                <EmptyState
                  title="No Pending Projects"
                  text="All project submissions have been reviewed."
                />
              ) : (
                <div className="space-y-4">

                  {projects.map((item) => (

                    <div
                      key={item._id}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                    >

                      <div className="flex flex-col gap-5 md:flex-row md:justify-between">

                        <div className="min-w-0">

                          <h3 className="text-lg font-bold text-slate-900">
                            {item.Title}
                          </h3>

                          <p className="mt-2 text-slate-600">
                            {item.Description}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-2">

                            {item.Technology && (
                              <span className="rounded-full bg-green-50 px-3 py-1 text-xs text-green-700">
                                {item.Technology}
                              </span>
                            )}

                            {item.Course && (
                              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700">
                                {item.Course}
                              </span>
                            )}

                            {item.Semester && (
                              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                                {item.Semester}
                              </span>
                            )}

                          </div>

                        </div>

                        <div className="flex shrink-0 gap-3">

                          <button
                            type="button"
                            onClick={() =>
                              rejectProject(item._id)
                            }
                            disabled={
                              actionLoading ===
                              `project-reject-${item._id}` ||
                              actionLoading ===
                              `project-approve-${item._id}`
                            }
                            className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >

                            <X size={17} />

                            {actionLoading ===
                            `project-reject-${item._id}`
                              ? "Rejecting..."
                              : "Reject"}

                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              approveProject(item._id)
                            }
                            disabled={
                              actionLoading ===
                              `project-approve-${item._id}` ||
                              actionLoading ===
                              `project-reject-${item._id}`
                            }
                            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 disabled:opacity-50"
                          >

                            <Check size={17} />

                            {actionLoading ===
                            `project-approve-${item._id}`
                              ? "Approving..."
                              : "Approve"}

                          </button>

                        </div>

                      </div>

                    </div>

                  ))}

                </div>
              )}

            </section>

            {/* =========================
                RECOMMENDATIONS
            ========================= */}

            <section className="mt-10 pb-10">

              <div className="mb-4 flex items-center gap-3">

                <Lightbulb className="text-amber-600" />

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Pending Recommendations
                  </h2>

                  <p className="text-sm text-slate-500">
                    {recommendations.length} pending
                  </p>
                </div>

              </div>

              {recommendations.length === 0 ? (
                <EmptyState
                  title="No Pending Recommendations"
                  text="All recommendation submissions have been reviewed."
                />
              ) : (
                <div className="space-y-4">

                  {recommendations.map((item) => (

                    <div
                      key={item._id}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                    >

                      <div className="flex flex-col gap-5 md:flex-row md:justify-between">

                        <div className="min-w-0">

                          <div className="flex flex-wrap items-center gap-2">

                            <h3 className="text-lg font-bold text-slate-900">
                              {item.Title}
                            </h3>

                            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold capitalize text-amber-600">
                              {item.Status}
                            </span>

                          </div>

                          <p className="mt-2 text-slate-600">
                            {item.Description}
                          </p>

                          {item.Category && (
                            <div className="mt-3">

                              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700 capitalize">
                                {item.Category}
                              </span>

                            </div>
                          )}

                          {item.Owner && (
                            <p className="mt-3 text-xs text-slate-400">
                              Submitted by{" "}
                              <span className="font-medium text-slate-500">
                                {item.Owner.Name ||
                                  "Student"}
                              </span>
                            </p>
                          )}

                        </div>

                        <div className="flex shrink-0 gap-3">

                          {item.Status ===
                            "pending" && (
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
                              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
                            >

                              <Check size={17} />

                              {actionLoading ===
                              `recommendation-review-${item._id}`
                                ? "Reviewing..."
                                : "Review"}

                            </button>
                          )}

                          {item.Status ===
                            "reviewed" && (
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
                              className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 disabled:opacity-50"
                            >

                              <Check size={17} />

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
    </AppLayout>
  );
}

export default AdminDashboard;