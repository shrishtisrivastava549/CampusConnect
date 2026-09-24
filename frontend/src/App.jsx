import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Explore from "./pages/Explore";

import Resources from "./pages/Resources";
import AddResource from "./pages/AddResource";

import Notes from "./pages/Notes";
import AddNote from "./pages/AddNote";

import Projects from "./pages/Projects";
import AddProject from "./pages/AddProject";

import Queries from "./pages/Queries";
import AddQuery from "./pages/AddQuery";

import Recommendations from "./pages/Recommendations";
import AddRecommendation from "./pages/AddRecommendation";

import Notifications from "./pages/Notifications";
import MyActivity from "./pages/MyActivity";
import Profile from "./pages/Profile";

import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";


function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <Navbar />

      {/* HERO */}
      <main className="relative">
        {/* Background glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 -z-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="pointer-events-none absolute right-[-150px] top-40 -z-0 h-[350px] w-[350px] rounded-full bg-purple-600/20 blur-[100px]" />

        <section className="relative z-10 mx-auto max-w-7xl px-5 pb-20 pt-20 sm:px-6 sm:pb-28 sm:pt-28">
          <div className="mx-auto max-w-4xl text-center">

            {/* Badge */}
            <div className="mx-auto mb-6 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-blue-200 shadow-lg backdrop-blur-md">
              ✨ Built for students, powered by community
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Learn.
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
                {" "}Share.
              </span>
              <br />
              Grow Together.
            </h1>

            {/* Description */}
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              CampusConnect brings students together to share resources,
              notes, projects, recommendations, and knowledge — all in one
              campus community.
            </p>

            {/* Buttons */}
            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                to="/signup"
                className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/20 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/30 active:scale-95"
              >
                Get Started →
              </Link>

              <Link
                to="/login"
                className="rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 font-semibold text-white backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white/10 active:scale-95"
              >
                Login
              </Link>
            </div>
          </div>

          {/* FLOATING CARDS */}
          <div className="relative mx-auto mt-16 max-w-5xl sm:mt-20">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl sm:p-8">
              <div className="grid gap-4 sm:grid-cols-3">

                {/* Resources */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/10">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/20 text-xl">
                    📚
                  </div>

                  <h3 className="font-semibold">
                    Resources
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Discover useful study material shared by students.
                  </p>
                </div>

                {/* Notes */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/10">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/20 text-xl">
                    📝
                  </div>

                  <h3 className="font-semibold">
                    Notes
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Share and explore notes from your campus community.
                  </p>
                </div>

                {/* Projects */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:-translate-y-1 hover:bg-white/10">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/20 text-xl">
                    🚀
                  </div>

                  <h3 className="font-semibold">
                    Projects
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Find inspiration and collaborate on student projects.
                  </p>
                </div>

              </div>
            </div>
          </div>

          {/* STATS */}
          <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-md">
              <p className="text-2xl font-bold text-white">
                120+
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Resources
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-md">
              <p className="text-2xl font-bold text-white">
                450+
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Students
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-md">
              <p className="text-2xl font-bold text-white">
                35+
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Projects
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-md">
              <p className="text-2xl font-bold text-white">
                89+
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Notes
              </p>
            </div>

          </div>
        </section>

        {/* COMMUNITY SECTION */}
        <section className="border-t border-white/10 bg-white/[0.02]">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24">

            <div className="grid items-center gap-12 lg:grid-cols-2">

              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
                  Your Campus. Your Community.
                </p>

                <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
                  Everything students need,
                  <span className="text-blue-400">
                    {" "}in one place.
                  </span>
                </h2>

                <p className="mt-5 max-w-xl leading-7 text-slate-400">
                  From finding study resources to sharing your own knowledge,
                  CampusConnect makes it easier for students to learn from
                  each other.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">

                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                  <div className="text-3xl">🔍</div>
                  <h3 className="mt-4 font-semibold">
                    Explore
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Find resources shared by your community.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                  <div className="text-3xl">🤝</div>
                  <h3 className="mt-4 font-semibold">
                    Connect
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Learn and collaborate with fellow students.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                  <div className="text-3xl">💡</div>
                  <h3 className="mt-4 font-semibold">
                    Share
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Contribute your own knowledge and ideas.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                  <div className="text-3xl">⭐</div>
                  <h3 className="mt-4 font-semibold">
                    Grow
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Build a stronger campus community together.
                  </p>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-5 py-20 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-blue-400/20 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-500/20 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-14">

            <h2 className="text-3xl font-bold sm:text-4xl">
              Ready to connect with your campus?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-slate-300">
              Join CampusConnect and start sharing, discovering, and learning
              together.
            </p>

            <Link
              to="/signup"
              className="mt-8 inline-block rounded-xl bg-white px-7 py-3.5 font-semibold text-slate-900 transition duration-300 hover:-translate-y-1 hover:bg-slate-100 active:scale-95"
            >
              Join CampusConnect →
            </Link>

          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-black/20">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-8 text-sm text-slate-400 sm:flex-row sm:px-6">

          <p>
            © 2026 CampusConnect
          </p>

          <p>
            Learn. Share. Grow Together.
          </p>

        </div>
      </footer>
    </div>
  );
}


function App() {
  return (
    <BrowserRouter>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: "500",
          },
        }}
      />

      <Routes>

        {/* PUBLIC ROUTES */}
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        {/* PROTECTED ROUTES */}
        <Route element={<ProtectedRoute />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/explore"
            element={<Explore />}
          />

          <Route
            path="/resources"
            element={<Resources />}
          />

          <Route
            path="/resources/add"
            element={<AddResource />}
          />

          <Route
            path="/notes"
            element={<Notes />}
          />

          <Route
            path="/notes/add"
            element={<AddNote />}
          />

          <Route
            path="/projects"
            element={<Projects />}
          />

          <Route
            path="/projects/add"
            element={<AddProject />}
          />

          <Route
            path="/queries"
            element={<Queries />}
          />

          <Route
            path="/queries/add"
            element={<AddQuery />}
          />

          <Route
            path="/recommendations"
            element={<Recommendations />}
          />

          <Route
            path="/recommendations/add"
            element={<AddRecommendation />}
          />

          <Route
            path="/notifications"
            element={<Notifications />}
          />

          <Route
            path="/activity"
            element={<MyActivity />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

        </Route>

        {/* ADMIN ROUTE */}
        <Route element={<AdminRoute />}>

          <Route
            path="/admin"
            element={<AdminDashboard />}
          />

        </Route>

        {/* 404 ROUTE */}
        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;