import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { LogIn, Eye, EyeOff, AlertCircle, Loader } from "lucide-react";
import { toast } from "react-toastify";
import { api } from "../lib/api";

const LoginPage = () => {
  const navigate = useNavigate();

  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      // Show success toast
      toast.success("Login successful! Redirecting...", {
        position: "top-right",
        autoClose: 2000,
      });

      // Store user data in localStorage (optional)
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      // Navigate to home after short delay
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Login failed";

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 4000,
      });

      setErrors({
        submit: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: "user", label: "General User" },
    { value: "staff", label: "Staff" },
    { value: "admin", label: "Admin" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center px-4 py-12">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-primary-500/5 rounded-full blur-3xl" />
      </div>

      {/* Main Card */}
      <div className="relative w-full max-w-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-primary-400/20 rounded-2xl blur-xl" />

        <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg">
                <LogIn size={24} className="text-white" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary-400">
                Authentication
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Login to ClaimPoint
            </h1>
            <p className="text-slate-400 text-sm">
              Sign in with your existing account to access ClaimPoint
            </p>
          </div>

          {/* Error Alert */}
          {errors.submit && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
              <AlertCircle
                size={20}
                className="text-red-400 mt-0.5 flex-shrink-0"
              />
              <div>
                <p className="text-sm font-medium text-red-400">Login Error</p>
                <p className="text-xs text-red-300 mt-1">{errors.submit}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-slate-300 mb-3">
                Select Your Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                {roleOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSelectedRole(option.value)}
                    className={`py-2.5 px-3 rounded-lg font-semibold text-sm transition-all ${
                      selectedRole === option.value
                        ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/50"
                        : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-slate-700/50"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-widest text-slate-300 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors({ ...errors, email: "" });
                  }
                }}
                className={`w-full rounded-lg border px-4 py-3 text-white placeholder-slate-500 transition-all bg-slate-800/50 focus:outline-none ${
                  errors.email
                    ? "border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                    : "border-slate-700/50 hover:border-slate-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                }`}
              />
              {errors.email && (
                <p className="text-xs text-red-400 mt-1.5">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-widest text-slate-300 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) {
                      setErrors({ ...errors, password: "" });
                    }
                  }}
                  className={`w-full rounded-lg border px-4 py-3 pr-12 text-white placeholder-slate-500 transition-all bg-slate-800/50 focus:outline-none ${
                    errors.password
                      ? "border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-slate-700/50 hover:border-slate-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-primary-400 transition"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-400 mt-1.5">{errors.password}</p>
              )}
            </div>

            {/* Remember & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-600 bg-slate-800 checked:bg-primary-600 cursor-pointer"
                />
                <span className="text-slate-400 group-hover:text-slate-300 transition">
                  Remember me
                </span>
              </label>
              <Link
                to="/forgot-password"
                className="text-primary-400 hover:text-primary-300 transition font-medium"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-3 font-semibold text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary-500/50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary-400 hover:text-primary-300 font-semibold transition"
            >
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
