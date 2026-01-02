import React, { useState } from "react";
import { useNavigate, Link } from "react-router"; // Standard for React Router
import {
  UserPlus,
  Eye,
  EyeOff,
  AlertCircle,
  Loader,
  ArrowLeft,
} from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../context/auth.context";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();

  // Form States
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    if (!validateForm()) return;

    const payload = {
      full_name: fullName,
      phone,
      email,
      password,
    };

    const result = await register(payload);

    if (result.success) {
      toast.success("Registration successful! Please verify your email.", {
        position: "top-center",
        autoClose: 3000,
      });

      navigate("/verify-email", {
        state: { email },
      });
    } else {
      setErrors({
        submit: result.error || "Registration failed. Please try again.",
      });
    }
  };

  const clearFieldError = (field) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center px-4 py-12">
      {/* Background Decorative Blur */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-400/20 rounded-2xl blur-xl" />

        <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-300 mb-6 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                <UserPlus size={24} className="text-white" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                Join Us
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Create Your Account
            </h1>
            <p className="text-slate-400 text-sm">
              General users can report lost items and claim found items.
            </p>
          </div>

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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    clearFieldError("fullName");
                  }}
                  className={`w-full rounded-lg border px-4 py-3 text-white bg-slate-800/50 focus:outline-none transition-all ${
                    errors.fullName
                      ? "border-red-500/50 focus:border-red-500"
                      : "border-slate-700/50 focus:border-blue-500"
                  }`}
                />
                {errors.fullName && (
                  <p className="text-xs text-red-400 mt-1">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-300 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    clearFieldError("phone");
                  }}
                  className={`w-full rounded-lg border px-4 py-3 text-white bg-slate-800/50 focus:outline-none transition-all ${
                    errors.phone
                      ? "border-red-500/50 focus:border-red-500"
                      : "border-slate-700/50 focus:border-blue-500"
                  }`}
                />
                {errors.phone && (
                  <p className="text-xs text-red-400 mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-slate-300 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearFieldError("email");
                }}
                className={`w-full rounded-lg border px-4 py-3 text-white bg-slate-800/50 focus:outline-none transition-all ${
                  errors.email
                    ? "border-red-500/50 focus:border-red-500"
                    : "border-slate-700/50 focus:border-blue-500"
                }`}
              />
              {errors.email && (
                <p className="text-xs text-red-400 mt-1">{errors.email}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-300 mb-2">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearFieldError("password");
                  }}
                  className={`w-full rounded-lg border px-4 py-3 text-white bg-slate-800/50 focus:outline-none transition-all ${
                    errors.password
                      ? "border-red-500/50 focus:border-red-500"
                      : "border-slate-700/50 focus:border-blue-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[38px] text-slate-500 hover:text-blue-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {errors.password && (
                  <p className="text-xs text-red-400 mt-1">{errors.password}</p>
                )}
              </div>

              <div className="relative">
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-300 mb-2">
                  Confirm
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    clearFieldError("confirmPassword");
                  }}
                  className={`w-full rounded-lg border px-4 py-3 text-white bg-slate-800/50 focus:outline-none transition-all ${
                    errors.confirmPassword
                      ? "border-red-500/50 focus:border-red-500"
                      : "border-slate-700/50 focus:border-blue-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-[38px] text-slate-500 hover:text-blue-400"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-3 font-semibold text-white transition-all disabled:opacity-60 hover:shadow-lg hover:shadow-blue-500/50 flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? (
                <>
                  <Loader size={18} className="animate-spin" /> Creating
                  Account...
                </>
              ) : (
                <>
                  <UserPlus size={18} /> Create Account
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-400 hover:text-blue-300 font-semibold transition"
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
