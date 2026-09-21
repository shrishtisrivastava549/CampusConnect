import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";

function AppLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50">
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="min-h-screen lg:pl-72">
        {/* MOBILE HEADER */}
        <header className="sticky top-0 z-30 flex h-16 items-center border-b border-slate-200 bg-white/95 px-4 shadow-sm backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 active:scale-95"
          >
            <Menu size={22} />
          </button>

          <div className="ml-3">
            <p className="text-lg font-bold leading-tight text-blue-600">
              CampusConnect
            </p>

            <p className="text-[11px] text-slate-400">
              Campus Community
            </p>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppLayout;