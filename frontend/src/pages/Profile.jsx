import { useEffect, useState } from "react";
import {
  Mail,
  Shield,
  GraduationCap,
  Building2,
  Edit3,
  X,
  Phone,
  CalendarDays,
  Save,
  RefreshCw,
  User,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

import AppLayout from "../components/AppLayout";
import api from "../api/axios";

function Profile() {
  const [user, setUser] = useState(() =>
    JSON.parse(
      localStorage.getItem("campusconnect_user") || "{}"
    )
  );

  const [showEdit, setShowEdit] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    Name: "",
    Course: "",
    Department: "",
    AcademicYear: "",
    Semester: "",
    PersonalEmail: "",
    Phone: "",
  });

  const token = localStorage.getItem(
    "campusconnect_token"
  );

  useEffect(() => {
    setFormData({
      Name: user.Name || "",
      Course: user.Course || "",
      Department: user.Department || "",
      AcademicYear: user.AcademicYear || "",
      Semester: user.Semester || "",
      PersonalEmail: user.PersonalEmail || "",
      Phone: user.Phone || "",
    });
  }, [user]);

  const openEditProfile = () => {
    setFormData({
      Name: user.Name || "",
      Course: user.Course || "",
      Department: user.Department || "",
      AcademicYear: user.AcademicYear || "",
      Semester: user.Semester || "",
      PersonalEmail: user.PersonalEmail || "",
      Phone: user.Phone || "",
    });

    setShowEdit(true);
  };

  const closeEditProfile = () => {
    if (!saving) {
      setShowEdit(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!token) {
      toast.error(
        "Login session expired. Please login again."
      );
      return;
    }

    if (!formData.Name.trim()) {
      toast.error("Name is required.");
      return;
    }

    setSaving(true);

    try {
      const response = await api.put(
        "/auth/profile",
        {
          Name: formData.Name.trim(),
          Course: formData.Course.trim(),
          Department: formData.Department.trim(),
          AcademicYear:
            formData.AcademicYear.trim(),
          Semester: formData.Semester.trim(),
          PersonalEmail:
            formData.PersonalEmail.trim(),
          Phone: formData.Phone.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUser = response.data.user;

      localStorage.setItem(
        "campusconnect_user",
        JSON.stringify(updatedUser)
      );

      setUser(updatedUser);
      setShowEdit(false);

      toast.success(
        response.data.message ||
          "Profile updated successfully."
      );
    } catch (err) {
      console.error(
        "UPDATE PROFILE ERROR:",
        err
      );

      toast.error(
        err.response?.data?.message ||
          "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const name =
    user.Name ||
    user.name ||
    "Student";

  const collegeEmail =
    user.CollegeEmail ||
    user.collegeEmail ||
    "Not available";

  const personalEmail =
    user.PersonalEmail ||
    user.personalEmail ||
    "Not available";

  const phone =
    user.Phone ||
    user.phone ||
    "Not available";

  const role =
    user.Role ||
    user.role ||
    "student";

  const college =
    user.College ||
    user.college ||
    "Not available";

  const department =
    user.Department ||
    user.department ||
    "Not available";

  const course =
    user.Course ||
    user.course ||
    "Not available";

  const semester =
    user.Semester ||
    user.semester ||
    "Not available";

  const academicYear =
    user.AcademicYear ||
    user.academicYear ||
    "Not available";

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) =>
      word[0]?.toUpperCase()
    )
    .join("");

  const infoCards = [
    {
      label: "College Email",
      value: collegeEmail,
      icon: Mail,
      iconClass:
        "border-blue-400/20 bg-blue-500/10 text-blue-400",
    },
    {
      label: "Personal Email",
      value: personalEmail,
      icon: Mail,
      iconClass:
        "border-violet-400/20 bg-violet-500/10 text-violet-400",
    },
    {
      label: "Phone",
      value: phone,
      icon: Phone,
      iconClass:
        "border-emerald-400/20 bg-emerald-500/10 text-emerald-400",
    },
    {
      label: "Account Role",
      value: role,
      icon: Shield,
      iconClass:
        "border-purple-400/20 bg-purple-500/10 text-purple-400",
    },
    {
      label: "College",
      value: college,
      icon: Building2,
      iconClass:
        "border-orange-400/20 bg-orange-500/10 text-orange-400",
    },
    {
      label: "Department",
      value: department,
      icon: GraduationCap,
      iconClass:
        "border-pink-400/20 bg-pink-500/10 text-pink-400",
    },
    {
      label: "Course",
      value: course,
      icon: GraduationCap,
      iconClass:
        "border-cyan-400/20 bg-cyan-500/10 text-cyan-400",
    },
    {
      label: "Academic Year",
      value: academicYear,
      icon: CalendarDays,
      iconClass:
        "border-yellow-400/20 bg-yellow-500/10 text-yellow-400",
    },
    {
      label: "Semester",
      value: semester,
      icon: GraduationCap,
      iconClass:
        "border-indigo-400/20 bg-indigo-500/10 text-indigo-400",
    },
  ];

  return (
    <AppLayout>
      <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-8">

        {/* BACKGROUND GLOW */}

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-blue-600/15 blur-3xl" />

          <div className="absolute right-[-140px] top-20 h-[430px] w-[430px] rounded-full bg-violet-600/15 blur-3xl" />

          <div className="absolute bottom-[-180px] left-1/3 h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl">

          {/* HEADER */}

          <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-blue-600/15 via-violet-600/10 to-white/[0.03] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-start gap-4">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-400">
                  <User size={27} />
                </div>

                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-300">
                    <Sparkles size={12} />
                    Personal
                  </div>

                  <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                    Profile
                  </h1>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    View and manage your CampusConnect account.
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={openEditProfile}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:scale-[1.02] hover:shadow-blue-900/40 active:scale-[0.98]"
              >
                <Edit3 size={16} />
                Edit Profile
              </button>

            </div>

          </section>

          {/* PROFILE HERO */}

          <section className="relative mt-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/20 backdrop-blur-xl">

            <div className="relative h-36 overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-700">

              <div className="absolute -right-10 -top-20 h-56 w-56 rounded-full bg-white/10 blur-2xl" />

              <div className="absolute bottom-[-80px] left-1/3 h-44 w-44 rounded-full bg-cyan-400/10 blur-2xl" />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />

            </div>

            <div className="relative px-5 pb-7 sm:px-7">

              <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

                <div className="flex items-end gap-4">

                  <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-4 border-slate-950 bg-gradient-to-br from-blue-500 to-violet-600 text-2xl font-bold text-white shadow-xl shadow-black/30">
                    {initials || "S"}
                  </div>

                  <div className="pb-1">

                    <h2 className="text-2xl font-bold text-white">
                      {name}
                    </h2>

                    <div className="mt-2 inline-flex items-center rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-medium capitalize text-slate-400">
                      {role}
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </section>

          {/* INFORMATION */}

          <section className="mt-6">

            <div className="mb-4 flex items-center gap-3">

              <div className="h-8 w-1 rounded-full bg-gradient-to-b from-blue-500 to-violet-500" />

              <div>
                <h2 className="text-lg font-bold text-white">
                  Account Information
                </h2>

                <p className="text-xs text-slate-500">
                  Your personal and academic details
                </p>
              </div>

            </div>

            <div className="grid gap-4 sm:grid-cols-2">

              {infoCards.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="group rounded-2xl border border-white/10 bg-white/[0.035] p-4 backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/[0.055] hover:shadow-xl hover:shadow-black/20"
                  >

                    <div className="flex items-center gap-3">

                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${item.iconClass}`}
                      >
                        <Icon size={19} />
                      </div>

                      <div className="min-w-0">

                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                          {item.label}
                        </p>

                        <p className="mt-1 break-all text-sm font-medium capitalize text-slate-300 transition group-hover:text-white">
                          {item.value}
                        </p>

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>

          </section>

        </div>

        {/* EDIT PROFILE MODAL */}

        {showEdit && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/80 px-4 py-8 backdrop-blur-md"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                closeEditProfile();
              }
            }}
          >

            <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-black/50 sm:p-7">

              {/* MODAL HEADER */}

              <div className="flex items-start justify-between gap-4">

                <div>

                  <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-300">
                    <Edit3 size={11} />
                    Account Settings
                  </div>

                  <h2 className="mt-3 text-xl font-bold text-white">
                    Edit Profile
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Update your personal and academic information.
                  </p>

                </div>

                <button
                  type="button"
                  onClick={closeEditProfile}
                  disabled={saving}
                  aria-label="Close edit profile"
                  className="rounded-xl border border-white/10 bg-white/[0.04] p-2 text-slate-400 transition hover:bg-white/[0.08] hover:text-white disabled:opacity-50"
                >
                  <X size={19} />
                </button>

              </div>

              {/* FORM */}

              <form
                onSubmit={handleSave}
                className="mt-7"
              >

                <div className="grid gap-4 sm:grid-cols-2">

                  {/* NAME */}

                  <div className="sm:col-span-2">

                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Name
                    </label>

                    <input
                      type="text"
                      name="Name"
                      value={formData.Name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-400/40 focus:bg-white/[0.07] focus:ring-2 focus:ring-blue-500/10"
                    />

                  </div>

                  {/* COURSE */}

                  <div>

                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Course
                    </label>

                    <input
                      type="text"
                      name="Course"
                      value={formData.Course}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition focus:border-blue-400/40 focus:bg-white/[0.07] focus:ring-2 focus:ring-blue-500/10"
                    />

                  </div>

                  {/* DEPARTMENT */}

                  <div>

                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Department
                    </label>

                    <input
                      type="text"
                      name="Department"
                      value={formData.Department}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition focus:border-blue-400/40 focus:bg-white/[0.07] focus:ring-2 focus:ring-blue-500/10"
                    />

                  </div>

                  {/* ACADEMIC YEAR */}

                  <div>

                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Academic Year
                    </label>

                    <input
                      type="text"
                      name="AcademicYear"
                      value={formData.AcademicYear}
                      onChange={handleChange}
                      placeholder="e.g. 2025-2029"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-400/40 focus:bg-white/[0.07] focus:ring-2 focus:ring-blue-500/10"
                    />

                  </div>

                  {/* SEMESTER */}

                  <div>

                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Semester
                    </label>

                    <input
                      type="text"
                      name="Semester"
                      value={formData.Semester}
                      onChange={handleChange}
                      placeholder="e.g. 5"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-400/40 focus:bg-white/[0.07] focus:ring-2 focus:ring-blue-500/10"
                    />

                  </div>

                  {/* PERSONAL EMAIL */}

                  <div>

                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Personal Email
                    </label>

                    <input
                      type="email"
                      name="PersonalEmail"
                      value={formData.PersonalEmail}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition focus:border-blue-400/40 focus:bg-white/[0.07] focus:ring-2 focus:ring-blue-500/10"
                    />

                  </div>

                  {/* PHONE */}

                  <div>

                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Phone
                    </label>

                    <input
                      type="tel"
                      name="Phone"
                      value={formData.Phone}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition focus:border-blue-400/40 focus:bg-white/[0.07] focus:ring-2 focus:ring-blue-500/10"
                    />

                  </div>

                </div>

                {/* NON EDITABLE */}

                <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.035] p-4">

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                    Account Information
                  </p>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2">

                    <div>
                      <p className="text-xs text-slate-600">
                        College Email
                      </p>

                      <p className="mt-1 break-all text-sm font-medium text-slate-300">
                        {collegeEmail}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-600">
                        Role
                      </p>

                      <p className="mt-1 text-sm font-medium capitalize text-slate-300">
                        {role}
                      </p>
                    </div>

                  </div>

                </div>

                {/* ACTIONS */}

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                  <button
                    type="button"
                    onClick={closeEditProfile}
                    disabled={saving}
                    className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.08] hover:text-white disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
                  >

                    {saving ? (
                      <>
                        <RefreshCw
                          size={16}
                          className="animate-spin"
                        />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        Save Changes
                      </>
                    )}

                  </button>

                </div>

              </form>

            </div>

          </div>
        )}

      </main>
    </AppLayout>
  );
}

export default Profile;