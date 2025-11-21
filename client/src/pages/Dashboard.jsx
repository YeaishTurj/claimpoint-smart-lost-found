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

  const getRoleBenefits = (role) => {
    const baseBenefits = [
      "Real-time visibility into claims and matches",
      "Centralized access from any device",
      "Guided workflows that reduce resolution time",
    ];

    const roleSpecific = {
      superadmin: [
        "Configure locations, teams, and permissions",
        "Audit access with accountability in mind",
        "Oversee data quality across all records",
      ],
      staff: [
        "Log found items and track claimant details",
        "Coordinate timely returns with clear status updates",
        "Escalate edge cases while keeping context intact",
      ],
      user: [
        "View the status of your reported items",
        "Share accurate details to speed up verification",
        "Receive updates without losing the thread",
      ],
    };

    return [...baseBenefits, ...(roleSpecific[role] || [])];
  };

  const quickStats = [
    {
      label: "Access Level",
      value: user ? getRoleDisplay(user.role) : "—",
      hint: "Personalized tools based on your role",
    },
    {
      label: "Session Status",
      value: "Secure & Active",
      hint: "Remember to sign out on shared devices",
    },
    {
      label: "Focus",
      value: "Fast Resolution",
      hint: "Prioritize clear details for every case",
    },
  ];

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
          <div className="dashboard-eyebrow">Account overview</div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">
            Welcome back to ClaimPoint
          </p>
        </div>

        <div className="stats-grid">
          {quickStats.map((stat) => (
            <div className="stat-card" key={stat.label}>
              <p className="stat-label">{stat.label}</p>
              <p className="stat-value">{stat.value}</p>
              <p className="stat-hint">{stat.hint}</p>
            </div>
          ))}
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

        <div className="benefits-card">
          <div className="benefits-header">
            <p className="benefits-eyebrow">Stay on track</p>
            <h3>What you can expect here</h3>
            <p className="benefits-subtext">
              A concise view of how to make the most of this workspace.
            </p>
          </div>
          <ul className="benefits-list">
            {getRoleBenefits(user.role).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
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
