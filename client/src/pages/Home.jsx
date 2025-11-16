import { Link } from "react-router-dom";
import "./Home.css";

const Icon = ({ name, size = 20 }) => {
  const icons = {
    staff: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12Z"/>
        <path d="M22 17C22 17.62 21.81 18.22 21.47 18.73C20.98 19.46 20.07 20 19 20C17.95 20 17.04 19.46 16.55 18.73C16.21 18.22 16 17.62 16 17C16 15.34 17.34 14 19 14C20.66 14 22 15.34 22 17Z"/>
        <path d="M2 17C2 17.62 2.21 18.22 2.55 18.73C3.04 19.46 3.95 20 5 20C6.05 20 6.96 19.46 7.45 18.73C7.79 18.22 8 17.62 8 17C8 15.34 6.66 14 5 14C3.34 14 2 15.34 2 17Z"/>
        <path d="M12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"/>
      </svg>
    ),

    user: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z"/>
        <path d="M21 9V7C21 5.9 20.1 5 19 5H5C3.9 5 3 5.9 3 7V9C3 10.1 3.9 11 5 11H19C20.1 11 21 10.1 21 9Z"/>
        <path d="M12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"/>
      </svg>
    ),

    signup: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="10" />
        <path d="M16 12C16 11.45 15.55 11 15 11H13V9C13 8.45 12.55 8 12 8C11.45 8 11 8.45 11 9V11H9C8.45 11 8 11.45 8 12C8 12.55 8.45 13 9 13H11V15C11 15.55 11.45 16 12 16C12.55 16 13 15.55 13 15V13H15C15.55 13 16 12.55 16 12Z" fill="white"/>
      </svg>
    ),
  };

  return <span className="icon">{icons[name]}</span>;
};

export default function Home() {
  return (
    <div className="home-container">
      <div className="home-card">
        <div className="home-header">
          <div className="logo-container">
            <svg
              className="logo-icon"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
          </div>

          <h1 className="home-title">ClaimPoint</h1>

          <p className="home-subtitle">
            Enterprise lost and found management made simple and secure.
          </p>
        </div>

        <div className="button-group">
          <Link to="/staff-login" className="btn-link">
            <button className="btn btn-primary">
              <Icon name="staff" /> Staff Portal
            </button>
          </Link>

          <Link to="/user-login" className="btn-link">
            <button className="btn btn-secondary">
              <Icon name="user" /> User Login
            </button>
          </Link>

          <Link to="/user-signup" className="btn-link">
            <button className="btn btn-success">
              <Icon name="signup" /> Create Account
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
