import { Navigate, Outlet } from "react-router-dom";

function AdminProtectedRoute() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "Admin") {
    return <Navigate to="/foods" replace />;
  }

  return <Outlet />;
}

export default AdminProtectedRoute;