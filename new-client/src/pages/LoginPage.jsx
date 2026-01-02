import React, { useState } from "react";
import { useNavigate, Link } from "react-router"; // Ensure this is 'react-router-dom' if not using v7
import { LogIn, Eye, EyeOff, AlertCircle, Loader } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../context/auth.context";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth(); // Note: matches use below

  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

    const result = await login(email, password);

    if (result.success) {
      toast.success("Login successful! Redirecting...", {
        position: "top-center",
        autoClose: 2000,
      });

      // Navigate to home after short delay
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } else {
      setErrors({
        submit: result.error || "Invalid credentials",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center px-4 py-12">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Main Card */}
      <div className="relative w-full max-w-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-400/20 rounded-2xl blur-xl" />

        <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                <LogIn size={24} className="text-white" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                Authentication
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Login to ClaimPoint
            </h1>
            <p className="text-slate-400 text-sm">
              Sign in with your account to access ClaimPoint
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

          <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="your@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
                className={`w-full rounded-lg border px-4 py-3 text-white placeholder-slate-500 transition-all bg-slate-800/50 focus:outline-none ${
                  errors.email
                    ? "border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                    : "border-slate-700/50 hover:border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
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
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: "" });
                  }}
                  className={`w-full rounded-lg border px-4 py-3 pr-12 text-white placeholder-slate-500 transition-all bg-slate-800/50 focus:outline-none ${
                    errors.password
                      ? "border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-slate-700/50 hover:border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-400 transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-400 mt-1.5">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-600 bg-slate-800 checked:bg-blue-600 cursor-pointer"
                />
                <span className="text-slate-400 group-hover:text-slate-300 transition">
                  Remember me
                </span>
              </label>
              <Link
                to="/forgot-password"
                size="sm"
                className="text-blue-400 hover:text-blue-300 transition font-medium"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-3 font-semibold text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
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

          <div className="mt-8 text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-400 hover:text-blue-300 font-semibold transition"
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
