
import { Link } from "react-router-dom";
import heroImage from "../assets/hero.png";
import foodOrderBg from "../assets/food-order-bg.png";

function Home() {
  return (
    <div className="home">

      {/* HERO */}
      <section className="hero">
        <div className="hero-container">

          <div className="hero-content">
            <p className="hero-small-title">
              WELCOME TO Zestora
            </p>

            <h1>
              Delicious Food,
              <br />
              <span>Delivered With Love.</span>
            </h1>

            <p>
              Discover delicious meals, explore different categories,
              and order your favorite food quickly and easily.
            </p>

            <div className="hero-buttons">
              <Link to="/foods" className="hero-primary-button">
                Explore Foods
              </Link>

              <Link to="/cart" className="hero-secondary-button">
                View Cart
              </Link>
            </div>
          </div>

          <div className="hero-image">
            <img src={heroImage} alt="Food" />
          </div>

        </div>
      </section>


      {/* FEATURES */}
      <section className="features-section">
        <div className="container">

          <div className="section-heading">
            <p>WHY CHOOSE Zestora</p>
            <h2>Everything You Need</h2>
          </div>

          <div className="features-grid">

            {/* Delicious Foods */}
            <div className="feature-card">
              <div className="feature-image">
                <img
                  src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80"
                  alt="Delicious Burger"
                />
              </div>

              <h3>Delicious Foods</h3>

              <p>
                Explore a wide variety of delicious meals
                prepared with care.
              </p>
            </div>


            {/* Easy Ordering */}
            <div className="feature-card">
              <div className="feature-image">
                <img
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80"
                  alt="Easy Food Ordering"
                />
              </div>

              <h3>Easy Ordering</h3>

              <p>
                Add your favorite foods to the cart and
                place your order easily.
              </p>
            </div>


            {/* Fast Service */}
            <div className="feature-card">
              <div className="feature-image">
                <img
                  src="https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=800&q=80"
                  alt="Food Delivery"
                />
              </div>

              <h3>Fast Service</h3>

              <p>
                Enjoy a simple and convenient food ordering
                experience.
              </p>
            </div>

          </div>
        </div>
      </section>


      
<section
  className="cta-section"
  style={{
    backgroundImage: `url(${foodOrderBg})`,
  }}
>
  <div className="cta-overlay">
    <div className="cta-content">
      <h2>
        Ready to Order Your
        <span>Favorite Food?</span>
      </h2>

      <p>
        Delicious food, fresh ingredients, and fast delivery —
        all in just a few clicks!
      </p>

      <Link to="/foods" className="cta-order-button">
        Order Now →
      </Link>
    </div>
  </div>
</section>
    </div>
  );
}



export default Home;
