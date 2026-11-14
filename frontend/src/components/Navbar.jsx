import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        {/* LOGO */}

        <Link
          to="/"
          className="group flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/20 transition duration-300 group-hover:scale-105">
            <Sparkles size={18} />
          </div>

          <div>
            <p className="text-lg font-bold leading-tight text-white sm:text-xl">
              CampusConnect
            </p>

            <p className="hidden text-[9px] font-medium uppercase tracking-[0.18em] text-slate-600 sm:block">
              Campus Community
            </p>
          </div>
        </Link>

        {/* NAVIGATION */}

        <div className="flex items-center gap-2 sm:gap-5">
          <Link
            to="/"
            className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white sm:block"
          >
            Home
          </Link>

          <Link
            to="/login"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="group inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-blue-500/30 active:scale-95"
          >
            <span>Sign Up</span>

            <ArrowRight
              size={15}
              className="transition group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;