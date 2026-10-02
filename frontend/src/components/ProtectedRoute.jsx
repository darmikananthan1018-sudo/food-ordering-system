import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "Customer") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;