import { useState } from "react";
import {
  ArrowLeft,
  Plus,
  Lightbulb,
  Sparkles,
  MessageCircle,
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

      if (!token) {
        const message =
          "Login required. Please login again.";

        setError(message);
        toast.error(message);

        navigate("/login");
        return;
      }

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

      const recommendationData = {
        Title: title.trim(),
        Description: description.trim(),
        Category: category,
      };

      console.log(
        "RECOMMENDATION DATA:",
        recommendationData
      );

      await api.post(
        "/recommendations",
        recommendationData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
      <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-6 sm:px-6 lg:px-8">
        {/* BACKGROUND GLOW */}

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute right-0 top-24 h-96 w-96 rounded-full bg-violet-600/15 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-3xl">
          {/* BACK */}

          <Link
            to="/recommendations"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-400"
          >
            <ArrowLeft size={17} />
            Back to Recommendations
          </Link>

          {/* HERO */}

          <section className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-600/20 via-slate-900/80 to-violet-600/20 p-6 shadow-2xl shadow-blue-950/30 backdrop-blur-xl sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-400">
                <Lightbulb size={27} />
              </div>

              <div>
                <div className="mb-2 inline-flex items-center gap-2 text-xs font-semibold text-blue-300">
                  <Sparkles size={14} />
                  Share Something Useful
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Add Recommendation
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Recommend something useful to your
                  campus community.
                </p>
              </div>
            </div>
          </section>

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl sm:p-7"
          >
            {/* TITLE */}

            <div>
              <label className="text-sm font-semibold text-slate-200">
                Recommendation Title
              </label>

              <p className="mt-1 text-xs text-slate-600">
                Give your recommendation a clear title.
              </p>

              <input
                type="text"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="e.g. Best DSA YouTube Playlist"
                required
                className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3.5 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-blue-500/50 focus:bg-slate-900 focus:ring-4 focus:ring-blue-500/5"
              />
            </div>

            {/* DESCRIPTION */}

            <div className="mt-6">
              <label className="text-sm font-semibold text-slate-200">
                Description
              </label>

              <p className="mt-1 text-xs text-slate-600">
                Explain what you recommend and why it is
                useful.
              </p>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="Explain what you recommend and why it is useful..."
                rows={7}
                required
                className="mt-3 w-full resize-none rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3.5 text-sm leading-6 text-white outline-none placeholder:text-slate-600 transition focus:border-blue-500/50 focus:bg-slate-900 focus:ring-4 focus:ring-blue-500/5"
              />
            </div>

            {/* CATEGORY */}

            <div className="mt-6">
              <label className="text-sm font-semibold text-slate-200">
                Category
              </label>

              <p className="mt-1 text-xs text-slate-600">
                Choose the category that best fits your
                recommendation.
              </p>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3.5 text-sm text-slate-300 outline-none transition focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5"
              >
                <option
                  value="resource"
                  className="bg-slate-900"
                >
                  Resource
                </option>

                <option
                  value="notes"
                  className="bg-slate-900"
                >
                  Notes
                </option>

                <option
                  value="project"
                  className="bg-slate-900"
                >
                  Project
                </option>

                <option
                  value="general"
                  className="bg-slate-900"
                >
                  General
                </option>
              </select>
            </div>

            {/* ERROR */}

            {error && (
              <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                {error}
              </div>
            )}

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={loading}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:-translate-y-0.5 hover:shadow-blue-900/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Submitting...
                </>
              ) : (
                <>
                  <Plus size={18} />
                  Submit Recommendation
                </>
              )}
            </button>

            <p className="mt-4 text-center text-xs text-slate-600">
              Your recommendation will be reviewed before
              appearing publicly.
            </p>
          </form>

          {/* TIP */}

          <div className="mt-5 flex gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <MessageCircle
              size={18}
              className="mt-0.5 shrink-0 text-blue-400"
            />

            <p className="text-xs leading-5 text-slate-500">
              Tip: Share recommendations that can
              genuinely help other students with their
              studies, projects, or campus life.
            </p>
          </div>
        </div>
      </main>
    </AppLayout>
  );
}

export default AddRecommendation;