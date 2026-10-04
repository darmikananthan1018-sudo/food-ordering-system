import { useEffect, useState } from "react";
import axios from "axios";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  X
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

function AdminFoods() {

  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingFood, setEditingFood] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    is_available: true,
    category_id: ""
  });


  /* =========================
     TOKEN
  ========================= */

  const getToken = () => {
    return localStorage.getItem("token");
  };


  /* =========================
     LOAD FOODS
  ========================= */

  const fetchFoods = async () => {

    try {

      setLoading(true);

      const params = {
        page: 1,
        limit: 100
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (categoryId) {
        params.category_id = categoryId;
      }

      const response = await axios.get(
        `${API_URL}/foods/`,
        { params }
      );

      setFoods(response.data);

    } catch (error) {

      console.error(
        "Foods loading error:",
        error.response?.data || error.message
      );

      alert("Failed to load foods.");

    } finally {

      setLoading(false);

    }
  };


  /* =========================
     LOAD CATEGORIES
  ========================= */

  const fetchCategories = async () => {

    try {

      const response = await axios.get(
        `${API_URL}/categories/`
      );

      setCategories(response.data);

    } catch (error) {

      console.error(
        "Categories loading error:",
        error.response?.data || error.message
      );

    }
  };


  useEffect(() => {

    fetchCategories();
    fetchFoods();

  }, []);


  /* =========================
     SEARCH
  ========================= */

  const handleSearch = (e) => {

    e.preventDefault();

    fetchFoods();

  };


  /* =========================
     CATEGORY FILTER
  ========================= */

  const handleCategoryChange = (e) => {

    const value = e.target.value;

    setCategoryId(value);

    setTimeout(() => {
      fetchFoods();
    }, 0);

  };


  /* =========================
     FORM CHANGE
  ========================= */

  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value
    }));

  };


  /* =========================
     OPEN ADD FORM
  ========================= */

  const openAddForm = () => {

    setEditingFood(null);

    setForm({
      name: "",
      description: "",
      price: "",
      image: "",
      is_available: true,
      category_id: ""
    });

    setShowForm(true);

  };


  /* =========================
     OPEN EDIT FORM
  ========================= */

  const openEditForm = (food) => {

    setEditingFood(food);

    setForm({
      name: food.name || "",
      description: food.description || "",
      price: food.price || "",
      image: food.image || "",
      is_available: food.is_available,
      category_id: food.category_id || ""
    });

    setShowForm(true);

  };


  /* =========================
     CLOSE FORM
  ========================= */

  const closeForm = () => {

    setShowForm(false);
    setEditingFood(null);

  };


  /* =========================
     SAVE FOOD
  ========================= */

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!form.name.trim()) {
      alert("Please enter food name.");
      return;
    }

    if (form.name.trim().length < 2) {
      alert("Food name must contain at least 2 characters.");
      return;
    }

    if (!form.price || Number(form.price) <= 0) {
      alert("Price must be greater than 0.");
      return;
    }

    if (!form.category_id) {
      alert("Please select a category.");
      return;
    }

    try {

      setSaving(true);

      const token = getToken();

      const data = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        image: form.image.trim(),
        is_available: form.is_available,
        category_id: Number(form.category_id)
      };

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };


      /* UPDATE */

      if (editingFood) {

        await axios.put(
          `${API_URL}/foods/${editingFood.id}`,
          data,
          config
        );

        alert("Food updated successfully.");

      }


      /* CREATE */

      else {

        await axios.post(
          `${API_URL}/foods/`,
          data,
          config
        );

        alert("Food created successfully.");

      }

      closeForm();

      fetchFoods();

    } catch (error) {

      console.error(
        "Food save error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.detail ||
        "Failed to save food."
      );

    } finally {

      setSaving(false);

    }

  };


  /* =========================
     DELETE FOOD
  ========================= */

  const handleDelete = async (food) => {

    const confirmed = window.confirm(
      `Are you sure you want to delete "${food.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {

      const token = getToken();

      await axios.delete(
        `${API_URL}/foods/${food.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Food deleted successfully.");

      fetchFoods();

    } catch (error) {

      console.error(
        "Delete food error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.detail ||
        "Failed to delete food."
      );

    }

  };


  /* =========================
     TOGGLE AVAILABILITY
  ========================= */

  const toggleAvailability = async (food) => {

    try {

      const token = getToken();

      await axios.put(
        `${API_URL}/foods/${food.id}`,
        {
          name: food.name,
          description: food.description || "",
          price: Number(food.price),
          image: food.image || "",
          is_available: !food.is_available,
          category_id: Number(food.category_id)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      fetchFoods();

    } catch (error) {

      console.error(
        "Availability update error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.detail ||
        "Failed to change availability."
      );

    }

  };


  return (
    <main className="admin-foods-page">

      <div className="admin-foods-container">


        {/* =========================
            HEADER
        ========================= */}

        <div className="admin-foods-header">

          <div>

            <p className="admin-page-label">
              FOOD MANAGEMENT
            </p>

            <h1>
              Foods
            </h1>

            <p>
              Create, update and manage your food items.
            </p>

          </div>

          <button
            className="admin-add-button"
            onClick={openAddForm}
          >
            <Plus size={19} />
            Add Food
          </button>

        </div>


        {/* =========================
            SEARCH & FILTER
        ========================= */}

        <div className="admin-foods-filter">

          <form
            onSubmit={handleSearch}
            className="admin-search-form"
          >

            <div className="admin-search-box">

              <Search size={19} />

              <input
                type="text"
                placeholder="Search food..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

            <button type="submit">
              Search
            </button>

          </form>


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

        </div>


        {/* =========================
            FOOD TABLE
        ========================= */}

        <div className="admin-foods-card">

          {loading ? (

            <div className="admin-foods-message">
              Loading foods...
            </div>

          ) : foods.length === 0 ? (

            <div className="admin-foods-message">
              No foods found.
            </div>

          ) : (

            <div className="admin-foods-table-wrapper">

              <table className="admin-foods-table">

                <thead>

                  <tr>

                    <th>Food</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Availability</th>
                    <th>Actions</th>

                  </tr>

                </thead>

                <tbody>

                  {foods.map((food) => {

                    const category =
                      categories.find(
                        (item) =>
                          item.id === food.category_id
                      );

                    return (

                      <tr key={food.id}>

                        {/* Food */}

                        <td>

                          <div className="admin-food-info">

                            <div className="admin-food-image">

                              {food.image ? (

                                <img
                                  src={food.image}
                                  alt={food.name}
                                />

                              ) : (

                                <span>
                                  🍽️
                                </span>

                              )}

                            </div>

                            <div>

                              <strong>
                                {food.name}
                              </strong>

                              <small>
                                {food.description}
                              </small>

                            </div>

                          </div>

                        </td>


                        {/* Category */}

                        <td>

                          <span className="admin-category-badge">
                            {category?.name || "Unknown"}
                          </span>

                        </td>


                        {/* Price */}

                        <td>

                          <strong className="admin-food-price">
                            Rs. {food.price}
                          </strong>

                        </td>


                        {/* Availability */}

                        <td>

                          <button
                            className={
                              food.is_available
                                ? "availability-button available"
                                : "availability-button unavailable"
                            }
                            onClick={() =>
                              toggleAvailability(food)
                            }
                          >

                            {food.is_available
                              ? "Available"
                              : "Unavailable"}

                          </button>

                        </td>


                        {/* Actions */}

                        <td>

                          <div className="admin-food-actions">

                            <button
                              className="edit-food-button"
                              onClick={() =>
                                openEditForm(food)
                              }
                              title="Edit Food"
                            >
                              <Pencil size={17} />
                            </button>

                            <button
                              className="delete-food-button"
                              onClick={() =>
                                handleDelete(food)
                              }
                              title="Delete Food"
                            >
                              <Trash2 size={17} />
                            </button>

                          </div>

                        </td>

                      </tr>

                    );

                  })}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>


      {/* =========================
          ADD / EDIT MODAL
      ========================= */}

      {showForm && (

        <div className="admin-modal-overlay">

          <div className="admin-food-modal">


            {/* Modal Header */}

            <div className="admin-modal-header">

              <div>

                <p>
                  {editingFood
                    ? "UPDATE FOOD"
                    : "NEW FOOD"}
                </p>

                <h2>
                  {editingFood
                    ? "Edit Food"
                    : "Add Food"}
                </h2>

              </div>

              <button
                onClick={closeForm}
                className="admin-modal-close"
              >
                <X size={22} />
              </button>

            </div>


            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="admin-food-form"
            >


              {/* Name */}

              <div className="admin-form-group">

                <label>
                  Food Name *
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter food name"
                  value={form.name}
                  onChange={handleChange}
                />

              </div>


              {/* Description */}

              <div className="admin-form-group">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  placeholder="Enter food description"
                  value={form.description}
                  onChange={handleChange}
                  rows="3"
                />

              </div>


              {/* Price + Category */}

              <div className="admin-form-row">

                <div className="admin-form-group">

                  <label>
                    Price *
                  </label>

                  <input
                    type="number"
                    name="price"
                    placeholder="Enter price"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={handleChange}
                  />

                </div>


                <div className="admin-form-group">

                  <label>
                    Category *
                  </label>

                  <select
                    name="category_id"
                    value={form.category_id}
                    onChange={handleChange}
                  >

                    <option value="">
                      Select Category
                    </option>

                    {categories.map(
                      (category) => (

                        <option
                          key={category.id}
                          value={category.id}
                        >
                          {category.name}
                        </option>

                      )
                    )}

                  </select>

                </div>

              </div>


              {/* Image */}

              <div className="admin-form-group">

                <label>
                  Image URL
                </label>

                <input
                  type="text"
                  name="image"
                  placeholder="Enter image URL"
                  value={form.image}
                  onChange={handleChange}
                />

              </div>


              {/* Availability */}

              <label className="admin-availability-checkbox">

                <input
                  type="checkbox"
                  name="is_available"
                  checked={form.is_available}
                  onChange={handleChange}
                />

                <span>
                  Food is available
                </span>

              </label>


              {/* Buttons */}

              <div className="admin-modal-buttons">

                <button
                  type="button"
                  className="admin-cancel-button"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-save-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingFood
                    ? "Update Food"
                    : "Create Food"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </main>
  );
}

export default AdminFoods;