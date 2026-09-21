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
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-5 py-16 text-center sm:px-6 sm:py-20">
        <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
          Learn. Share. Grow Together.
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:mt-6 sm:text-lg">
          CampusConnect helps students exchange resources,
          notes, projects, and knowledge with their campus
          community.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            to="/signup"
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 active:scale-[0.98]"
          >
            Get Started
          </Link>

          <Link
            to="/login"
            className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-100 active:scale-[0.98]"
          >
            Login
          </Link>
        </div>
      </main>
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

        {/* =========================
            PUBLIC ROUTES
        ========================== */}

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


        {/* =========================
            PROTECTED ROUTES
        ========================== */}

        <Route element={<ProtectedRoute />}>

          {/* DASHBOARD */}

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />


          {/* EXPLORE */}

          <Route
            path="/explore"
            element={<Explore />}
          />


          {/* RESOURCES */}

          <Route
            path="/resources"
            element={<Resources />}
          />

          <Route
            path="/resources/add"
            element={<AddResource />}
          />


          {/* NOTES */}

          <Route
            path="/notes"
            element={<Notes />}
          />

          <Route
            path="/notes/add"
            element={<AddNote />}
          />


          {/* PROJECTS */}

          <Route
            path="/projects"
            element={<Projects />}
          />

          <Route
            path="/projects/add"
            element={<AddProject />}
          />


          {/* QUERIES */}

          <Route
            path="/queries"
            element={<Queries />}
          />

          <Route
            path="/queries/add"
            element={<AddQuery />}
          />


          {/* RECOMMENDATIONS */}

          <Route
            path="/recommendations"
            element={<Recommendations />}
          />

          <Route
            path="/recommendations/add"
            element={<AddRecommendation />}
          />


          {/* NOTIFICATIONS */}

          <Route
            path="/notifications"
            element={<Notifications />}
          />


          {/* MY ACTIVITY */}

          <Route
            path="/activity"
            element={<MyActivity />}
          />


          {/* PROFILE */}

          <Route
            path="/profile"
            element={<Profile />}
          />

        </Route>


        {/* =========================
            ADMIN ROUTE
        ========================== */}

        <Route element={<AdminRoute />}>

          <Route
            path="/admin"
            element={<AdminDashboard />}
          />

        </Route>


        {/* =========================
            404 ROUTE
        ========================== */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;