import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="page">
      <div className="hero">
        <h1>Welcome to ClaimPoint</h1>
        <p>Smart Lost & Found Platform — Easily report, search, and claim lost items with our advanced system.</p>
      </div>

      <div className="cards">
        <article className="card">
          <svg viewBox="0 0 360 200" aria-hidden="true" focusable="false">
            <defs>
              <linearGradient id="bg1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#99ccff" stop-opacity="0.35"/>
                <stop offset="100%" stop-color="#1a73e8" stop-opacity="0.15"/>
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="360" height="200" fill="url(#bg1)" rx="18"/>
            <circle cx="180" cy="100" r="50" fill="#0b7dff"/>
            <circle cx="180" cy="100" r="30" fill="#fff"/>
            <path d="M170 90l10 10l20-20" stroke="#0b7dff" stroke-width="4" fill="none"/>
          </svg>
          <h2>Super Admin</h2>
          <p>Access full system controls, manage users, oversee operations, and handle advanced configurations.</p>
          <Link to="/superadmin-login" className="cta primary">Enter as Super Admin</Link>
        </article>

        <article className="card">
          <svg viewBox="0 0 360 200" aria-hidden="true" focusable="false">
            <defs>
              <linearGradient id="bg2" x1="0%" y1="20%" x2="100%" y2="80%">
                <stop offset="0%" stop-color="#4da3ff" stop-opacity="0.25"/>
                <stop offset="100%" stop-color="#1c5bbf" stop-opacity="0.25"/>
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="360" height="200" fill="url(#bg2)" rx="18"/>
            <rect x="120" y="80" width="120" height="80" fill="#0b7dff" rx="10"/>
            <rect x="140" y="100" width="80" height="40" fill="#fff" rx="5"/>
            <circle cx="180" cy="120" r="10" fill="#0b5fd9"/>
            <rect x="170" y="110" width="20" height="20" fill="#0b5fd9" rx="2"/>
          </svg>
          <h2>Staff</h2>
          <p>Manage lost and found reports, assist users, and handle administrative tasks within the platform.</p>
          <Link to="/staff-login" className="cta primary">Enter as Staff</Link>
        </article>

        <article className="card">
          <svg viewBox="0 0 360 200" aria-hidden="true" focusable="false">
            <defs>
              <linearGradient id="bg3" x1="70%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#c7e3ff" stop-opacity="0.45"/>
                <stop offset="100%" stop-color="#1a73e8" stop-opacity="0.2"/>
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="360" height="200" fill="url(#bg3)" rx="18"/>
            <circle cx="180" cy="100" r="40" fill="#0b7dff"/>
            <circle cx="180" cy="100" r="20" fill="#fff"/>
            <rect x="160" y="80" width="40" height="40" fill="#0b7dff" rx="5"/>
            <circle cx="180" cy="100" r="10" fill="#fff"/>
          </svg>
          <h2>General User (Public)</h2>
          <p>Report lost items, search for found items, and claim your belongings easily through our user-friendly interface.</p>
          <Link to="/user-login" className="cta">Enter as General User</Link>
        </article>
      </div>
    </div>
  );
}
