import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Compass,
  Package,
  FileText,
  FolderKanban,
  MessageCircleQuestion,
  Lightbulb,
  Bell,
  Activity,
  User,
  LogOut,
  X,
  Sparkles,
} from "lucide-react";

function Sidebar({ mobileOpen, setMobileOpen }) {
  const location = useLocation();
  const navigate = useNavigate();

  const campusLinks = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Explore",
      path: "/explore",
      icon: Compass,
    },
    {
      name: "Resources",
      path: "/resources",
      icon: Package,
    },
    {
      name: "Notes",
      path: "/notes",
      icon: FileText,
    },
    {
      name: "Projects",
      path: "/projects",
      icon: FolderKanban,
    },
    {
      name: "Queries",
      path: "/queries",
      icon: MessageCircleQuestion,
    },
    {
      name: "Recommendations",
      path: "/recommendations",
      icon: Lightbulb,
    },
  ];

  const personalLinks = [
    {
      name: "Notifications",
      path: "/notifications",
      icon: Bell,
    },
    {
      name: "My Activity",
      path: "/activity",
      icon: Activity,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: User,
    },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem("campusconnect_token");
    localStorage.removeItem("campusconnect_user");

    navigate("/login");
  };

  const handleLinkClick = () => {
    if (setMobileOpen) {
      setMobileOpen(false);
    }
  };

  const renderLinks = (links) => {
    return links.map((link) => {
      const Icon = link.icon;
      const active = isActive(link.path);

      return (
        <Link
          key={link.name}
          to={link.path}
          onClick={handleLinkClick}
          className="group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-300"
          style={{
            background: active
              ? "rgba(59, 130, 246, 0.12)"
              : "transparent",
            color: active ? "#93c5fd" : "#94a3b8",
          }}
        >
          {active && (
            <span
              className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full"
              style={{
                background: "#3b82f6",
                boxShadow: "0 0 12px rgba(59, 130, 246, 0.7)",
              }}
            />
          )}

          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all duration-300"
            style={{
              background: active
                ? "rgba(59, 130, 246, 0.15)"
                : "rgba(255, 255, 255, 0.03)",
              color: active ? "#60a5fa" : "#64748b",
            }}
          >
            <Icon size={18} />
          </span>

          <span className="truncate">{link.name}</span>

          {active && (
            <span
              className="ml-auto h-1.5 w-1.5 rounded-full"
              style={{
                background: "#60a5fa",
                boxShadow: "0 0 10px rgba(96, 165, 250, 0.8)",
              }}
            />
          )}
        </Link>
      );
    });
  };

  return (
    <>
      {/* MOBILE OVERLAY */}

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{
            background: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(6px)",
          }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* SIDEBAR */}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
        style={{
          background: "#020617",
          borderRight: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "10px 0 40px rgba(0, 0, 0, 0.25)",
        }}
      >
        {/* BACKGROUND GLOW */}

        <div
          className="pointer-events-none absolute left-[-100px] top-[-100px] h-64 w-64 rounded-full"
          style={{
            background: "rgba(37, 99, 235, 0.12)",
            filter: "blur(70px)",
          }}
        />

        <div
          className="pointer-events-none absolute bottom-[-120px] right-[-100px] h-64 w-64 rounded-full"
          style={{
            background: "rgba(147, 51, 234, 0.1)",
            filter: "blur(70px)",
          }}
        />

        {/* HEADER */}

        <div
          className="relative flex h-20 items-center justify-between px-5"
          style={{
            borderBottom:
              "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <Link
            to="/dashboard"
            onClick={handleLinkClick}
            className="group flex items-center gap-3"
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl text-white transition duration-300 group-hover:scale-105"
              style={{
                background:
                  "linear-gradient(135deg, #3b82f6, #9333ea)",
                boxShadow:
                  "0 8px 25px rgba(59, 130, 246, 0.25)",
              }}
            >
              <Sparkles size={19} />
            </div>

            <div>
              <p className="text-lg font-bold leading-tight text-white">
                CampusConnect
              </p>

              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">
                Campus Community
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation menu"
            className="rounded-xl p-2 text-slate-500 transition hover:text-white lg:hidden"
            style={{
              background: "rgba(255, 255, 255, 0.04)",
              border:
                "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <X size={19} />
          </button>
        </div>

        {/* NAVIGATION */}

        <div className="relative flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
            Campus
          </p>

          <nav className="space-y-1">
            {renderLinks(campusLinks)}
          </nav>

          <p className="mb-3 mt-8 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
            Personal
          </p>

          <nav className="space-y-1">
            {renderLinks(personalLinks)}
          </nav>

          {/* COMMUNITY CARD */}

          <div
            className="mt-8 overflow-hidden rounded-2xl p-4"
            style={{
              background:
                "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(147,51,234,0.06), rgba(0,0,0,0))",
              border:
                "1px solid rgba(96,165,250,0.12)",
            }}
          >
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg"
              style={{
                background: "rgba(59,130,246,0.1)",
                color: "#60a5fa",
              }}
            >
              <Sparkles size={17} />
            </div>

            <p className="mt-3 text-sm font-semibold text-slate-200">
              Keep connecting
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Share knowledge and grow with your campus community.
            </p>
          </div>
        </div>

        {/* LOGOUT */}

        <div
          className="relative p-4"
          style={{
            borderTop:
              "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <button
            type="button"
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-300"
            style={{
              color: "#94a3b8",
            }}
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-lg"
              style={{
                background: "rgba(239, 68, 68, 0.06)",
                color: "#f87171",
              }}
            >
              <LogOut size={18} />
            </span>

            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;