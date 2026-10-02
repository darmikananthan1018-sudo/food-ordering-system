import {
  BrowserRouter,
  Routes,
  Route,
  useLocation
} from "react-router-dom";

import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminSidebar from "./components/AdminSidebar";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Foods from "./pages/Foods";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import MyOrders from "./pages/MyOrders";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminFoods from "./pages/admin/AdminFoods";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminCustomers from "./pages/admin/AdminCustomers";


function AppContent() {

  const location = useLocation();

  // DARK MODE
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {

    if (darkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }

  }, [darkMode]);


  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const isAdmin =
    user?.role === "Admin";

  const isAdminPage =
    location.pathname.startsWith("/admin");

  const showAdminSidebar =
    isAdmin && isAdminPage;

  const showNormalLayout =
    !showAdminSidebar;


  return (
    <>

      {showAdminSidebar && (
        <AdminSidebar />
      )}


      {showNormalLayout && (
        <Navbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      )}


      <div
        className={
          showAdminSidebar
            ? "admin-main-content"
            : ""
        }
      >

        <Routes>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />


          {/* CUSTOMER */}

          <Route
            element={<ProtectedRoute />}
          >

            <Route
              path="/foods"
              element={<Foods />}
            />

            <Route
              path="/cart"
              element={<Cart />}
            />

            <Route
              path="/checkout"
              element={<Checkout />}
            />

            <Route
              path="/order-confirmation"
              element={<OrderConfirmation />}
            />

            <Route
              path="/my-orders"
              element={<MyOrders />}
            />

          </Route>


          {/* ADMIN */}

          <Route
            element={<AdminProtectedRoute />}
          >

            <Route
              path="/admin/dashboard"
              element={<AdminDashboard />}
            />

            <Route
              path="/admin/categories"
              element={<AdminCategories />}
            />

            <Route
              path="/admin/foods"
              element={<AdminFoods />}
            />

            <Route
              path="/admin/orders"
              element={<AdminOrders />}
            />

            <Route
              path="/admin/customers"
              element={<AdminCustomers />}
            />

          </Route>

        </Routes>

      </div>


      {showNormalLayout && (
        <Footer />
      )}

    </>
  );
}


function App() {

  return (
    <BrowserRouter>

      <AppContent />

    </BrowserRouter>
  );
}


export default App;