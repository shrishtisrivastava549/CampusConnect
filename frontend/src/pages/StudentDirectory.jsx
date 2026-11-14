import { useEffect, useState } from "react";
import { Search, Users } from "lucide-react";
import AppLayout from "../components/AppLayout";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function StudentDirectory() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("campusconnect_user") || "{}");
  const token = localStorage.getItem("campusconnect_token");
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const response = await api.get(`/directory/students?search=${encodeURIComponent(search)}`, { headers: { Authorization: `Bearer ${token}` } });
        setStudents(response.data.students || []);
      } catch (error) { toast.error(error.response?.data?.message || "Unable to load student directory."); }
      finally { setLoading(false); }
    }, 250);
    return () => clearTimeout(timer);
  }, [search, token]);
  return <AppLayout><main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6"><div className="mx-auto max-w-6xl"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><div className="flex items-center gap-2 text-blue-300"><Users size={20}/><span className="text-sm font-semibold uppercase tracking-wider">CampusConnect</span></div><h1 className="mt-2 text-3xl font-bold">Student Directory</h1><p className="mt-2 text-sm text-slate-400">{user.Role === "faculty" ? `Showing approved students in ${user.Department || "your department"}.` : "Search approved students across all departments."}</p></div><div className="relative w-full sm:max-w-sm"><Search className="absolute left-3 top-3.5 text-slate-500" size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, course, department, email" className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500"/></div></div><div className="mt-7 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"><div className="border-b border-white/10 px-5 py-4 text-sm text-slate-400">{loading ? "Loading students…" : `${students.length} approved student${students.length===1?"":"s"}`}</div>{!loading && students.length===0 ? <div className="p-10 text-center text-slate-400">No students found.</div> : <div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-sm"><thead className="bg-white/[0.04] text-xs uppercase tracking-wide text-slate-500"><tr>{["Name","Email","Phone","Course","Department","Year","Semester"].map(x=><th key={x} className="px-4 py-4">{x}</th>)}</tr></thead><tbody>{students.map(student=><tr key={student._id} className="border-t border-white/5 text-slate-300"><td className="px-4 py-4 font-medium text-white">{student.Name}</td><td className="px-4 py-4">{student.CollegeEmail || student.PersonalEmail || "—"}</td><td className="px-4 py-4">{student.Phone || "—"}</td><td className="px-4 py-4">{student.Course || "—"}</td><td className="px-4 py-4">{student.Department || "—"}</td><td className="px-4 py-4">{student.AcademicYear || "—"}</td><td className="px-4 py-4">{student.Semester || "—"}</td></tr>)}</tbody></table></div>}</div></div></main></AppLayout>;
}
