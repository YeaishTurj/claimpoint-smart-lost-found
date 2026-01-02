import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { api } from "../lib/api";
import {
  UserPlus,
  Eye,
  EyeOff,
  AlertCircle,
  Loader,
  ArrowLeft,
} from "lucide-react";
import { toast } from "react-toastify";

const RegisterPage = () => {
  const navigate = useNavigate();

  // Form States
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (fullName.trim().length < 3) {
      newErrors.fullName = "Full name must be at least 3 characters";
    }

    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (phone.trim().length < 10) {
      newErrors.phone = "Phone number must be at least 10 characters";
    }

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

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
      const payload = {
        full_name: fullName,
        phone,
        email,
        password,
      };

      const res = await api.post("/auth/register", payload);

      toast.success("OTP sent to your email! Check your inbox.", {
        position: "top-right",
        autoClose: 3000,
      });

      navigate("/verify-email", {
        state: { email },
      });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Registration failed";

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

  const clearFieldError = (field) => {
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

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
          {/* Back Button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-300 mb-6 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg">
                <UserPlus size={24} className="text-white" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary-400">
                Join Us
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Create Your Account
            </h1>
            <p className="text-slate-400 text-sm">
              General users can report lost items and claim found items. Staff
              and Admin accounts are created by administrators only.
            </p>
          </div>

          {/* Info Alert */}
          <div className="mb-6 p-3 bg-primary-500/10 border border-primary-500/30 rounded-lg flex items-start gap-2">
            <span className="text-primary-400 font-bold text-sm">✓</span>
            <p className="text-xs text-primary-300">
              Registration is available for general users only.
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
                <p className="text-sm font-medium text-red-400">
                  Registration Error
                </p>
                <p className="text-xs text-red-300 mt-1">{errors.submit}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name & Phone - Two Columns */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-xs font-semibold uppercase tracking-widest text-slate-300 mb-2"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    clearFieldError("fullName");
                  }}
                  className={`w-full rounded-lg border px-4 py-3 text-white placeholder-slate-500 transition-all bg-slate-800/50 focus:outline-none ${
                    errors.fullName
                      ? "border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-slate-700/50 hover:border-slate-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                  }`}
                />
                {errors.fullName && (
                  <p className="text-xs text-red-400 mt-1.5">
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-xs font-semibold uppercase tracking-widest text-slate-300 mb-2"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+880 1700-000000"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    clearFieldError("phone");
                  }}
                  className={`w-full rounded-lg border px-4 py-3 text-white placeholder-slate-500 transition-all bg-slate-800/50 focus:outline-none ${
                    errors.phone
                      ? "border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-slate-700/50 hover:border-slate-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                  }`}
                />
                {errors.phone && (
                  <p className="text-xs text-red-400 mt-1.5">{errors.phone}</p>
                )}
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
                  clearFieldError("email");
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

            {/* Password & Confirm - Two Columns */}
            <div className="grid grid-cols-2 gap-4">
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
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      clearFieldError("password");
                    }}
                    className={`w-full rounded-lg border px-4 py-3 pr-10 text-white placeholder-slate-500 transition-all bg-slate-800/50 focus:outline-none ${
                      errors.password
                        ? "border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                        : "border-slate-700/50 hover:border-slate-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-primary-400 transition"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-400 mt-1.5">
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-semibold uppercase tracking-widest text-slate-300 mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      clearFieldError("confirmPassword");
                    }}
                    className={`w-full rounded-lg border px-4 py-3 pr-10 text-white placeholder-slate-500 transition-all bg-slate-800/50 focus:outline-none ${
                      errors.confirmPassword
                        ? "border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                        : "border-slate-700/50 hover:border-slate-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-primary-400 transition"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-400 mt-1.5">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-3 font-semibold text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary-500/50 flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary-400 hover:text-primary-300 font-semibold transition"
            >
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
