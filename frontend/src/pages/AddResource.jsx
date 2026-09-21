import { useState } from "react";
import { ArrowLeft, Plus, Upload, FileText, X } from "lucide-react";
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
      const token = localStorage.getItem("campusconnect_token");

      if (!token) {
        const message = "Login required. Please login again.";

        setError(message);
        toast.error(message);

        navigate("/login");
        return;
      }

      const formData = new FormData();

      formData.append("Title", title.trim());
      formData.append("Description", description.trim());
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
      <main className="mx-auto max-w-3xl px-6 py-8 lg:px-8">
        <Link
          to="/resources"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600"
        >
          <ArrowLeft size={17} />
          Back to Resources
        </Link>

        <div className="mt-6">
          <p className="text-sm font-medium text-blue-600">
            Campus Marketplace
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Add Resource
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Share a useful resource with your campus community.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          {/* Title */}
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Resource Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Data Structures Notes"
              required
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          {/* Description */}
          <div className="mt-5">
            <label className="text-sm font-semibold text-slate-700">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the resource..."
              rows={5}
              required
              className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          {/* Category + Type */}
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Category
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
              >
                <option value="Books">Books</option>
                <option value="Notes">Notes</option>
                <option value="Lab Equipment">Lab Equipment</option>
                <option value="Drafting Tools">Drafting Tools</option>
                <option value="Electronics">Electronics</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Type
              </label>

              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
              >
                <option value="Sell">Sell</option>
                <option value="Rent">Rent</option>
                <option value="Donate">Donate</option>
              </select>
            </div>
          </div>

          {/* File Upload */}
          <div className="mt-5">
            <label className="text-sm font-semibold text-slate-700">
              Resource File
              <span className="ml-1 font-normal text-slate-400">
                (optional)
              </span>
            </label>

            <label
              htmlFor="resource-file"
              className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-8 text-center transition hover:border-blue-300 hover:bg-blue-50"
            >
              <Upload size={28} className="text-blue-600" />

              <p className="mt-3 text-sm font-semibold text-slate-700">
                Click to upload a file
              </p>

              <p className="mt-1 text-xs text-slate-400">
                PDF, DOC, DOCX, PPT, PPTX, ZIP, JPG or PNG • Max 10 MB
              </p>

              <input
                id="resource-file"
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.jpg,.jpeg,.png"
                className="hidden"
              />
            </label>

            {file && (
              <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <FileText size={19} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-700">
                      {file.name}
                    </p>

                    <p className="text-xs text-slate-400">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={removeFile}
                  className="ml-3 rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
                  title="Remove file"
                >
                  <X size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={18} />

            {loading ? "Submitting..." : "Submit Resource"}
          </button>

          <p className="mt-3 text-center text-xs text-slate-400">
            Your resource will be reviewed by an administrator before
            appearing publicly.
          </p>
        </form>
      </main>
    </AppLayout>
  );
}

export default AddResource;