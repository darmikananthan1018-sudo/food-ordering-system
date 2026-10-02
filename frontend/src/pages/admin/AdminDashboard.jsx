import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Utensils,
  ShoppingBag,
  Users,
  FolderOpen,
  Clock,
  CheckCircle,
  TrendingUp,
  RefreshCw,
  ExternalLink
} from "lucide-react";
import axios from "axios";

function AdminDashboard() {
  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://127.0.0.1:8001/admin/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setStats(response.data);
    } catch (err) {
      console.error("Dashboard error:", err);

      setError(
        err.response?.data?.detail ||
        "Failed to load dashboard statistics."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const totalFoods =
    stats?.total_foods ?? 0;

  const totalCategories =
    stats?.total_categories ?? 0;

  const totalCustomers =
    stats?.total_customers ?? 0;

  const totalOrders =
    stats?.total_orders ?? 0;

  const revenue =
    stats?.total_revenue ??
    stats?.revenue ??
    0;

  const pendingOrders =
    stats?.pending_orders ??
    stats?.pending ??
    0;

  const deliveredOrders =
    stats?.delivered_orders ??
    stats?.delivered ??
    0;

  const popularFood =
    stats?.popular_food;

  const popularFoodName =
    typeof popularFood === "object"
      ? popularFood?.name
      : stats?.popular_food_name;

  const popularFoodQuantity =
    typeof popularFood === "object"
      ? popularFood?.quantity
      : stats?.popular_food_quantity;

  return (
    <main className="admin-dashboard-page">

      <div className="admin-dashboard-container">

        {/* Header */}

        <div className="admin-dashboard-header">

          <div>
            <p className="admin-dashboard-label">
              ADMIN PANEL
            </p>

            <h1>
              Welcome, {user?.name || "Admin"}
            </h1>

            <p>
              Manage your Foodie ordering system
              from one place.
            </p>

            <Link
              to="/"
              className="view-foodie-button"
            >
              <ExternalLink size={17} />
              View Foodie App
            </Link>
          </div>

          <div className="admin-dashboard-icon">
            <LayoutDashboard size={32} />
          </div>

        </div>


        {/* Error */}

        {error && (
          <div className="admin-dashboard-error">

            <span>{error}</span>

            <button onClick={fetchDashboard}>
              <RefreshCw size={16} />
              Retry
            </button>

          </div>
        )}


        {/* Statistics */}

        {loading ? (

          <div className="admin-dashboard-loading">

            <RefreshCw
              size={28}
              className="loading-icon"
            />

            <p>
              Loading dashboard statistics...
            </p>

          </div>

        ) : (

          <>

            <div className="admin-stats-grid">

              {/* Total Foods */}

              <div className="admin-stat-card">

                <div className="admin-stat-icon">
                  <Utensils size={24} />
                </div>

                <div>
                  <span>Total Foods</span>
                  <h2>{totalFoods}</h2>
                </div>

              </div>


              {/* Total Categories */}

              <div className="admin-stat-card">

                <div className="admin-stat-icon">
                  <FolderOpen size={24} />
                </div>

                <div>
                  <span>Total Categories</span>
                  <h2>{totalCategories}</h2>
                </div>

              </div>


              {/* Total Customers */}

              <div className="admin-stat-card">

                <div className="admin-stat-icon">
                  <Users size={24} />
                </div>

                <div>
                  <span>Total Customers</span>
                  <h2>{totalCustomers}</h2>
                </div>

              </div>


              {/* Total Orders */}

              <div className="admin-stat-card">

                <div className="admin-stat-icon">
                  <ShoppingBag size={24} />
                </div>

                <div>
                  <span>Total Orders</span>
                  <h2>{totalOrders}</h2>
                </div>

              </div>


              {/* Revenue */}

              <div className="admin-stat-card revenue-card">

                <div className="admin-stat-icon">
                  <TrendingUp size={24} />
                </div>

                <div>
                  <span>Total Revenue</span>

                  <h2>
                    Rs.{" "}
                    {Number(revenue).toLocaleString()}
                  </h2>
                </div>

              </div>


              {/* Pending Orders */}

              <div className="admin-stat-card">

                <div className="admin-stat-icon">
                  <Clock size={24} />
                </div>

                <div>
                  <span>Pending Orders</span>
                  <h2>{pendingOrders}</h2>
                </div>

              </div>


              {/* Delivered Orders */}

              <div className="admin-stat-card">

                <div className="admin-stat-icon">
                  <CheckCircle size={24} />
                </div>

                <div>
                  <span>Delivered Orders</span>
                  <h2>{deliveredOrders}</h2>
                </div>

              </div>


              {/* Popular Food */}

              <div className="admin-stat-card popular-food-card">

                <div className="admin-stat-icon">
                  <Utensils size={24} />
                </div>

                <div>
                  <span>Popular Food</span>

                  <h2>
                    {popularFoodName || "No data"}
                  </h2>

                  {popularFoodQuantity !== undefined && (
                    <small>
                      {popularFoodQuantity} ordered
                    </small>
                  )}

                </div>

              </div>

            </div>


            {/* Management */}

            <div className="admin-dashboard-section-title">

              <h2>Management</h2>

              <p>
                Quickly access your admin modules.
              </p>

            </div>


            <div className="admin-dashboard-grid">

              <Link
                to="/admin/categories"
                className="admin-dashboard-card"
              >
                <div className="admin-card-icon">
                  <FolderOpen size={25} />
                </div>

                <h2>Categories</h2>

                <p>
                  Add, update and delete food
                  categories.
                </p>
              </Link>


              <Link
                to="/admin/foods"
                className="admin-dashboard-card"
              >
                <div className="admin-card-icon">
                  <Utensils size={25} />
                </div>

                <h2>Foods</h2>

                <p>
                  Create foods, change prices,
                  manage availability and delete foods.
                </p>
              </Link>


              <Link
                to="/admin/orders"
                className="admin-dashboard-card"
              >
                <div className="admin-card-icon">
                  <ShoppingBag size={25} />
                </div>

                <h2>Orders</h2>

                <p>
                  View customer orders and
                  update order status.
                </p>
              </Link>


              <Link
                to="/admin/customers"
                className="admin-dashboard-card"
              >
                <div className="admin-card-icon">
                  <Users size={25} />
                </div>

                <h2>Customers</h2>

                <p>
                  View and manage customer
                  information.
                </p>
              </Link>

            </div>

          </>

        )}

      </div>

    </main>
  );
}

export default AdminDashboard;