
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      setError("");

      // Get logged-in user
      const user = JSON.parse(
        localStorage.getItem("user") || "null"
      );

      console.log("Logged in user:", user);

      if (!user?.email) {
        setError(
          "Customer account not found. Please login again."
        );
        return;
      }

      // 1. Get all customers
      const customerResponse = await axios.get(
        `${API_URL}/customers/`
      );

      const customers = customerResponse.data || [];

      // 2. Find the customer using logged-in email
      const foundCustomer = customers.find(
        (customer) =>
          customer.email?.toLowerCase().trim() ===
          user.email?.toLowerCase().trim()
      );

      if (!foundCustomer) {
        setCurrentCustomer(null);
        setOrders([]);
        return;
      }

      setCurrentCustomer(foundCustomer);

      // 3. Get all orders
      const ordersResponse = await axios.get(
        `${API_URL}/orders/`
      );

      const allOrders = ordersResponse.data || [];

      // 4. Show ONLY this customer's orders
      const myOrders = allOrders.filter(
        (order) =>
          Number(order.customer_id) ===
          Number(foundCustomer.id)
      );

      // 5. Latest order first
      myOrders.sort(
        (a, b) => Number(b.id) - Number(a.id)
      );

      setOrders(myOrders);

    } catch (error) {
      console.error(
        "My Orders Error:",
        error.response?.data || error.message
      );

      setError(
        "Failed to load your orders. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    const value = status?.toLowerCase();

    if (value === "delivered") {
      return "status-delivered";
    }

    if (value === "cancelled") {
      return "status-cancelled";
    }

    if (value === "preparing") {
      return "status-preparing";
    }

    if (value === "confirmed") {
      return "status-confirmed";
    }

    if (value === "out for delivery") {
      return "status-out-delivery";
    }

    return "status-pending";
  };

  return (
    <main className="orders-page">

      <section className="orders-header">
        <div className="container">
          <p>YOUR ORDERS</p>

          <h1>My Orders</h1>

          <span>
            View your previous orders and track their status.
          </span>
        </div>
      </section>

      <section className="orders-section">
        <div className="container">

          {loading && (
            <div className="orders-message">
              Loading your orders...
            </div>
          )}

          {error && (
            <div className="orders-error">
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            orders.length === 0 && (
              <div className="empty-orders">

                <div className="empty-orders-icon">
                  📦
                </div>

                <h2>No Orders Yet</h2>

                <p>
                  You haven't placed any orders yet.
                </p>

                <Link
                  to="/foods"
                  className="browse-foods-button"
                >
                  Browse Foods
                </Link>

              </div>
            )}

          {!loading &&
            !error &&
            orders.length > 0 && (
              <div className="orders-list">

                {orders.map((order) => (
                  <div
                    className="order-card"
                    key={order.id}
                  >

                    <div className="order-card-top">

                      <div>
                        <span className="order-label">
                          ORDER ID
                        </span>

                        <h2>
                          #{order.id}
                        </h2>
                      </div>

                      <span
                        className={`order-status-badge ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {order.status || "Pending"}
                      </span>

                    </div>

                    <div className="order-card-info">

                      <div>
                        <span>
                          Customer
                        </span>

                        <strong>
                          {currentCustomer?.name ||
                            "Customer"}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Order Date
                        </span>

                        <strong>
                          {order.created_at
                            ? new Date(
                                order.created_at
                              ).toLocaleDateString()
                            : "N/A"}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Total Amount
                        </span>

                        <strong className="order-total">
                          Rs.{" "}
                          {Number(
                            order.total_amount
                          ).toFixed(2)}
                        </strong>
                      </div>

                    </div>

                    <div className="order-card-bottom">

                      <span>
                        Order #{order.id}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          alert(
                            `Order #${order.id}\n` +
                            `Status: ${
                              order.status || "Pending"
                            }\n` +
                            `Total: Rs. ${
                              Number(
                                order.total_amount
                              ).toFixed(2)
                            }`
                          )
                        }
                      >
                        View Details
                      </button>

                    </div>

                  </div>
                ))}

              </div>
            )}

        </div>
      </section>

    </main>
  );
}

export default MyOrders;
