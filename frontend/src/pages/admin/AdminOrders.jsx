import { useEffect, useState } from "react";
import axios from "axios";
import {
  ShoppingBag,
  Eye,
  X,
  Clock,
  CheckCircle,
  ChefHat,
  Truck,
  PackageCheck,
  Ban
} from "lucide-react";

const API_URL = "http://127.0.0.1:8001";

const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Out for Delivery",
  "Delivered",
  "Cancelled"
];

function AdminOrders() {

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [selectedOrder, setSelectedOrder] = useState(null);

  const [statusUpdating, setStatusUpdating] = useState(false);


  /* =========================
     GET TOKEN
  ========================= */

  const getToken = () => {
    return localStorage.getItem("token");
  };


  /* =========================
     FETCH ORDERS
  ========================= */

  const fetchOrders = async () => {

    try {

      setLoading(true);

      const token = getToken();

      const response = await axios.get(
        `${API_URL}/orders/`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setOrders(response.data);

    } catch (error) {

      console.error(
        "Orders loading error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.detail ||
        "Failed to load orders."
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {
    fetchOrders();
  }, []);


  /* =========================
     VIEW ORDER
  ========================= */

  const handleViewOrder = async (orderId) => {

    try {

      const token = getToken();

      const response = await axios.get(
        `${API_URL}/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSelectedOrder(response.data);

    } catch (error) {

      console.error(
        "Order details error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.detail ||
        "Failed to load order details."
      );

    }

  };


  /* =========================
     UPDATE STATUS
  ========================= */

  const handleStatusChange = async (
    orderId,
    newStatus
  ) => {

    try {

      setStatusUpdating(true);

      const token = getToken();

      await axios.put(
        `${API_URL}/orders/${orderId}/status`,
        null,
        {
          params: {
            status: newStatus
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert(
        "Order status updated successfully."
      );

      await fetchOrders();


      /* Refresh modal */

      if (selectedOrder?.id === orderId) {

        const response = await axios.get(
          `${API_URL}/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setSelectedOrder(response.data);

      }

    } catch (error) {

      console.error(
        "Status update error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.detail ||
        "Failed to update order status."
      );

    } finally {

      setStatusUpdating(false);

    }

  };


  /* =========================
     STATUS ICON
  ========================= */

  const getStatusIcon = (status) => {

    switch (status) {

      case "Pending":
        return <Clock size={16} />;

      case "Confirmed":
        return <CheckCircle size={16} />;

      case "Preparing":
        return <ChefHat size={16} />;

      case "Out for Delivery":
        return <Truck size={16} />;

      case "Delivered":
        return <PackageCheck size={16} />;

      case "Cancelled":
        return <Ban size={16} />;

      default:
        return <Clock size={16} />;

    }

  };


  /* =========================
     STATUS CLASS
  ========================= */

  const getStatusClass = (status) => {

    switch (status) {

      case "Pending":
        return "order-status pending";

      case "Confirmed":
        return "order-status confirmed";

      case "Preparing":
        return "order-status preparing";

      case "Out for Delivery":
        return "order-status delivery";

      case "Delivered":
        return "order-status delivered";

      case "Cancelled":
        return "order-status cancelled";

      default:
        return "order-status";

    }

  };


  /* =========================
     FORMAT DATE
  ========================= */

  const formatDate = (date) => {

    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleString();

  };


  return (
    <main className="admin-orders-page">

      <div className="admin-orders-container">


        {/* =========================
            HEADER
        ========================= */}

        <div className="admin-orders-header">

          <div>

            <p className="admin-page-label">
              ORDER MANAGEMENT
            </p>

            <h1>
              Orders
            </h1>

            <p>
              View customer orders and manage order status.
            </p>

          </div>


          <div className="admin-orders-count">

            <ShoppingBag size={22} />

            <span>
              {orders.length} Orders
            </span>

          </div>

        </div>


        {/* =========================
            ORDERS
        ========================= */}

        <div className="admin-orders-card">

          {loading ? (

            <div className="admin-orders-message">
              Loading orders...
            </div>

          ) : orders.length === 0 ? (

            <div className="admin-orders-message">

              <ShoppingBag size={45} />

              <p>
                No orders found.
              </p>

            </div>

          ) : (

            <div className="admin-orders-table-wrapper">

              <table className="admin-orders-table">

                <thead>

                  <tr>

                    <th>
                      Order
                    </th>

                    <th>
                      Customer
                    </th>

                    <th>
                      Total
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Date
                    </th>

                    <th>
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {orders.map((order) => (

                    <tr key={order.id}>


                      {/* Order ID */}

                      <td>

                        <div className="admin-order-id">

                          <div className="admin-order-icon">
                            <ShoppingBag size={18} />
                          </div>

                          <strong>
                            #{order.id}
                          </strong>

                        </div>

                      </td>


                      {/* Customer */}

                      <td>

                        <span className="admin-order-customer">
                          Customer #{order.customer_id}
                        </span>

                      </td>


                      {/* Total */}

                      <td>

                        <strong className="admin-order-total">
                          Rs. {order.total_amount}
                        </strong>

                      </td>


                      {/* Status */}

                      <td>

                        <span
                          className={getStatusClass(
                            order.status
                          )}
                        >

                          {getStatusIcon(
                            order.status
                          )}

                          {order.status}

                        </span>

                      </td>


                      {/* Date */}

                      <td>

                        <span className="admin-order-date">
                          {formatDate(
                            order.created_at
                          )}
                        </span>

                      </td>


                      {/* Action */}

                      <td>

                        <button
                          className="view-order-button"
                          onClick={() =>
                            handleViewOrder(order.id)
                          }
                        >

                          <Eye size={17} />

                          View

                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>


      {/* =========================
          ORDER DETAILS MODAL
      ========================= */}

      {selectedOrder && (

        <div className="admin-modal-overlay">

          <div className="admin-order-modal">


            {/* Modal Header */}

            <div className="admin-modal-header">

              <div>

                <p>
                  ORDER DETAILS
                </p>

                <h2>
                  Order #{selectedOrder.id}
                </h2>

              </div>


              <button
                className="admin-modal-close"
                onClick={() =>
                  setSelectedOrder(null)
                }
              >

                <X size={22} />

              </button>

            </div>


            <div className="admin-order-modal-body">


              {/* =========================
                  ORDER INFO
              ========================= */}

              <div className="admin-order-info-grid">

                <div className="admin-order-info-box">

                  <span>
                    Customer ID
                  </span>

                  <strong>
                    #{selectedOrder.customer_id}
                  </strong>

                </div>


                <div className="admin-order-info-box">

                  <span>
                    Total Amount
                  </span>

                  <strong>
                    Rs. {selectedOrder.total_amount}
                  </strong>

                </div>


                <div className="admin-order-info-box">

                  <span>
                    Created At
                  </span>

                  <strong>
                    {formatDate(
                      selectedOrder.created_at
                    )}
                  </strong>

                </div>

              </div>


              {/* =========================
                  STATUS
              ========================= */}

              <div className="admin-order-status-section">

                <label>
                  Order Status
                </label>

                <select
                  value={selectedOrder.status}
                  disabled={statusUpdating}
                  onChange={(e) =>
                    handleStatusChange(
                      selectedOrder.id,
                      e.target.value
                    )
                  }
                >

                  {ORDER_STATUSES.map(
                    (status) => (

                      <option
                        key={status}
                        value={status}
                      >
                        {status}
                      </option>

                    )
                  )}

                </select>

                {statusUpdating && (

                  <small>
                    Updating status...
                  </small>

                )}

              </div>


              {/* =========================
                  ORDER ITEMS
              ========================= */}

              <div className="admin-order-items-section">

                <h3>
                  Order Items
                </h3>


                {selectedOrder.items &&
                selectedOrder.items.length > 0 ? (

                  <div className="admin-order-items">

                    {selectedOrder.items.map(
                      (item, index) => (

                        <div
                          className="admin-order-item"
                          key={item.id || index}
                        >

                          <div>

                            <strong>
                              Food #{item.food_id}
                            </strong>

                            <span>
                              Quantity: {item.quantity}
                            </span>

                          </div>


                          <div className="admin-order-item-price">

                            <span>
                              Rs. {item.unit_price} ×{" "}
                              {item.quantity}
                            </span>

                            <strong>
                              Rs. {item.subtotal}
                            </strong>

                          </div>

                        </div>

                      )
                    )}

                  </div>

                ) : (

                  <p className="admin-no-items">
                    No item details available.
                  </p>

                )}

              </div>


              {/* =========================
                  TOTAL
              ========================= */}

              <div className="admin-order-total-row">

                <span>
                  Total
                </span>

                <strong>
                  Rs. {selectedOrder.total_amount}
                </strong>

              </div>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}

export default AdminOrders;