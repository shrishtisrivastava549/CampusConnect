import { useState } from "react";
import {
  ArrowLeft,
  Plus,
  Lightbulb,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import AppLayout from "../components/AppLayout";
import api from "../api/axios";

function AddRecommendation() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem(
        "campusconnect_token"
      );

      // =========================
      // LOGIN CHECK
      // =========================

      if (!token) {
        const message =
          "Login required. Please login again.";

        setError(message);
        toast.error(message);

        navigate("/login");
        return;
      }

      // =========================
      // VALIDATION
      // =========================

      if (!title.trim()) {
        const message =
          "Recommendation Title is required.";

        setError(message);
        toast.error(message);

        setLoading(false);
        return;
      }

      if (!description.trim()) {
        const message =
          "Description is required.";

        setError(message);
        toast.error(message);

        setLoading(false);
        return;
      }

      // =========================
      // RECOMMENDATION DATA
      // =========================

      const recommendationData = {
        Title: title.trim(),
        Description: description.trim(),
        Category: category,
      };

      console.log(
        "RECOMMENDATION DATA:",
        recommendationData
      );

      // =========================
      // API REQUEST
      // =========================

      await api.post(
        "/recommendations",
        recommendationData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // =========================
      // SUCCESS
      // =========================

      toast.success(
        "Recommendation submitted successfully! It is waiting for review."
      );

      navigate("/recommendations");
    } catch (err) {
      console.error(
        "ADD RECOMMENDATION ERROR:",
        err
      );

      const message =
        err.response?.data?.message ||
        "Unable to submit recommendation. Please try again.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <main className="mx-auto max-w-3xl px-6 py-8 lg:px-8">

        {/* BACK */}

        <Link
          to="/recommendations"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600"
        >
          <ArrowLeft size={17} />
          Back to Recommendations
        </Link>

        {/* HEADER */}

        <div className="mt-6">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Lightbulb size={23} />
          </div>

          <p className="mt-5 text-sm font-medium text-blue-600">
            Campus Recommendations
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Add Recommendation
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Recommend something useful to your campus
            community.
          </p>

        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >

          {/* TITLE */}

          <div>

            <label className="text-sm font-semibold text-slate-700">
              Recommendation Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="e.g. Best DSA YouTube Playlist"
              required
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
            />

          </div>

          {/* DESCRIPTION */}

          <div className="mt-5">

            <label className="text-sm font-semibold text-slate-700">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Explain what you recommend and why it is useful..."
              rows={7}
              required
              className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
            />

          </div>

          {/* CATEGORY */}

          <div className="mt-5">

            <label className="text-sm font-semibold text-slate-700">
              Category
            </label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
            >

              <option value="resource">
                Resource
              </option>

              <option value="notes">
                Notes
              </option>

              <option value="project">
                Project
              </option>

              <option value="general">
                General
              </option>

            </select>

          </div>

          {/* ERROR */}

          {error && (
            <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >

            <Plus size={18} />

            {loading
              ? "Submitting..."
              : "Submit Recommendation"}

          </button>

          <p className="mt-3 text-center text-xs text-slate-400">
            Your recommendation will be reviewed before
            appearing publicly.
          </p>

        </form>

      </main>
    </AppLayout>
  );
}

export default AddRecommendation;