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
      path: "/resources",
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

  return (
    <>
      {/* MOBILE OVERLAY */}

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* SIDEBAR */}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        {/* HEADER */}

        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">

          <Link
            to="/dashboard"
            onClick={handleLinkClick}
            className="text-xl font-bold text-blue-600"
          >
            CampusConnect
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <X size={20} />
          </button>

        </div>

        {/* NAVIGATION */}

        <div className="flex-1 overflow-y-auto px-4 py-6">

          {/* CAMPUS */}

          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Campus
          </p>

          <nav className="space-y-1">

            {campusLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={handleLinkClick}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                  }`}
                >
                  <Icon size={19} />

                  <span>{link.name}</span>
                </Link>
              );
            })}

          </nav>

          {/* PERSONAL */}

          <p className="mb-3 mt-8 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Personal
          </p>

          <nav className="space-y-1">

            {personalLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={handleLinkClick}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                  }`}
                >
                  <Icon size={19} />

                  <span>{link.name}</span>
                </Link>
              );
            })}

          </nav>

        </div>

        {/* BOTTOM */}

        <div className="border-t border-slate-200 p-4">

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut size={19} />

            <span>Logout</span>
          </button>

        </div>

      </aside>
    </>
  );
}

export default Sidebar;