import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/");
    }
  }, [navigate]);

  if (!user) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-card">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const getRoleDisplay = (role) => {
    switch (role) {
      case "superadmin":
        return "Super Administrator";
      case "staff":
        return "Staff Member";
      case "user":
        return "User";
      default:
        return role;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "superadmin":
        return "#dc2626";
      case "staff":
        return "#005dff";
      case "user":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">
            Welcome back to ClaimPoint
          </p>
        </div>

        <div className="user-info-card">
          <div className="user-avatar">
            <div className="avatar-circle">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="user-details">
            <h2 className="user-name">{user.name}</h2>
            <p className="user-email">{user.email}</p>
            <span
              className="user-role"
              style={{ backgroundColor: getRoleColor(user.role) }}
            >
              {getRoleDisplay(user.role)}
            </span>
          </div>
        </div>

        <div className="dashboard-actions">
          <div className="action-card">
            <h3>Quick Actions</h3>
            <p>Access common features and manage your account</p>
            <div className="action-buttons">
              <button className="btn btn-primary" onClick={() => navigate("/")}>
                Back to Home
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  localStorage.clear();
                  navigate("/");
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
