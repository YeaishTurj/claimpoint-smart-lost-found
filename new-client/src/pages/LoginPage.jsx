import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router"; // Ensure you are using react-router-dom if standard v6
import {
  LogIn,
  Eye,
  EyeOff,
  AlertCircle,
  Loader,
  Search,
  MapPin,
  ShieldCheck,
  Zap,
  Users,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/auth.context";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // Handle CSS animations safely
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-8px); }
        75% { transform: translateX(8px); }
      }
      .animate-fade-in { animation: fadeIn 0.6s ease-out; }
      .animate-shake { animation: shake 0.4s ease-in-out; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid professional email";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Security requires at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const result = await login(email, password);
    if (result.success) {
      toast.success("Welcome back! Syncing your data...", {
        position: "top-center",
        autoClose: 5000,
      });
      setTimeout(() => navigate("/"), 2500);
    } else {
      setErrors({
        submit:
          result.error || "Authentication failed. Please check credentials.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950/20 to-slate-950 flex items-center justify-center p-4 pt-24 pb-8 relative overflow-hidden">
      {/* Subtle animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/8 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "6s" }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "8s", animationDelay: "2s" }}
        />
      </div>

      <div className="max-w-5xl w-full grid lg:grid-cols-2 bg-slate-900/60 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden border border-emerald-500/10 relative z-10 animate-fade-in">
        {/* Left Side: Branding & Features */}
        <div className="hidden lg:flex relative bg-gradient-to-br from-slate-900 via-slate-900/95 to-emerald-950/30 p-8 flex-col justify-between overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-8 group cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform duration-300">
                <Search size={20} className="text-white" />
              </div>
              <span className="text-white font-bold text-xl tracking-tight">
                ClaimPoint
              </span>
            </div>

            <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">
              Smart{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
                Lost & Found
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                Management
              </span>
            </h2>
            <p className="text-slate-300 text-base max-w-md leading-relaxed">
              Digitalize your lost and found operations. Efficiently manage,
              track, and reunite items.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="relative z-10 grid grid-cols-2 gap-3">
            <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-emerald-500/20 hover:bg-white/10 transition-all group">
              <ShieldCheck
                size={24}
                className="text-emerald-400 mb-2 group-hover:scale-110 transition-transform"
              />
              <p className="text-white text-xs font-bold">Secure Platform</p>
              <p className="text-slate-400 text-[10px]">
                Protected data & claims
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-teal-500/20 hover:bg-white/10 transition-all group">
              <Zap
                size={24}
                className="text-teal-400 mb-2 group-hover:scale-110 transition-transform"
              />
              <p className="text-white text-xs font-bold">AI Matching</p>
              <p className="text-slate-400 text-[10px]">Smart auto-linking</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-cyan-500/20 hover:bg-white/10 transition-all group">
              <MapPin
                size={24}
                className="text-cyan-400 mb-2 group-hover:scale-110 transition-transform"
              />
              <p className="text-white text-xs font-bold">Item Tracking</p>
              <p className="text-slate-400 text-[10px]">Real-time status</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-amber-500/20 hover:bg-white/10 transition-all group">
              <Users
                size={24}
                className="text-amber-400 mb-2 group-hover:scale-110 transition-transform"
              />
              <p className="text-white text-xs font-bold">Multi-Role</p>
              <p className="text-slate-400 text-[10px]">Admin & Staff Access</p>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-6 md:p-10 lg:p-12 flex flex-col justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="lg:hidden flex items-center gap-2.5 mb-6 justify-center">
            <div className="w-9 h-9 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Search size={18} className="text-white" />
            </div>
            <span className="text-white font-bold text-lg">ClaimPoint</span>
          </div>

          <div className="mb-8 text-center lg:text-left">
            <h3 className="text-2xl font-bold text-white mb-2">Welcome Back</h3>
            <p className="text-slate-300 text-sm">
              Sign in to manage operations
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {errors.submit && (
              <div className="p-4 bg-red-500/10 border-l-4 border-red-400 rounded-r-2xl flex items-center gap-3 animate-shake">
                <AlertCircle className="text-red-400 shrink-0" size={20} />
                <p className="text-sm text-red-300 font-semibold">
                  {errors.submit}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-200 mb-2.5">
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
                className={`w-full h-12 bg-slate-900/50 border-2 rounded-xl px-4 text-white outline-none transition-all ${
                  errors.email
                    ? "border-red-500/50 focus:border-red-400"
                    : "border-slate-700 focus:border-emerald-500"
                }`}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-2 font-semibold">
                  {errors.email}
                </p>
              )}
            </div>

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
                    if (errors.password) setErrors({ ...errors, password: "" });
                  }}
                  className={`w-full h-12 bg-slate-900/50 border-2 rounded-xl px-4 pr-12 text-white outline-none transition-all ${
                    errors.password
                      ? "border-red-500/50 focus:border-red-400"
                      : "border-slate-700 focus:border-emerald-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-400 p-1.5"
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2.5 disabled:opacity-70 mt-4"
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign in to Dashboard</span>
                  <LogIn size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-400 text-sm">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-emerald-400 font-bold hover:underline"
              >
                Join our community
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
