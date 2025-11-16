import { useState } from "react";
import axios from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import "./UserSignUp.css";

export default function UserSignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await axios.post("/auth/signup", { name, email, password });
      const { token, user } = res.data;

      if (user.role !== "user") {
        setError("Account creation failed. Please try again.");
        return;
      }

      // Store token and user info
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect to user dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Account creation failed. Please check your information and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="user-signup-container">
      <div className="user-signup-card">
        <div className="user-signup-header">
          <h1 className="user-signup-title">Create Account</h1>
          <p className="user-signup-subtitle">
            Join ClaimPoint to report and track lost items
          </p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSignUp}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="form-input"
              disabled={isLoading}
            />
          </div>

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
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="btn-signup"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="login-link">
          Already have an account? <Link to="/user-login">Sign in here</Link>
        </div>
      </div>
    </div>
  );
}
