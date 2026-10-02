
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

  // Get logged-in user
  const loggedInUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  // Customer-specific cart key
  const cartKey = loggedInUser?.id
    ? `cart_user_${loggedInUser.id}`
    : "cart";

  useEffect(() => {
    console.log("CHECKOUT USER:", loggedInUser);
    console.log("CHECKOUT CART KEY:", cartKey);

    const savedCart =
      JSON.parse(localStorage.getItem(cartKey)) || [];

    console.log("CHECKOUT SAVED CART:", savedCart);

    setCart(savedCart);

    if (loggedInUser) {
      setCustomer({
        name: loggedInUser.name || "",
        email: loggedInUser.email || "",
        phone: loggedInUser.phone || "",
        address: loggedInUser.address || "",
      });
    }
  }, [cartKey]);

  const handleChange = (e) => {
    setCustomer({
      ...customer,
      [e.target.name]: e.target.value,
    });
  };

  const total = cart.reduce(
    (sum, item) =>
      sum + Number(item.price) * item.quantity,
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("PLACE ORDER CART:", cart);
    console.log(
      "PLACE ORDER STORAGE:",
      localStorage.getItem(cartKey)
    );

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    if (
      !customer.name.trim() ||
      !customer.email.trim() ||
      !customer.phone.trim() ||
      !customer.address.trim()
    ) {
      alert("Please fill all customer details.");
      return;
    }

    try {
      setLoading(true);

      if (!loggedInUser?.id || !loggedInUser?.email) {
        alert(
          "Customer account not found. Please login again."
        );

        navigate("/login");
        return;
      }

      /*
        Find correct Customer table ID
        using logged-in user's email
      */
      const customerResponse = await axios.get(
        "http://127.0.0.1:8001/customers/"
      );

      const customers = customerResponse.data || [];

      const foundCustomer = customers.find(
        (item) =>
          item.email?.toLowerCase().trim() ===
          loggedInUser.email?.toLowerCase().trim()
      );

      if (!foundCustomer) {
        alert(
          "Customer details not found. Please register again."
        );
        return;
      }

      const customerId = foundCustomer.id;

      /*
        Prepare order items
      */
      const orderItems = cart.map((item) => ({
        food_id: item.id,
        quantity: item.quantity,
        unit_price: Number(item.price),
        subtotal:
          Number(item.price) * item.quantity,
      }));

      /*
        Create order
      */
      const orderResponse = await axios.post(
        "http://127.0.0.1:8001/orders/",
        {
          customer_id: customerId,
          total_amount: total,
          items: orderItems,
        }
      );

      /*
        Save order for confirmation page
      */
      localStorage.setItem(
        "lastOrder",
        JSON.stringify({
          order: orderResponse.data,
          customer: customer,
          items: cart,
          total: total,
        })
      );

      /*
        Clear this customer's cart
      */
      localStorage.removeItem(cartKey);

      setCart([]);

      /*
        Go to confirmation page
      */
      navigate("/order-confirmation");

    } catch (error) {
      console.error(
        "Order error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.detail ||
        "Failed to place order."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="checkout-page">

      <section className="checkout-header">
        <div className="container">

          <p>CHECKOUT</p>

          <h1>Complete Your Order</h1>

          <span>
            Enter your details and review your order.
          </span>

        </div>
      </section>

      <section className="checkout-section">

        <div className="container">

          <div className="checkout-layout">

            {/* CUSTOMER FORM */}

            <div className="checkout-form-card">

              <h2>Customer Information</h2>

              <form onSubmit={handleSubmit}>

                <div className="form-group">

                  <label>Full Name</label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={customer.name}
                    onChange={handleChange}
                  />

                </div>

                <div className="form-group">

                  <label>Email</label>

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={customer.email}
                    onChange={handleChange}
                  />

                </div>

                <div className="form-group">

                  <label>Phone</label>

                  <input
                    type="text"
                    name="phone"
                    placeholder="Enter your phone number"
                    value={customer.phone}
                    onChange={handleChange}
                  />

                </div>

                <div className="form-group">

                  <label>Address</label>

                  <textarea
                    name="address"
                    placeholder="Enter your delivery address"
                    value={customer.address}
                    onChange={handleChange}
                    rows="4"
                  ></textarea>

                </div>

                <button
                  type="button"
                  className="place-order-button"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading
                    ? "Placing Order..."
                    : "Place Order"}
                </button>

              </form>

            </div>

            {/* ORDER SUMMARY */}

            <div className="checkout-summary">

              <h2>Order Summary</h2>

              {cart.length === 0 ? (

                <div className="checkout-empty">

                  <p>Your cart is empty.</p>

                  <Link to="/foods">
                    Explore Foods
                  </Link>

                </div>

              ) : (

                <>

                  <div className="checkout-items">

                    {cart.map((item) => (

                      <div
                        className="checkout-item"
                        key={item.id}
                      >

                        <div>

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

                  <div className="checkout-line"></div>

                  <div className="checkout-total">

                    <span>Total</span>

                    <strong>
                      Rs. {total}
                    </strong>

                  </div>

                </>

              )}

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Checkout;
