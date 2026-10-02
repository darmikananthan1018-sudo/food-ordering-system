
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  UserPlus,
  User,
  Mail,
  Lock
} from "lucide-react";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanName || !cleanEmail || !cleanPassword) {
      alert("Please fill all fields.");
      return;
    }

    if (cleanName.length < 2) {
      alert("Name must be at least 2 characters.");
      return;
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(cleanEmail)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (cleanPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        "http://127.0.0.1:8001/auth/register",
        {
          name: cleanName,
          email: cleanEmail,
          password: cleanPassword,
          role: "Customer"
        }
      );

      alert(
        "Registration successful! Please login."
      );

      navigate("/login");

    } catch (error) {
      console.error(
        "Register error:",
        error.response?.data || error.message
      );

      if (error.response?.status === 400) {
        alert(
          error.response?.data?.detail ||
          "Email already exists."
        );
      } else if (error.response?.status === 422) {
        alert(
          "Please check the information you entered."
        );
      } else if (!error.response) {
        alert(
          "Cannot connect to backend. Please make sure FastAPI is running on port 8001."
        );
      } else {
        alert(
          error.response?.data?.detail ||
          "Registration failed. Please try again."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-page">

      <div className="register-card">

        <div className="register-icon">
          <UserPlus size={34} />
        </div>

        <p className="register-label">
          WELCOME TO FOODIE
        </p>

        <h1>Create Account</h1>

        <p className="register-subtitle">
          Register as a customer to start ordering.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="register-form-group">

            <label>Name</label>

            <div className="register-input-wrapper">

              <User size={19} />

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                required
              />

            </div>

          </div>


          <div className="register-form-group">

            <label>Email Address</label>

            <div className="register-input-wrapper">

              <Mail size={19} />

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />

            </div>

          </div>


          <div className="register-form-group">

            <label>Password</label>

            <div className="register-input-wrapper">

              <Lock size={19} />

              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />

            </div>

          </div>


          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>


        <p className="register-login-text">

          Already have an account?{" "}

          <button
            type="button"
            onClick={() => navigate("/login")}
          >
            Login
          </button>

        </p>

      </div>

    </main>
  );
}

export default Register;

