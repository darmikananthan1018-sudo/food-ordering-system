import { useEffect, useState } from "react";
import axios from "axios";
import FoodCard from "../components/FoodCard";

const API_URL = import.meta.env.VITE_API_URL;

function Foods() {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
    fetchFoods();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/categories/`
      );

      setCategories(response.data);
    } catch (error) {
      console.error("Category loading error:", error);
    }
  };

  const fetchFoods = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page: 1,
        limit: 100,
      };

      if (search.trim() !== "") {
        params.search = search;
      }

      if (categoryId !== "") {
        params.category_id = categoryId;
      }

      const response = await axios.get(
        `${API_URL}/foods/`,
        {
          params: params,
        }
      );

      console.log("Foods:", response.data);

      setFoods(response.data);
    } catch (error) {
      console.error("Food loading error:", error);
      setError("Failed to load foods.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFoods();
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;

    setCategoryId(selectedCategory);

    setTimeout(() => {
      fetchFoods();
    }, 0);
  };

  return (
    <main className="foods-page">

      {/* Header */}
      <section className="foods-header">
        <div className="container">
          <p>OUR MENU</p>

          <h1>Explore Our Foods</h1>

          <span>
            Discover delicious food and choose your favorite meal.
          </span>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="food-filter-section">
        <div className="container">

          <form
            className="food-filter-bar"
            onSubmit={handleSearch}
          >

            <input
              type="text"
              placeholder="Search food..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={categoryId}
              onChange={handleCategoryChange}
            >
              <option value="">
                All Categories
              </option>

              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              ))}
            </select>

            <button type="submit">
              Search
            </button>

          </form>

        </div>
      </section>

      {/* Foods */}
      <section className="foods-section">
        <div className="container">

          {loading && (
            <div className="foods-message">
              Loading foods...
            </div>
          )}

          {error && (
            <div className="foods-error">
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            foods.length === 0 && (
              <div className="foods-message">
                No foods found.
              </div>
            )}

          {!loading &&
            !error &&
            foods.length > 0 && (
              <div className="foods-grid">

                {foods.map((food) => (
                  <FoodCard
                    key={food.id}
                    food={food}
                  />
                ))}

              </div>
            )}

        </div>
      </section>

    </main>
  );
}

export default Foods;