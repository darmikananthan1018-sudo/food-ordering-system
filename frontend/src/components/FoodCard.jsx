import { useState } from "react";

function FoodCard({ food }) {
  const [added, setAdded] = useState(false);

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  // Separate cart for each logged-in customer
  const cartKey = user?.id
    ? `cart_user_${user.id}`
    : "cart";

  const addToCart = () => {
    const existingCart =
      JSON.parse(localStorage.getItem(cartKey)) || [];

    const existingItem = existingCart.find(
      (item) => item.id === food.id
    );

    let updatedCart;

    if (existingItem) {
      updatedCart = existingCart.map((item) =>
        item.id === food.id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      );
    } else {
      updatedCart = [
        ...existingCart,
        {
          id: food.id,
          name: food.name,
          description: food.description,
          price: food.price,
          image: food.image,
          quantity: 1,
        },
      ];
    }

   localStorage.setItem(
  cartKey,
  JSON.stringify(updatedCart)
);

console.log("Cart Key:", cartKey);
console.log("Saved Cart:", updatedCart);

setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  return (
    <div className="food-card">

      <div className="food-image">

        {food.image ? (
          <img
            src={food.image}
            alt={food.name}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        ) : (
          <div className="food-placeholder">
            🍽️
          </div>
        )}

      </div>

      <div className="food-card-content">

        <h3>
          {food.name}
        </h3>

        <p className="food-description">
          {food.description}
        </p>

        <div className="food-card-bottom">

          <span className="food-price">
            Rs. {food.price}
          </span>

          <button
            className="add-cart-button"
            onClick={addToCart}
          >
            {added ? "Added ✓" : "Add to Cart"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default FoodCard;