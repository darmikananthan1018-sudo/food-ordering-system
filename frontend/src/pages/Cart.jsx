import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState([]);

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const cartKey = user?.id
    ? `cart_user_${user.id}`
    : "cart";

  useEffect(() => {
    const savedCart =
      JSON.parse(localStorage.getItem(cartKey)) || [];

    setCart(savedCart);
  }, [cartKey]);

  const updateCart = (updatedCart) => {
    setCart(updatedCart);

    localStorage.setItem(
      cartKey,
      JSON.stringify(updatedCart)
    );
  };

  const increaseQuantity = (id) => {
    const updatedCart = cart.map((item) =>
      item.id === id
        ? {
            ...item,
            quantity: item.quantity + 1,
          }
        : item
    );

    updateCart(updatedCart);
  };

  const decreaseQuantity = (id) => {
    const updatedCart = cart
      .map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity - 1,
            }
          : item
      )
      .filter((item) => item.quantity > 0);

    updateCart(updatedCart);
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter(
      (item) => item.id !== id
    );

    updateCart(updatedCart);
  };

  const total = cart.reduce(
    (sum, item) =>
      sum + Number(item.price) * item.quantity,
    0
  );

  return (
    <main className="cart-page">

      <section className="cart-header">
        <div className="container">

          <p>YOUR SHOPPING CART</p>

          <h1>Your Cart</h1>

          <span>
            Review your selected foods before placing your order.
          </span>

        </div>
      </section>

      <section className="cart-section">

        <div className="container">

          {cart.length === 0 ? (

            <div className="empty-cart">

              <div className="empty-cart-icon">
                🛒
              </div>

              <h2>
                Your Cart is Empty
              </h2>

              <p>
                You haven't added any food to your cart yet.
              </p>

              <Link
                to="/foods"
                className="continue-shopping-button"
              >
                Explore Foods
              </Link>

            </div>

          ) : (

            <div className="cart-layout">

              <div className="cart-items">

                {cart.map((item) => (

                  <div
                    className="cart-item"
                    key={item.id}
                  >

                    <div className="cart-item-image">

                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="cart-placeholder">
                          🍽️
                        </div>
                      )}

                    </div>

                    <div className="cart-item-details">

                      <h3>
                        {item.name}
                      </h3>

                      <p>
                        {item.description}
                      </p>

                      <span className="cart-item-price">
                        Rs. {item.price}
                      </span>

                    </div>

                    <div className="cart-item-actions">

                      <div className="quantity-control">

                        <button
                          onClick={() =>
                            decreaseQuantity(item.id)
                          }
                        >
                          −
                        </button>

                        <span>
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            increaseQuantity(item.id)
                          }
                        >
                          +
                        </button>

                      </div>

                      <button
                        className="remove-button"
                        onClick={() =>
                          removeItem(item.id)
                        }
                      >
                        Remove
                      </button>

                    </div>

                    <div className="cart-item-subtotal">

                      Rs.{" "}
                      {Number(item.price) *
                        item.quantity}

                    </div>

                  </div>

                ))}

              </div>

              <div className="cart-summary">

                <h2>
                  Order Summary
                </h2>

                <div className="summary-row">

                  <span>
                    Items
                  </span>

                  <span>
                    {cart.reduce(
                      (sum, item) =>
                        sum + item.quantity,
                      0
                    )}
                  </span>

                </div>

                <div className="summary-row">

                  <span>
                    Subtotal
                  </span>

                  <span>
                    Rs. {total}
                  </span>

                </div>

                <div className="summary-line"></div>

                <div className="summary-total">

                  <span>
                    Total
                  </span>

                  <strong>
                    Rs. {total}
                  </strong>

                </div>

                <Link
                  to="/checkout"
                  className="checkout-button"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  to="/foods"
                  className="continue-shopping"
                >
                  ← Continue Shopping
                </Link>

              </div>

            </div>

          )}

        </div>

      </section>

    </main>
  );
}

export default Cart;