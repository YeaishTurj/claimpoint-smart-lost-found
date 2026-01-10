import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router";
import {
  Mail,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Loader,
  Clock,
} from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../context/auth.context";

const VerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const { verifyEmail, resendVerificationCode, isLoading } = useAuth();

  // Form States
  const [verificationCode, setVerificationCode] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [errors, setErrors] = useState({});

  // Redirect if no email provided
  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  // Handle resend cooldown
  useEffect(() => {
    let interval;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Validate verification code
  const validateCode = () => {
    const newErrors = {};
    if (!verificationCode.trim()) {
      newErrors.code = "Verification code is required";
    } else if (verificationCode.length !== 6) {
      newErrors.code = "Code must be exactly 6 digits";
    } else if (!/^\d{6}$/.test(verificationCode)) {
      newErrors.code = "Code must contain only numbers";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateCode()) return;

    const result = await verifyEmail(verificationCode, email);

    if (result.success) {
      toast.success("Registration complete! Welcome to ClaimPoint 🎉", {
        position: "top-center",
        autoClose: 5000,
      });

      // Navigate to home after delay
      setTimeout(() => {
        navigate("/");
      }, 2500);
    } else {
      setErrors({
        submit: result.error || "Verification failed. Please check your code.",
      });
    }
  };

  // Handle resend code
  const handleResendCode = async () => {
    setErrors({});
    setResendLoading(true);

    const result = await resendVerificationCode(email);

    setResendLoading(false);

    if (result.success) {
      toast.success(result.message || "New code sent to your email!", {
        position: "top-center",
        autoClose: 5000,
      });
      setResendCooldown(60);
    } else {
      toast.error(result.error || "Failed to resend code", {
        position: "top-center",
        autoClose: 4000,
      });
    }
  };

  if (!email) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950/20 to-slate-950 flex items-center justify-center px-4 py-24 relative overflow-hidden">
      {/* Animated background elements */}
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
          className="absolute top-1/2 right-1/3 w-72 h-72 bg-cyan-500/6 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "5s", animationDelay: "4s" }}
        />
      </div>

      <div className="w-full max-w-lg relative z-10">
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-emerald-500/10 p-6 md:p-10 lg:p-12">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-emerald-400 mb-6 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Registration
          </Link>

          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                <Mail size={24} className="text-white" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                Verification
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Verify Your Email
            </h1>
            <p className="text-slate-300 text-sm mb-2">
              We've sent a 6-digit code to:
            </p>
            <p className="text-emerald-400 font-medium text-sm break-all">
              {email}
            </p>
          </div>

          {errors.submit && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
              <AlertCircle
                size={20}
                className="text-red-400 mt-0.5 flex-shrink-0"
              />
              <div>
                <p className="text-sm font-medium text-red-400">
                  Verification Error
                </p>
                <p className="text-xs text-red-300 mt-1">{errors.submit}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="000000"
                maxLength="6"
                value={verificationCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setVerificationCode(value);
                  if (errors.code) setErrors({ ...errors, code: "" });
                }}
                className={`w-full rounded-xl border-2 px-4 py-3 text-center text-2xl font-bold tracking-widest text-white transition-all bg-slate-900/50 focus:outline-none ${
                  errors.code
                    ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                    : "border-slate-700 hover:bg-slate-900/70 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                }`}
              />
              {errors.code && (
                <p className="text-xs text-red-400 mt-1.5">{errors.code}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || verificationCode.length !== 6}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-4 py-3 font-semibold text-white transition-all disabled:opacity-60 shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader size={18} className="animate-spin" /> Verifying...
                </>
              ) : (
                <>
                  <CheckCircle size={18} /> Verify Email
                </>
              )}
            </button>
          </form>

          <div className="mt-8 p-4 bg-slate-800/40 border border-slate-700/50 rounded-lg">
            <p className="text-sm text-slate-300 mb-4">
              Didn't receive the code?
            </p>
            {resendCooldown > 0 ? (
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Clock size={16} />
                <span>Resend available in {resendCooldown}s</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleResendCode}
                disabled={resendLoading}
                className="w-full px-4 py-2.5 rounded-lg border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition-all font-medium text-sm flex items-center justify-center gap-2"
              >
                {resendLoading ? (
                  <>
                    <Loader size={16} className="animate-spin" /> Sending...
                  </>
                ) : (
                  "Resend Code"
                )}
              </button>
            )}
          </div>

          <div className="mt-6 text-center text-sm text-slate-600">
            Wrong email?{" "}
            <Link
              to="/register"
              className="text-primary-600 hover:text-primary-700 font-semibold transition"
            >
              Go back
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;
