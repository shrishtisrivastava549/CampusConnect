import { useState } from "react";
import {
  ArrowLeft,
  Plus,
  Upload,
  FileText,
  X,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AppLayout from "../components/AppLayout";
import api from "../api/axios";

function AddResource() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Books");
  const [type, setType] = useState("Sell");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const allowedExtensions = [
    ".pdf",
    ".doc",
    ".docx",
    ".ppt",
    ".pptx",
    ".zip",
    ".jpg",
    ".jpeg",
    ".png",
  ];

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      setFile(null);
      return;
    }

    const extension =
      "." +
      selectedFile.name
        .split(".")
        .pop()
        .toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      const message =
        "Unsupported file type. Please upload PDF, DOC, DOCX, PPT, PPTX, ZIP, JPG or PNG.";

      setError(message);
      toast.error(message);

      event.target.value = "";
      setFile(null);
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      const message = "File size must be 10 MB or less.";

      setError(message);
      toast.error(message);

      event.target.value = "";
      setFile(null);
      return;
    }

    setError("");
    setFile(selectedFile);
    toast.success("File selected successfully.");
  };

  const removeFile = () => {
    setFile(null);

    const input = document.getElementById("resource-file");

    if (input) {
      input.value = "";
    }

    toast.success("File removed.");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem(
        "campusconnect_token"
      );

      if (!token) {
        const message =
          "Login required. Please login again.";

        setError(message);
        toast.error(message);

        navigate("/login");
        return;
      }

      const formData = new FormData();

      formData.append("Title", title.trim());
      formData.append(
        "Description",
        description.trim()
      );
      formData.append("Category", category);
      formData.append("Type", type);

      if (file) {
        formData.append("file", file);
      }

      await api.post("/resources", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(
        "Resource submitted successfully! Waiting for admin approval."
      );

      navigate("/resources");
    } catch (err) {
      console.error("ADD RESOURCE ERROR:", err);

      const message =
        err.response?.data?.message ||
        "Unable to submit resource. Please try again.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">

        {/* BACKGROUND GLOWS */}

        <div className="pointer-events-none absolute left-1/2 top-[-180px] h-[450px] w-[700px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[130px]" />

        <div className="pointer-events-none absolute right-[-150px] top-[500px] h-[350px] w-[350px] rounded-full bg-purple-600/10 blur-[120px]" />

        <main className="relative z-10 mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

          {/* BACK */}

          <Link
            to="/resources"
            className="inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm font-medium text-slate-500 transition hover:bg-white/5 hover:text-blue-400"
          >
            <ArrowLeft size={17} />
            Back to Resources
          </Link>

          {/* HEADER */}

          <div className="mt-7">

            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-300">
              <Sparkles size={14} />
              Share with Campus
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Add Resource
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Share a useful resource with your campus
              community and help other students learn.
            </p>

          </div>

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="relative mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl sm:p-7"
          >

            {/* TOP GLOW */}

            <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-2/3 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative">

              {/* TITLE */}

              <div>
                <label
                  htmlFor="resource-title"
                  className="text-sm font-semibold text-slate-200"
                >
                  Resource Title
                </label>

                <input
                  id="resource-title"
                  type="text"
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  placeholder="e.g. Data Structures Notes"
                  required
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/50 focus:bg-white/5 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>

              {/* DESCRIPTION */}

              <div className="mt-6">
                <label
                  htmlFor="resource-description"
                  className="text-sm font-semibold text-slate-200"
                >
                  Description
                </label>

                <textarea
                  id="resource-description"
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  placeholder="Describe the resource..."
                  rows={5}
                  required
                  className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3.5 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/50 focus:bg-white/5 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>

              {/* CATEGORY + TYPE */}

              <div className="mt-6 grid gap-5 sm:grid-cols-2">

                <div>
                  <label
                    htmlFor="resource-category"
                    className="text-sm font-semibold text-slate-200"
                  >
                    Category
                  </label>

                  <select
                    id="resource-category"
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value)
                    }
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3.5 text-sm text-slate-300 outline-none transition focus:border-blue-500/50"
                  >
                    <option
                      value="Books"
                      className="bg-slate-900"
                    >
                      Books
                    </option>

                    <option
                      value="Notes"
                      className="bg-slate-900"
                    >
                      Notes
                    </option>

                    <option
                      value="Lab Equipment"
                      className="bg-slate-900"
                    >
                      Lab Equipment
                    </option>

                    <option
                      value="Drafting Tools"
                      className="bg-slate-900"
                    >
                      Drafting Tools
                    </option>

                    <option
                      value="Electronics"
                      className="bg-slate-900"
                    >
                      Electronics
                    </option>

                    <option
                      value="Other"
                      className="bg-slate-900"
                    >
                      Other
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="resource-type"
                    className="text-sm font-semibold text-slate-200"
                  >
                    Type
                  </label>

                  <select
                    id="resource-type"
                    value={type}
                    onChange={(e) =>
                      setType(e.target.value)
                    }
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3.5 text-sm text-slate-300 outline-none transition focus:border-blue-500/50"
                  >
                    <option
                      value="Sell"
                      className="bg-slate-900"
                    >
                      Sell
                    </option>

                    <option
                      value="Rent"
                      className="bg-slate-900"
                    >
                      Rent
                    </option>

                    <option
                      value="Donate"
                      className="bg-slate-900"
                    >
                      Donate
                    </option>
                  </select>
                </div>

              </div>

              {/* FILE UPLOAD */}

              <div className="mt-6">

                <label className="text-sm font-semibold text-slate-200">
                  Resource File

                  <span className="ml-1 font-normal text-slate-600">
                    (optional)
                  </span>
                </label>

                <label
                  htmlFor="resource-file"
                  className="group mt-2 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 bg-slate-950/30 px-6 py-10 text-center transition duration-300 hover:border-blue-400/30 hover:bg-blue-500/5"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 transition duration-300 group-hover:scale-110 group-hover:bg-blue-500/15">
                    <Upload size={27} />
                  </div>

                  <p className="mt-4 text-sm font-semibold text-slate-200">
                    Click to upload a file
                  </p>

                  <p className="mt-1 max-w-md text-xs leading-5 text-slate-600">
                    PDF, DOC, DOCX, PPT, PPTX, ZIP,
                    JPG or PNG • Max 10 MB
                  </p>

                  <input
                    id="resource-file"
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.jpg,.jpeg,.png"
                    className="hidden"
                  />
                </label>

                {/* SELECTED FILE */}

                {file && (
                  <div className="mt-4 flex items-center justify-between rounded-2xl border border-emerald-400/10 bg-emerald-500/5 p-3.5">

                    <div className="flex min-w-0 items-center gap-3">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                        <FileText size={19} />
                      </div>

                      <div className="min-w-0">

                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold text-slate-200">
                            {file.name}
                          </p>

                          <CheckCircle2
                            size={15}
                            className="shrink-0 text-emerald-400"
                          />
                        </div>

                        <p className="mt-1 text-xs text-slate-600">
                          {(file.size / (1024 * 1024)).toFixed(
                            2
                          )}{" "}
                          MB
                        </p>

                      </div>

                    </div>

                    <button
                      type="button"
                      onClick={removeFile}
                      className="ml-3 shrink-0 rounded-lg p-2 text-slate-500 transition hover:bg-red-500/10 hover:text-red-400"
                      title="Remove file"
                    >
                      <X size={18} />
                    </button>

                  </div>
                )}

              </div>

              {/* ERROR */}

              {error && (
                <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm leading-6 text-red-300">
                  {error}
                </div>
              )}

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={loading}
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition duration-300 hover:-translate-y-0.5 hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-500/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus size={18} />

                {loading
                  ? "Submitting..."
                  : "Submit Resource"}
              </button>

              <p className="mt-4 text-center text-xs leading-5 text-slate-600">
                Your resource will be reviewed by an
                administrator before appearing publicly.
              </p>

            </div>
          </form>

        </main>
      </div>
    </AppLayout>
  );
}

export default AddResource;