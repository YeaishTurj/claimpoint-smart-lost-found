import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import {
  UserPlus,
  Eye,
  EyeOff,
  AlertCircle,
  Loader,
  Search,
  MapPin,
  Clock,
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
      toast.success(
        "Email sent! Please check your inbox for verification code.",
        {
          position: "top-center",
          autoClose: 5000,
        }
      );

      // Give toast time to be visible before navigating
      setTimeout(() => {
        navigate("/verify-email", {
          state: { email },
        });
      }, 2000);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950/20 to-slate-950 flex items-center justify-center p-4 pt-24 pb-8 relative overflow-hidden">
      {/* Sophisticated gradient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/8 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "6s" }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "8s", animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/4 right-1/3 w-72 h-72 bg-cyan-500/6 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "10s", animationDelay: "1s" }}
        />
      </div>

      {/* Main Container */}
      <div className="max-w-5xl w-full grid lg:grid-cols-2 bg-slate-900/60 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden border border-emerald-500/10 relative z-10 animate-fade-in">
        {/* Left Side: Registration Form */}
        <div className="p-6 md:p-10 lg:p-12 flex flex-col justify-center bg-slate-900/40 backdrop-blur-sm">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-6 justify-center">
            <div className="w-9 h-9 bg-emerald-500 rounded-lg flex items-center justify-center">
              <UserPlus size={18} className="text-white" />
            </div>
            <span className="text-white font-bold text-lg">ClaimPoint</span>
          </div>

          <div className="mb-8 text-center lg:text-left">
            <h3 className="text-2xl font-bold text-white mb-2">
              Join ClaimPoint
            </h3>
            <p className="text-slate-300 text-sm">
              Create an account to report lost items or claim found belongings
            </p>
          </div>

          {errors.submit && (
            <div className="p-4 bg-red-500/10 border-l-4 border-red-400 rounded-r-2xl flex items-center gap-3 animate-shake mb-6">
              <AlertCircle className="text-red-400 shrink-0" size={20} />
              <p className="text-sm text-red-300 font-semibold">
                {errors.submit}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-slate-200 mb-2.5">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    clearFieldError("fullName");
                  }}
                  className={`w-full h-12 bg-slate-900/50 border-2 rounded-xl px-4 transition-all duration-200 outline-none text-white placeholder-slate-500 font-medium hover:bg-slate-900/70 ${
                    errors.fullName
                      ? "border-red-500/50 focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
                      : "border-slate-700 focus:border-emerald-500 focus:bg-slate-900/70 focus:ring-2 focus:ring-emerald-500/20"
                  }`}
                />
                {errors.fullName && (
                  <p className="text-red-400 text-xs mt-2 font-semibold">
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-200 mb-2.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    clearFieldError("phone");
                  }}
                  className={`w-full h-12 bg-slate-900/50 border-2 rounded-xl px-4 transition-all duration-200 outline-none text-white placeholder-slate-500 font-medium hover:bg-slate-900/70 ${
                    errors.phone
                      ? "border-red-500/50 focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
                      : "border-slate-700 focus:border-emerald-500 focus:bg-slate-900/70 focus:ring-2 focus:ring-emerald-500/20"
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-400 text-xs mt-2 font-semibold">
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-200 mb-2.5">
                Email Address
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearFieldError("email");
                }}
                className={`w-full h-12 bg-slate-900/50 border-2 rounded-xl px-4 transition-all duration-200 outline-none text-white placeholder-slate-500 font-medium hover:bg-slate-900/70 ${
                  errors.email
                    ? "border-red-500/50 focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
                    : "border-slate-700 focus:border-emerald-500 focus:bg-slate-900/70 focus:ring-2 focus:ring-emerald-500/20"
                }`}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-2 font-semibold">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-slate-200 mb-2.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      clearFieldError("password");
                    }}
                    className={`w-full h-12 bg-slate-900/50 border-2 rounded-xl px-4 pr-12 transition-all duration-200 outline-none text-white placeholder-slate-500 font-medium hover:bg-slate-900/70 ${
                      errors.password
                        ? "border-red-500/50 focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
                        : "border-slate-700 focus:border-emerald-500 focus:bg-slate-900/70 focus:ring-2 focus:ring-emerald-500/20"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-400 p-1.5 rounded-lg hover:bg-slate-700/50 transition-all"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-xs mt-2 font-semibold">
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-200 mb-2.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      clearFieldError("confirmPassword");
                    }}
                    className={`w-full h-12 bg-slate-900/50 border-2 rounded-xl px-4 pr-12 transition-all duration-200 outline-none text-white placeholder-slate-500 font-medium hover:bg-slate-900/70 ${
                      errors.confirmPassword
                        ? "border-red-500/50 focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
                        : "border-slate-700 focus:border-emerald-500 focus:bg-slate-900/70 focus:ring-2 focus:ring-emerald-500/20"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-400 p-1.5 rounded-lg hover:bg-slate-700/50 transition-all"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-xs mt-2 font-semibold">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2.5 disabled:opacity-70 mt-4"
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <UserPlus size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-400 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-emerald-400 font-bold hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side: Branding & Features */}
        <div className="hidden lg:flex relative bg-gradient-to-br from-slate-900 via-slate-900/95 to-emerald-950/30 p-8 flex-col justify-between overflow-hidden">
          {/* Animated Background Gradients */}
          <div
            className="absolute top-0 left-0 w-72 h-72 bg-emerald-500/20 blur-[120px] rounded-full animate-pulse"
            style={{ animationDuration: "5s" }}
          />
          <div
            className="absolute bottom-0 right-0 w-64 h-64 bg-teal-500/15 blur-[100px] rounded-full animate-pulse"
            style={{ animationDuration: "7s", animationDelay: "1s" }}
          />

          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-8 group cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform duration-300">
                <UserPlus size={20} className="text-white" />
              </div>
              <span className="text-white font-bold text-xl tracking-tight">
                ClaimPoint
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">
              Join Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
                Community
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                Today
              </span>
            </h2>
            <p className="text-slate-300 text-base max-w-md leading-relaxed">
              For students and public users. Report lost items, claim found
              belongings, and help reunite people with what matters to them.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="relative z-10 grid grid-cols-2 gap-3">
            <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-emerald-500/20 hover:bg-white/10 transition-all group">
              <UserPlus
                className="text-emerald-400 mb-2 group-hover:scale-110 transition-transform"
                size={24}
              />
              <p className="text-white text-xs font-bold">Free Registration</p>
              <p className="text-slate-400 text-[10px]">
                For all students & public
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-teal-500/20 hover:bg-white/10 transition-all group">
              <Search
                className="text-teal-400 mb-2 group-hover:scale-110 transition-transform"
                size={24}
              />
              <p className="text-white text-xs font-bold">Report Items</p>
              <p className="text-slate-400 text-[10px]">
                Lost something? Post it
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-cyan-500/20 hover:bg-white/10 transition-all group">
              <MapPin
                className="text-cyan-400 mb-2 group-hover:scale-110 transition-transform"
                size={24}
              />
              <p className="text-white text-xs font-bold">Claim Found</p>
              <p className="text-slate-400 text-[10px]">See something yours?</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-amber-500/20 hover:bg-white/10 transition-all group">
              <Clock
                className="text-amber-400 mb-2 group-hover:scale-110 transition-transform"
                size={24}
              />
              <p className="text-white text-xs font-bold">Instant Alerts</p>
              <p className="text-slate-400 text-[10px]">
                Get notified instantly
              </p>
            </div>
          </div>

          {/* Note */}
          <div className="relative z-10 mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <p className="text-amber-200 text-sm font-medium">
              <span className="font-bold">Note:</span> Staff and Admin accounts
              are created by administrators only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

// Add custom animations
const style = document.createElement("style");
style.textContent = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-8px); }
    75% { transform: translateX(8px); }
  }

  .animate-fade-in {
    animation: fadeIn 0.6s ease-out;
  }

  .animate-shake {
    animation: shake 0.4s ease-in-out;
  }
`;
if (typeof document !== "undefined") {
  document.head.appendChild(style);
}
