import { useEffect, useState } from "react";
import axios from "axios";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  FolderOpen
} from "lucide-react";

const API_URL = "http://127.0.0.1:8001";

function AdminCategories() {

  const [categories, setCategories] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);


  /* =========================
     TOKEN
  ========================= */

  const getToken = () => {
    return localStorage.getItem("token");
  };


  /* =========================
     GET CATEGORIES
  ========================= */

  const fetchCategories = async () => {

    try {

      setLoading(true);

      const response = await axios.get(
        `${API_URL}/categories/`
      );

      setCategories(response.data);

    } catch (error) {

      console.error(
        "Categories loading error:",
        error.response?.data || error.message
      );

      alert("Failed to load categories.");

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {
    fetchCategories();
  }, []);


  /* =========================
     OPEN ADD FORM
  ========================= */

  const openAddForm = () => {

    setEditingCategory(null);

    setName("");
    setDescription("");

    setShowForm(true);

  };


  /* =========================
     OPEN EDIT FORM
  ========================= */

  const openEditForm = (category) => {

    setEditingCategory(category);

    setName(category.name || "");
    setDescription(category.description || "");

    setShowForm(true);

  };


  /* =========================
     CLOSE FORM
  ========================= */

  const closeForm = () => {

    setShowForm(false);
    setEditingCategory(null);

    setName("");
    setDescription("");

  };


  /* =========================
     CREATE / UPDATE
  ========================= */

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter category name.");
      return;
    }

    if (name.trim().length < 2) {
      alert(
        "Category name must contain at least 2 characters."
      );
      return;
    }

    try {

      setSaving(true);

      const token = getToken();

      const data = {
        name: name.trim(),
        description: description.trim()
      };

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };


      /* UPDATE */

      if (editingCategory) {

        await axios.put(
          `${API_URL}/categories/${editingCategory.id}`,
          data,
          config
        );

        alert(
          "Category updated successfully."
        );

      }


      /* CREATE */

      else {

        await axios.post(
          `${API_URL}/categories/`,
          data,
          config
        );

        alert(
          "Category created successfully."
        );

      }

      closeForm();

      fetchCategories();

    } catch (error) {

      console.error(
        "Category save error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.detail ||
        "Failed to save category."
      );

    } finally {

      setSaving(false);

    }

  };


  /* =========================
     DELETE
  ========================= */

  const handleDelete = async (category) => {

    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {

      const token = getToken();

      await axios.delete(
        `${API_URL}/categories/${category.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert(
        "Category deleted successfully."
      );

      fetchCategories();

    } catch (error) {

      console.error(
        "Category delete error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.detail ||
        "Failed to delete category."
      );

    }

  };


  return (
    <main className="admin-categories-page">

      <div className="admin-categories-container">


        {/* =========================
            HEADER
        ========================= */}

        <div className="admin-categories-header">

          <div>

            <p className="admin-page-label">
              CATEGORY MANAGEMENT
            </p>

            <h1>
              Categories
            </h1>

            <p>
              Create and manage your food categories.
            </p>

          </div>


          <button
            className="admin-add-button"
            onClick={openAddForm}
          >

            <Plus size={19} />

            Add Category

          </button>

        </div>


        {/* =========================
            CATEGORY LIST
        ========================= */}

        <div className="admin-categories-card">

          {loading ? (

            <div className="admin-categories-message">
              Loading categories...
            </div>

          ) : categories.length === 0 ? (

            <div className="admin-categories-message">

              <FolderOpen size={40} />

              <p>
                No categories found.
              </p>

            </div>

          ) : (

            <div className="admin-categories-table-wrapper">

              <table className="admin-categories-table">

                <thead>

                  <tr>

                    <th>
                      ID
                    </th>

                    <th>
                      Category Name
                    </th>

                    <th>
                      Description
                    </th>

                    <th>
                      Actions
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {categories.map(
                    (category) => (

                      <tr key={category.id}>

                        <td>
                          #{category.id}
                        </td>

                        <td>

                          <div className="category-name-cell">

                            <div className="category-icon">
                              <FolderOpen size={18} />
                            </div>

                            <strong>
                              {category.name}
                            </strong>

                          </div>

                        </td>

                        <td>

                          <span className="category-description">

                            {category.description ||
                              "No description"}

                          </span>

                        </td>

                        <td>

                          <div className="admin-category-actions">

                            <button
                              className="edit-category-button"
                              onClick={() =>
                                openEditForm(category)
                              }
                              title="Edit Category"
                            >

                              <Pencil size={17} />

                            </button>


                            <button
                              className="delete-category-button"
                              onClick={() =>
                                handleDelete(category)
                              }
                              title="Delete Category"
                            >

                              <Trash2 size={17} />

                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

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

          <div className="admin-category-modal">


            {/* Modal Header */}

            <div className="admin-modal-header">

              <div>

                <p>
                  {editingCategory
                    ? "UPDATE CATEGORY"
                    : "NEW CATEGORY"}
                </p>

                <h2>

                  {editingCategory
                    ? "Edit Category"
                    : "Add Category"}

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
              className="admin-category-form"
            >


              {/* Name */}

              <div className="admin-form-group">

                <label>
                  Category Name *
                </label>

                <input
                  type="text"
                  placeholder="Enter category name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                />

              </div>


              {/* Description */}

              <div className="admin-form-group">

                <label>
                  Description
                </label>

                <textarea
                  placeholder="Enter category description"
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  rows="4"
                />

              </div>


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
                    : editingCategory
                    ? "Update Category"
                    : "Create Category"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </main>
  );
}

export default AdminCategories;