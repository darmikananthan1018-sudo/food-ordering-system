import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

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

  // =====================================================
  // LOGGED-IN USER
  // =====================================================

  const loggedInUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  // =====================================================
  // CUSTOMER CART KEY
  // =====================================================

  const cartKey = loggedInUser?.id
    ? `cart_user_${loggedInUser.id}`
    : "cart";

  // =====================================================
  // LOAD CART + USER DETAILS
  // =====================================================

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

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    setCustomer({
      ...customer,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================================
  // TOTAL
  // =====================================================

  const total = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.price) * Number(item.quantity),
    0
  );

  // =====================================================
  // PLACE ORDER
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("================================");
    console.log("PLACE ORDER STARTED");
    console.log("================================");

    console.log("LOGGED USER:", loggedInUser);
    console.log("CUSTOMER FORM:", customer);
    console.log("CART:", cart);
    console.log("TOTAL:", total);

    // ===================================================
    // CART CHECK
    // ===================================================

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    // ===================================================
    // LOGIN CHECK
    // ===================================================

    if (!loggedInUser?.id || !loggedInUser?.email) {
      alert("Please login again.");
      navigate("/login");
      return;
    }

    // ===================================================
    // CUSTOMER DETAILS CHECK
    // ===================================================

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

      // =================================================
      // STEP 1
      // FIND CUSTOMER
      // =================================================

      const loginEmail = loggedInUser.email
        .trim()
        .toLowerCase();

      console.log(
        "Looking for customer:",
        loginEmail
      );

      const customerResponse = await axios.get(
        `${API_URL}/customers/`
      );

      const customers = Array.isArray(
        customerResponse.data
      )
        ? customerResponse.data
        : [];

      console.log(
        "ALL CUSTOMERS:",
        customers
      );

      let foundCustomer = customers.find(
        (item) =>
          item.email?.trim().toLowerCase() ===
          loginEmail
      );

      // =================================================
      // STEP 2
      // IF CUSTOMER DOES NOT EXIST
      // CREATE AUTOMATICALLY
      // =================================================

      if (!foundCustomer) {
        console.log(
          "Customer not found."
        );

        console.log(
          "Creating customer automatically..."
        );

        const newCustomerData = {
          name: customer.name.trim(),
          email: loggedInUser.email.trim(),
          phone: customer.phone.trim(),
          address: customer.address.trim(),
        };

        console.log(
          "NEW CUSTOMER DATA:",
          newCustomerData
        );

        const createCustomerResponse =
          await axios.post(
            `${API_URL}/customers/`,
            newCustomerData
          );

        foundCustomer =
          createCustomerResponse.data;

        console.log(
          "NEW CUSTOMER CREATED:",
          foundCustomer
        );
      }

      // =================================================
      // STEP 3
      // CUSTOMER ID
      // =================================================

      if (!foundCustomer?.id) {
        alert(
          "Unable to create customer record."
        );
        return;
      }

      const customerId =
        foundCustomer.id;

      console.log(
        "CUSTOMER ID:",
        customerId
      );

      // =================================================
      // STEP 4
      // UPDATE CUSTOMER DETAILS
      // =================================================

      try {
        const updatedCustomer =
          await axios.put(
            `${API_URL}/customers/${customerId}`,
            {
              name: customer.name.trim(),
              email: foundCustomer.email,
              phone: customer.phone.trim(),
              address: customer.address.trim(),
            }
          );

        console.log(
          "CUSTOMER UPDATED:",
          updatedCustomer.data
        );

      } catch (updateError) {
        console.log(
          "Customer update warning:",
          updateError.response?.data ||
            updateError.message
        );
      }

      // =================================================
      // STEP 5
      // PREPARE ORDER ITEMS
      // =================================================

      const orderItems = cart.map(
        (item) => ({
          food_id: Number(item.id),
          quantity: Number(item.quantity),
          unit_price: Number(item.price),
          subtotal:
            Number(item.price) *
            Number(item.quantity),
        })
      );

      console.log(
        "ORDER ITEMS:",
        orderItems
      );

      // =================================================
      // STEP 6
      // ORDER DATA
      // =================================================

      const orderData = {
        customer_id: Number(customerId),
        total_amount: Number(total),
        items: orderItems,
      };

      console.log(
        "ORDER DATA:",
        orderData
      );

      // =================================================
      // STEP 7
      // CREATE ORDER
      // =================================================

      const orderResponse =
        await axios.post(
          `${API_URL}/orders/`,
          orderData
        );

      console.log(
        "ORDER CREATED:",
        orderResponse.data
      );

      // =================================================
      // STEP 8
      // SAVE LAST ORDER
      // =================================================

      localStorage.setItem(
        "lastOrder",
        JSON.stringify({
          order: orderResponse.data,
          customer: {
            ...customer,
            email: foundCustomer.email,
          },
          items: cart,
          total: total,
        })
      );

      // =================================================
      // STEP 9
      // CLEAR CART
      // =================================================

      localStorage.removeItem(cartKey);

      setCart([]);

      // =================================================
      // STEP 10
      // ORDER CONFIRMATION
      // =================================================

      navigate("/order-confirmation");

    } catch (error) {
      console.error(
        "================================"
      );

      console.error(
        "ORDER ERROR:",
        error
      );

      console.error(
        "BACKEND ERROR:",
        error.response?.data
      );

      console.error(
        "STATUS:",
        error.response?.status
      );

      console.error(
        "================================"
      );

      alert(
        error.response?.data?.detail ||
        "Failed to place order. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <main className="checkout-page">

      {/* CHECKOUT HEADER */}

      <section className="checkout-header">

        <div className="container">

          <p>CHECKOUT</p>

          <h1>
            Complete Your Order
          </h1>

          <span>
            Enter your details and review your order.
          </span>

        </div>

      </section>

      {/* CHECKOUT SECTION */}

      <section className="checkout-section">

        <div className="container">

          <div className="checkout-layout">

            {/* CUSTOMER INFORMATION */}

            <div className="checkout-form-card">

              <h2>
                Customer Information
              </h2>

              <form onSubmit={handleSubmit}>

                {/* NAME */}

                <div className="form-group">

                  <label>
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={customer.name}
                    onChange={handleChange}
                  />

                </div>

                {/* EMAIL */}

                <div className="form-group">

                  <label>
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={customer.email}
                    onChange={handleChange}
                  />

                </div>

                {/* PHONE */}

                <div className="form-group">

                  <label>
                    Phone
                  </label>

                  <input
                    type="text"
                    name="phone"
                    placeholder="Enter your phone number"
                    value={customer.phone}
                    onChange={handleChange}
                  />

                </div>

                {/* ADDRESS */}

                <div className="form-group">

                  <label>
                    Address
                  </label>

                  <textarea
                    name="address"
                    placeholder="Enter your delivery address"
                    value={customer.address}
                    onChange={handleChange}
                    rows="4"
                  ></textarea>

                </div>

                {/* PLACE ORDER */}

                <button
                  type="submit"
                  className="place-order-button"
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

              <h2>
                Order Summary
              </h2>

              {cart.length === 0 ? (

                <div className="checkout-empty">

                  <p>
                    Your cart is empty.
                  </p>

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
                            Number(item.quantity)}
                        </strong>

                      </div>

                    ))}

                  </div>

                  <div className="checkout-line"></div>

                  <div className="checkout-total">

                    <span>
                      Total
                    </span>

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