import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderOpen,
  Utensils,
  ShoppingBag,
  Users,
  LogOut
} from "lucide-react";

function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("adminToken");

    navigate("/login");
  };

  return (
    <aside className="admin-sidebar">

      {/* Sidebar Header */}

      <div className="admin-sidebar-header">

        <div className="admin-sidebar-logo">
          <Utensils size={24} />
        </div>

        <div>
          <h2>Foodie</h2>
          <span>Admin Panel</span>
        </div>

      </div>


      {/* Navigation */}

      <nav className="admin-sidebar-nav">

        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            isActive
              ? "admin-nav-link active"
              : "admin-nav-link"
          }
        >
          <LayoutDashboard size={19} />
          <span>Dashboard</span>
        </NavLink>


        <NavLink
          to="/admin/categories"
          className={({ isActive }) =>
            isActive
              ? "admin-nav-link active"
              : "admin-nav-link"
          }
        >
          <FolderOpen size={19} />
          <span>Categories</span>
        </NavLink>


        <NavLink
          to="/admin/foods"
          className={({ isActive }) =>
            isActive
              ? "admin-nav-link active"
              : "admin-nav-link"
          }
        >
          <Utensils size={19} />
          <span>Foods</span>
        </NavLink>


        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            isActive
              ? "admin-nav-link active"
              : "admin-nav-link"
          }
        >
          <ShoppingBag size={19} />
          <span>Orders</span>
        </NavLink>


        <NavLink
          to="/admin/customers"
          className={({ isActive }) =>
            isActive
              ? "admin-nav-link active"
              : "admin-nav-link"
          }
        >
          <Users size={19} />
          <span>Customers</span>
        </NavLink>

      </nav>


      {/* Logout */}

      <div className="admin-sidebar-footer">

        <button
          onClick={handleLogout}
          className="admin-logout-button"
        >
          <LogOut size={19} />
          <span>Logout</span>
        </button>

      </div>

    </aside>
  );
}

export default AdminSidebar;