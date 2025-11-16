import { useState } from "react";
import axios from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import "./UserLogin.css";

export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await axios.post("/auth/login", { email, password });
      const { token, user } = res.data;

      if (user.role !== "user") {
        setError("Access denied. Only general users can log in here.");
        return;
      }

      // Store token and user info
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="user-login-container">
      <div className="user-login-card">
        <div className="user-login-header">
          <h1 className="user-login-title">Welcome Back</h1>
          <p className="user-login-subtitle">
            Sign in to access your lost and found reports
          </p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="btn-login"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="forgot-password">
          <Link to="/forgot-password">Forgot your password?</Link>
        </div>

        <div className="signup-link">
          Don't have an account? <Link to="/user-signup">Create one here</Link>
        </div>
      </div>
    </div>
  );
}
