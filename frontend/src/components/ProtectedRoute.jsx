import { Navigate, Outlet } from "react-router-dom";
function ProtectedRoute() {
  const token = localStorage.getItem("campusconnect_token");
  if (!token) return <Navigate to="/login" replace />;
  const user = JSON.parse(localStorage.getItem("campusconnect_user") || "{}");
  if (user.Role === "admin") return <Navigate to="/admin" replace />;
  return <Outlet />;
}
export default ProtectedRoute;
