import { Link } from "react-router-dom";

function OrderConfirmation() {
  const savedOrder =
    JSON.parse(localStorage.getItem("lastOrder")) || null;

  if (!savedOrder) {
    return (
      <main className="confirmation-page">

        <section className="confirmation-section">

          <div className="container">

            <div className="confirmation-empty">

              <div className="confirmation-icon">
                📦
              </div>

              <h1>No Order Found</h1>

              <p>
                We could not find your recent order.
              </p>

              <Link
                to="/foods"
                className="confirmation-button"
              >
                Explore Foods
              </Link>

            </div>

          </div>

        </section>

      </main>
    );
  }

  const {
    order,
    customer,
    items,
    total
  } = savedOrder;

  return (
    <main className="confirmation-page">

      {/* HEADER */}

      <section className="confirmation-header">

        <div className="container">

          <div className="success-icon">
            ✓
          </div>

          <p>ORDER CONFIRMED</p>

          <h1>
            Order Placed Successfully!
          </h1>

          <span>
            Thank you for ordering from Foodie.
          </span>

        </div>

      </section>

      {/* ORDER DETAILS */}

      <section className="confirmation-section">

        <div className="container">

          <div className="confirmation-layout">

            {/* CUSTOMER INFORMATION */}

            <div className="confirmation-card">

              <h2>
                Order Details
              </h2>

              <div className="confirmation-info">

                <div>
                  <span>Order ID</span>

                  <strong>
                    #{order.id}
                  </strong>
                </div>

                <div>
                  <span>Customer</span>

                  <strong>
                    {customer.name}
                  </strong>
                </div>

                <div>
                  <span>Email</span>

                  <strong>
                    {customer.email}
                  </strong>
                </div>

                <div>
                  <span>Phone</span>

                  <strong>
                    {customer.phone}
                  </strong>
                </div>

                <div>
                  <span>Address</span>

                  <strong>
                    {customer.address}
                  </strong>
                </div>

                <div>
                  <span>Status</span>

                  <strong className="order-status">
                    {order.status || "Pending"}
                  </strong>
                </div>

              </div>

            </div>

            {/* ORDER ITEMS */}

            <div className="confirmation-card">

              <h2>
                Ordered Foods
              </h2>

              <div className="confirmation-items">

                {items.map((item) => (

                  <div
                    className="confirmation-item"
                    key={item.id}
                  >

                    <div className="confirmation-item-image">

                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                        />
                      ) : (
                        <span>
                          🍽️
                        </span>
                      )}

                    </div>

                    <div className="confirmation-item-details">

                      <h3>
                        {item.name}
                      </h3>

                      <p>
                        {item.quantity} × Rs.{" "}
                        {item.price}
                      </p>

                    </div>

                    <strong>
                      Rs.{" "}
                      {Number(item.price) *
                        item.quantity}
                    </strong>

                  </div>

                ))}

              </div>

              <div className="confirmation-line"></div>

              <div className="confirmation-total">

                <span>
                  Total Amount
                </span>

                <strong>
                  Rs. {total}
                </strong>

              </div>

            </div>

          </div>

          {/* BUTTONS */}

          <div className="confirmation-buttons">

            <Link
              to="/foods"
              className="confirmation-button"
            >
              Continue Shopping
            </Link>

            <Link
              to="/my-orders"
              className="confirmation-secondary-button"
            >
              View My Orders
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}

export default OrderConfirmation;