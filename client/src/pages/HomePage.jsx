import { useEffect, useMemo, useState } from "react";
import { Header, Hero, AuthSection, ItemsSection, Footer } from "../components";

const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
  "http://localhost:5000/api";

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export function HomePage() {
  const [foundItems, setFoundItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [itemsError, setItemsError] = useState("");

  const [authToken, setAuthToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
  });

  const apiHeaders = useMemo(() => {
    const headers = { "Content-Type": "application/json" };
    if (authToken) headers.Authorization = `Bearer ${authToken}`;
    return headers;
  }, [authToken]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setItemsLoading(true);
        setItemsError("");
        const res = await fetch(`${API_BASE}/items/found-items`, {
          headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
        });

        if (!res.ok) throw new Error("Failed to load items");
        const data = await res.json();
        setFoundItems(Array.isArray(data) ? data : []);
      } catch (err) {
        setItemsError(err.message || "Could not load items");
      } finally {
        setItemsLoading(false);
      }
    };

    fetchItems();
  }, [authToken]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: apiHeaders,
        body: JSON.stringify(registerForm),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "Registration failed");
      }

      alert("Registration successful! Check your email for verification.");
      setRegisterForm({ full_name: "", email: "", phone: "", password: "" });
    } catch (err) {
      setAuthError(err.message || "Registration error");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: apiHeaders,
        body: JSON.stringify(loginForm),
      });

      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.message || "Login failed");

      setAuthToken(body.token);
      setLoginForm({ email: "", password: "" });
    } catch (err) {
      setAuthError(err.message || "Login error");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header authToken={authToken} onLogout={handleLogout} />

      <main className="mx-auto max-w-5xl space-y-7 px-7 py-8">
        <Hero />
        <AuthSection
          authToken={authToken}
          authError={authError}
          authLoading={authLoading}
          loginForm={loginForm}
          setLoginForm={setLoginForm}
          onLogin={handleLogin}
          registerForm={registerForm}
          setRegisterForm={setRegisterForm}
          onRegister={handleRegister}
        />
        <ItemsSection
          itemsError={itemsError}
          items={foundItems}
          itemsLoading={itemsLoading}
          formatDate={formatDate}
        />
      </main>

      <Footer apiBase={API_BASE} />
    </div>
  );
}
