import { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  Pencil,
  Trash2,
  X,
  Mail,
  Phone,
  MapPin
} from "lucide-react";

const API_URL = "http://127.0.0.1:8001";

function AdminCustomers() {

  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [editingCustomer, setEditingCustomer] = useState(null);

  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });


  /* =========================
     GET TOKEN
  ========================= */

  const getToken = () => {
    return localStorage.getItem("token");
  };


  /* =========================
     FETCH CUSTOMERS
  ========================= */

  const fetchCustomers = async () => {

    try {

      setLoading(true);

      const token = getToken();

      const response = await axios.get(
        `${API_URL}/customers/`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setCustomers(response.data);

    } catch (error) {

      console.error(
        "Customers loading error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.detail ||
        "Failed to load customers."
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {
    fetchCustomers();
  }, []);


  /* =========================
     FORM CHANGE
  ========================= */

  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));

  };


  /* =========================
     OPEN ADD FORM
  ========================= */

  const openAddForm = () => {

    setEditingCustomer(null);

    setForm({
      name: "",
      email: "",
      phone: "",
      address: ""
    });

    setShowForm(true);

  };


  /* =========================
     OPEN EDIT FORM
  ========================= */

  const openEditForm = (customer) => {

    setEditingCustomer(customer);

    setForm({
      name: customer.name || "",
      email: customer.email || "",
      phone: customer.phone || "",
      address: customer.address || ""
    });

    setShowForm(true);

  };


  /* =========================
     CLOSE FORM
  ========================= */

  const closeForm = () => {

    setShowForm(false);

    setEditingCustomer(null);

    setForm({
      name: "",
      email: "",
      phone: "",
      address: ""
    });

  };


  /* =========================
     CREATE / UPDATE
  ========================= */

  const handleSubmit = async (e) => {

    e.preventDefault();


    if (!form.name.trim()) {

      alert("Please enter customer name.");

      return;

    }


    if (form.name.trim().length < 2) {

      alert(
        "Customer name must contain at least 2 characters."
      );

      return;

    }


    if (!form.email.trim()) {

      alert("Please enter customer email.");

      return;

    }


    if (!form.phone.trim()) {

      alert("Please enter customer phone.");

      return;

    }


    if (!form.address.trim()) {

      alert("Please enter customer address.");

      return;

    }


    try {

      setSaving(true);

      const token = getToken();

      const data = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim()
      };

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };


      /* UPDATE */

      if (editingCustomer) {

        await axios.put(
          `${API_URL}/customers/${editingCustomer.id}`,
          data,
          config
        );

        alert(
          "Customer updated successfully."
        );

      }


      /* CREATE */

      else {

        await axios.post(
          `${API_URL}/customers/`,
          data,
          config
        );

        alert(
          "Customer created successfully."
        );

      }


      closeForm();

      fetchCustomers();

    } catch (error) {

      console.error(
        "Customer save error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.detail ||
        "Failed to save customer."
      );

    } finally {

      setSaving(false);

    }

  };


  /* =========================
     DELETE CUSTOMER
  ========================= */

  const handleDelete = async (customer) => {

    const confirmed = window.confirm(
      `Are you sure you want to delete "${customer.name}"?`
    );

    if (!confirmed) {
      return;
    }


    try {

      const token = getToken();

      await axios.delete(
        `${API_URL}/customers/${customer.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert(
        "Customer deleted successfully."
      );

      fetchCustomers();

    } catch (error) {

      console.error(
        "Customer delete error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.detail ||
        "Failed to delete customer."
      );

    }

  };


  return (
    <main className="admin-customers-page">

      <div className="admin-customers-container">


        {/* =========================
            HEADER
        ========================= */}

        <div className="admin-customers-header">

          <div>

            <p className="admin-page-label">
              CUSTOMER MANAGEMENT
            </p>

            <h1>
              Customers
            </h1>

            <p>
              View and manage customer information.
            </p>

          </div>


          <div className="admin-customers-count">

            <Users size={21} />

            <span>
              {customers.length} Customers
            </span>

          </div>

        </div>


        {/* =========================
            CUSTOMER TABLE
        ========================= */}

        <div className="admin-customers-card">

          {loading ? (

            <div className="admin-customers-message">

              Loading customers...

            </div>

          ) : customers.length === 0 ? (

            <div className="admin-customers-message">

              <Users size={45} />

              <p>
                No customers found.
              </p>

            </div>

          ) : (

            <div className="admin-customers-table-wrapper">

              <table className="admin-customers-table">

                <thead>

                  <tr>

                    <th>
                      Customer
                    </th>

                    <th>
                      Email
                    </th>

                    <th>
                      Phone
                    </th>

                    <th>
                      Address
                    </th>

                    <th>
                      Actions
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {customers.map(
                    (customer) => (

                      <tr key={customer.id}>


                        {/* Customer */}

                        <td>

                          <div className="admin-customer-info">

                            <div className="admin-customer-avatar">

                              <Users size={19} />

                            </div>

                            <div>

                              <strong>
                                {customer.name}
                              </strong>

                              <small>
                                Customer #{customer.id}
                              </small>

                            </div>

                          </div>

                        </td>


                        {/* Email */}

                        <td>

                          <div className="admin-customer-contact">

                            <Mail size={16} />

                            <span>
                              {customer.email}
                            </span>

                          </div>

                        </td>


                        {/* Phone */}

                        <td>

                          <div className="admin-customer-contact">

                            <Phone size={16} />

                            <span>
                              {customer.phone}
                            </span>

                          </div>

                        </td>


                        {/* Address */}

                        <td>

                          <div className="admin-customer-contact">

                            <MapPin size={16} />

                            <span>
                              {customer.address}
                            </span>

                          </div>

                        </td>


                        {/* Actions */}

                        <td>

                          <div className="admin-customer-actions">

                            <button
                              className="edit-customer-button"
                              onClick={() =>
                                openEditForm(customer)
                              }
                              title="Edit Customer"
                            >

                              <Pencil size={17} />

                            </button>


                            <button
                              className="delete-customer-button"
                              onClick={() =>
                                handleDelete(customer)
                              }
                              title="Delete Customer"
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

          <div className="admin-customer-modal">


            {/* Modal Header */}

            <div className="admin-modal-header">

              <div>

                <p>
                  {editingCustomer
                    ? "UPDATE CUSTOMER"
                    : "NEW CUSTOMER"}
                </p>

                <h2>

                  {editingCustomer
                    ? "Edit Customer"
                    : "Add Customer"}

                </h2>

              </div>


              <button
                className="admin-modal-close"
                onClick={closeForm}
              >

                <X size={22} />

              </button>

            </div>


            {/* Form */}

            <form
              className="admin-customer-form"
              onSubmit={handleSubmit}
            >


              {/* Name */}

              <div className="admin-form-group">

                <label>
                  Customer Name *
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter customer name"
                  value={form.name}
                  onChange={handleChange}
                />

              </div>


              {/* Email */}

              <div className="admin-form-group">

                <label>
                  Email *
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter customer email"
                  value={form.email}
                  onChange={handleChange}
                />

              </div>


              {/* Phone */}

              <div className="admin-form-group">

                <label>
                  Phone *
                </label>

                <input
                  type="text"
                  name="phone"
                  placeholder="Enter phone number"
                  value={form.phone}
                  onChange={handleChange}
                />

              </div>


              {/* Address */}

              <div className="admin-form-group">

                <label>
                  Address *
                </label>

                <textarea
                  name="address"
                  placeholder="Enter customer address"
                  value={form.address}
                  onChange={handleChange}
                  rows="3"
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
                    : editingCustomer
                    ? "Update Customer"
                    : "Create Customer"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </main>
  );
}

export default AdminCustomers;