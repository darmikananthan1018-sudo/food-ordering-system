
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LogIn, Mail, Lock, UserPlus } from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      alert("Please enter email and password.");
      return;
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(cleanEmail)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      const formData = new URLSearchParams();

      formData.append("username", cleanEmail);
      formData.append("password", cleanPassword);

      const loginResponse = await axios.post(
        "http://127.0.0.1:8001/auth/login",
        formData,
        {
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
          },
        }
      );

      const token =
        loginResponse.data.access_token;

      if (!token) {
        alert("Login failed. No access token received.");
        return;
      }

      localStorage.setItem("token", token);

      const userResponse = await axios.get(
        "http://127.0.0.1:8001/auth/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const user = userResponse.data;

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      if (user.role === "Admin") {
        localStorage.setItem(
          "adminToken",
          token
        );

        navigate("/admin/dashboard");
      } else {
        navigate("/foods");
      }

    } catch (error) {
      console.error(
        "Login error:",
        error.response?.data || error.message
      );

      if (error.response?.status === 401) {
        alert("Invalid email or password.");
      } else if (error.response?.status === 422) {
        alert(
          "Please check your email and password."
        );
      } else if (!error.response) {
        alert(
          "Cannot connect to backend. Please make sure FastAPI is running on port 8001."
        );
      } else {
        alert(
          error.response?.data?.detail ||
          "Login failed. Please try again."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">

      <div className="login-card">

        <div className="login-icon">
          <LogIn size={34} />
        </div>

        <p className="login-label">
          WELCOME TO FOODIE
        </p>

        <h1>Login</h1>

        <p className="login-subtitle">
          Login to continue to your account.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="login-form-group">

            <label>Email Address</label>

            <div className="login-input-wrapper">

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


          <div className="login-form-group">

            <label>Password</label>

            <div className="login-input-wrapper">

              <Lock size={19} />

              <input
                type="password"
                placeholder="Enter your password"
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
            className="login-button"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>


        <div className="login-register-section">

          <p>
            Don't have an account?
          </p>

          <button
            type="button"
            className="register-link-button"
            onClick={() => navigate("/register")}
          >
            <UserPlus size={17} />
            Register
          </button>

        </div>

      </div>

    </main>
  );
}

export default Login;

