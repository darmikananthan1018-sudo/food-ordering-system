import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import {
  Utensils,
  ShoppingCart,
  ClipboardList,
  LogIn,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
} from "lucide-react";

function Navbar({ darkMode, setDarkMode }) {
  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [menuOpen, setMenuOpen] = useState(false);

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const isAdmin =
    loggedIn && user?.role === "Admin";

  const isCustomer =
    loggedIn && user?.role === "Customer";


  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("adminToken");

    setLoggedIn(false);
    setMenuOpen(false);

    navigate("/login");
  };


  // =========================
  // CLOSE MENU
  // =========================

  const closeMenu = () => {
    setMenuOpen(false);
  };


  // =========================
  // DARK / LIGHT MODE
  // =========================

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
  };


  return (
    <nav className="navbar">

      <div className="navbar-container">

        {/* =========================
            LOGO
        ========================= */}

        <Link
          to="/"
          className="navbar-logo"
          onClick={closeMenu}
        >

          <span className="logo-icon">
            <Utensils
              size={30}
              strokeWidth={2.5}
            />
          </span>

          <span>ŹĘŞŢŌŘĂ</span>

        </Link>


        


        {/* =========================
            NAVIGATION LINKS
        ========================= */}

        <div
          className={`navbar-links ${
            menuOpen ? "mobile-menu-open" : ""
          }`}
        >

         

          {/* =========================
              ADMIN
          ========================= */}

          {isAdmin && (
            <>

              <Link
                to="/admin/dashboard"
                className="nav-icon-link"
                onClick={closeMenu}
              >

                <LayoutDashboard size={19} />

                <span>
                  Admin Dashboard
                </span>

              </Link>


              <button
                onClick={handleLogout}
                className="nav-logout-button"
              >

                <LogOut size={18} />

                <span>
                  Logout
                </span>

              </button>

            </>
          )}


          {/* =========================
              CUSTOMER
          ========================= */}

          {isCustomer && (
            <>

              <Link
                to="/"
                onClick={closeMenu}
              >
                Home
              </Link>


              <Link
                to="/foods"
                onClick={closeMenu}
              >
                Foods
              </Link>


              <Link
                to="/cart"
                className="nav-icon-link"
                onClick={closeMenu}
              >

                <ShoppingCart size={19} />

                <span>
                  Cart
                </span>

              </Link>


              <Link
                to="/my-orders"
                className="nav-icon-link"
                onClick={closeMenu}
              >

                <ClipboardList size={19} />

                <span>
                  My Orders
                </span>

              </Link>


              <button
                onClick={handleLogout}
                className="nav-logout-button"
              >

                <LogOut size={18} />

                <span>
                  Logout
                </span>

              </button>

            </>
          )}


          {/* =========================
              NOT LOGGED IN
          ========================= */}

          {!loggedIn && (
            <>

              <Link
                to="/"
                onClick={closeMenu}
              >
                Home
              </Link>


              <Link
                to="/login"
                className="nav-icon-link"
                onClick={closeMenu}
              >

                <LogIn size={18} />

                <span>
                  Login
                </span>

              </Link>

            </>
          )}

        </div>

      </div>

    </nav>
  );
}

export default Navbar;