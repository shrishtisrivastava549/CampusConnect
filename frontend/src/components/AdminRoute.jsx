import { Navigate, Outlet } from "react-router-dom";

function AdminRoute() {
  const token = localStorage.getItem(
    "campusconnect_token"
  );

  const user = JSON.parse(
    localStorage.getItem(
      "campusconnect_user"
    ) || "{}"
  );

  const role =
    user.Role ||
    user.role;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default AdminRoute;