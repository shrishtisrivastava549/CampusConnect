import { useState } from "react";
import { Menu, Sparkles } from "lucide-react";
import Sidebar from "./Sidebar";

function AppLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950">
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="min-h-screen lg:pl-72">
        {/* MOBILE HEADER */}

        <header className="sticky top-0 z-30 flex h-16 items-center border-b border-white/10 bg-slate-950/90 px-4 shadow-xl shadow-black/10 backdrop-blur-xl lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-all duration-300 hover:border-blue-400/20 hover:bg-blue-500/10 hover:text-blue-400 active:scale-95"
          >
            <Menu size={21} />
          </button>

          <div className="ml-3 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/20">
              <Sparkles size={16} />
            </div>

            <div>
              <p className="text-base font-bold leading-tight text-white">
                CampusConnect
              </p>

              <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-slate-600">
                Campus Community
              </p>
            </div>
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