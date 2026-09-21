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

  return (
    <AppLayout>
      <main className="mx-auto max-w-5xl px-6 py-8 lg:px-8">

        {/* HEADER */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">
              Personal
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Profile
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              View and manage your CampusConnect account.
            </p>
          </div>

          <button
            type="button"
            onClick={openEditProfile}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 active:scale-[0.98]"
          >
            <Edit3 size={16} />
            Edit Profile
          </button>
        </div>


        {/* PROFILE CARD */}

        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600" />

          <div className="px-6 pb-7">

            <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

              <div className="flex items-end gap-4">

                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-blue-100 text-2xl font-bold text-blue-600 shadow-md">
                  {initials || "S"}
                </div>

                <div className="pb-1">

                  <h2 className="text-2xl font-bold text-slate-900">
                    {name}
                  </h2>

                  <p className="mt-1 text-sm capitalize text-slate-500">
                    {role}
                  </p>

                </div>

              </div>

            </div>


            {/* INFORMATION GRID */}

            <div className="mt-8 grid gap-4 sm:grid-cols-2">

              {/* COLLEGE EMAIL */}

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <Mail size={19} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      College Email
                    </p>

                    <p className="mt-1 break-all text-sm font-medium text-slate-700">
                      {collegeEmail}
                    </p>
                  </div>

                </div>
              </div>


              {/* PERSONAL EMAIL */}

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                    <Mail size={19} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Personal Email
                    </p>

                    <p className="mt-1 break-all text-sm font-medium text-slate-700">
                      {personalEmail}
                    </p>
                  </div>

                </div>
              </div>


              {/* PHONE */}

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-600">
                    <Phone size={19} />
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Phone
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {phone}
                    </p>
                  </div>

                </div>
              </div>


              {/* ROLE */}

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                    <Shield size={19} />
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Account Role
                    </p>

                    <p className="mt-1 text-sm font-medium capitalize text-slate-700">
                      {role}
                    </p>
                  </div>

                </div>
              </div>


              {/* COLLEGE */}

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                    <Building2 size={19} />
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      College
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {college}
                    </p>
                  </div>

                </div>
              </div>


              {/* DEPARTMENT */}

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pink-100 text-pink-600">
                    <GraduationCap size={19} />
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Department
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {department}
                    </p>
                  </div>

                </div>
              </div>


              {/* COURSE */}

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <GraduationCap size={19} />
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Course
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {course}
                    </p>
                  </div>

                </div>
              </div>


              {/* ACADEMIC YEAR */}

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600">
                    <CalendarDays size={19} />
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Academic Year
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {academicYear}
                    </p>
                  </div>

                </div>
              </div>


              {/* SEMESTER */}

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-100 text-cyan-600">
                    <GraduationCap size={19} />
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Semester
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {semester}
                    </p>
                  </div>

                </div>
              </div>

            </div>

          </div>

        </section>


        {/* EDIT PROFILE MODAL */}

        {showEdit && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-4 py-8"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                closeEditProfile();
              }
            }}
          >

            <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">

              {/* MODAL HEADER */}

              <div className="flex items-start justify-between gap-4">

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
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
                  className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 disabled:opacity-50"
                >
                  <X size={20} />
                </button>

              </div>


              {/* FORM */}

              <form
                onSubmit={handleSave}
                className="mt-6"
              >

                <div className="grid gap-4 sm:grid-cols-2">

                  {/* NAME */}

                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Name
                    </label>

                    <input
                      type="text"
                      name="Name"
                      value={formData.Name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>


                  {/* COURSE */}

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Course
                    </label>

                    <input
                      type="text"
                      name="Course"
                      value={formData.Course}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>


                  {/* DEPARTMENT */}

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Department
                    </label>

                    <input
                      type="text"
                      name="Department"
                      value={formData.Department}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>


                  {/* ACADEMIC YEAR */}

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Academic Year
                    </label>

                    <input
                      type="text"
                      name="AcademicYear"
                      value={formData.AcademicYear}
                      onChange={handleChange}
                      placeholder="e.g. 2025-2029"
                      className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>


                  {/* SEMESTER */}

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Semester
                    </label>

                    <input
                      type="text"
                      name="Semester"
                      value={formData.Semester}
                      onChange={handleChange}
                      placeholder="e.g. 5"
                      className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>


                  {/* PERSONAL EMAIL */}

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Personal Email
                    </label>

                    <input
                      type="email"
                      name="PersonalEmail"
                      value={formData.PersonalEmail}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>


                  {/* PHONE */}

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Phone
                    </label>

                    <input
                      type="tel"
                      name="Phone"
                      value={formData.Phone}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                </div>


                {/* NON-EDITABLE INFORMATION */}

                <div className="mt-5 rounded-xl bg-slate-50 p-4">

                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Account Information
                  </p>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2">

                    <div>
                      <p className="text-xs text-slate-400">
                        College Email
                      </p>

                      <p className="mt-1 break-all text-sm font-medium text-slate-700">
                        {collegeEmail}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">
                        Role
                      </p>

                      <p className="mt-1 text-sm font-medium capitalize text-slate-700">
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
                    className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
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