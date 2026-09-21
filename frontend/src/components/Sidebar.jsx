import {
  LayoutDashboard,
  Search,
  BookOpen,
  FileText,
  FolderKanban,
  HelpCircle,
  Star,
  Bell,
  Activity,
  User,
  LogOut,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

function Sidebar({ mobileOpen, setMobileOpen }) {
  const navigate = useNavigate();

  const menuItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      label: "Explore",
      icon: Search,
      path: "/explore",
    },
    {
      label: "Resources",
      icon: BookOpen,
      path: "/resources",
    },
    {
      label: "Notes",
      icon: FileText,
      path: "/notes",
    },
    {
      label: "Projects",
      icon: FolderKanban,
      path: "/projects",
    },
    {
      label: "Queries",
      icon: HelpCircle,
      path: "/queries",
    },
    {
      label: "Recommendations",
      icon: Star,
      path: "/recommendations",
    },
  ];

  const bottomItems = [
    {
      label: "Notifications",
      icon: Bell,
      path: "/notifications",
    },
    {
      label: "My Activity",
      icon: Activity,
      path: "/activity",
    },
    {
      label: "Profile",
      icon: User,
      path: "/profile",
    },
  ];

  const closeMobileSidebar = () => {
    if (setMobileOpen) {
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("campusconnect_token");
    localStorage.removeItem("campusconnect_user");

    closeMobileSidebar();
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px] lg:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-slate-200 bg-white shadow-sm transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-slate-100 px-6">
          <NavLink
            to="/dashboard"
            onClick={closeMobileSidebar}
            className="text-2xl font-bold tracking-tight text-blue-600 transition hover:text-blue-700"
          >
            CampusConnect
          </NavLink>

          <button
            type="button"
            onClick={closeMobileSidebar}
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {/* Campus */}
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Campus
          </p>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileSidebar}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={19}
                        className={`shrink-0 transition ${
                          isActive
                            ? "text-blue-600"
                            : "text-slate-400 group-hover:text-slate-700"
                        }`}
                      />

                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Personal */}
          <p className="mb-3 mt-8 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Personal
          </p>

          <nav className="space-y-1">
            {bottomItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileSidebar}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={19}
                        className={`shrink-0 transition ${
                          isActive
                            ? "text-blue-600"
                            : "text-slate-400 group-hover:text-slate-700"
                        }`}
                      />

                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Logout */}
        <div className="shrink-0 border-t border-slate-100 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50 hover:text-red-600"
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