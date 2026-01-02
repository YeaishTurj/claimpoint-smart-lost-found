import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router";
import { api } from "../lib/api";
import {
  Mail,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Loader,
  Clock,
} from "lucide-react";
import { toast } from "react-toastify";

const VerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  // Form States
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
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

    if (!validateCode()) {
      return;
    }

    setLoading(true);

    try {
      const response = await api.get("/auth/verify-email", {
        params: {
          code: verificationCode,
          email: email,
        },
      });

      // Show success toast
      toast.success("Email verified successfully! Logging in...", {
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
        error.response?.data?.message || error.message || "Verification failed";

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

  // Handle resend code
  const handleResendCode = async () => {
    setErrors({});
    setResendLoading(true);

    try {
      const response = await api.get("/auth/resend-verification-code", {
        params: { email },
      });

      toast.success(response.data.message || "New code sent to your email!", {
        position: "top-right",
        autoClose: 3000,
      });

      // Set cooldown for 60 seconds
      setResendCooldown(60);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to resend code";

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 4000,
      });
    } finally {
      setResendLoading(false);
    }
  };

  if (!email) {
    return null;
  }

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
            to="/register"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-300 mb-6 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Registration
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg">
                <Mail size={24} className="text-white" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary-400">
                Verification
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Verify Your Email
            </h1>
            <p className="text-slate-400 text-sm mb-2">
              We've sent a 6-digit code to:
            </p>
            <p className="text-primary-400 font-medium text-sm break-all">
              {email}
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
                  Verification Error
                </p>
                <p className="text-xs text-red-300 mt-1">{errors.submit}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Verification Code Input */}
            <div>
              <label
                htmlFor="code"
                className="block text-xs font-semibold uppercase tracking-widest text-slate-300 mb-2"
              >
                Verification Code
              </label>
              <input
                id="code"
                type="text"
                inputMode="numeric"
                placeholder="000000"
                maxLength="6"
                value={verificationCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setVerificationCode(value);
                  if (errors.code) {
                    setErrors({ ...errors, code: "" });
                  }
                }}
                className={`w-full rounded-lg border px-4 py-4 text-center text-2xl font-bold tracking-widest text-white placeholder-slate-500 transition-all bg-slate-800/50 focus:outline-none ${
                  errors.code
                    ? "border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                    : "border-slate-700/50 hover:border-slate-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                }`}
              />
              {errors.code && (
                <p className="text-xs text-red-400 mt-1.5">{errors.code}</p>
              )}
              <p className="text-xs text-slate-500 mt-2">
                Enter the 6-digit code from your email
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || verificationCode.length !== 6}
              className="w-full rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-3 font-semibold text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary-500/50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  Verify Email
                </>
              )}
            </button>
          </form>

          {/* Resend Code Section */}
          <div className="mt-8 p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg">
            <p className="text-sm text-slate-400 mb-4">
              Didn't receive the code?
            </p>
            {resendCooldown > 0 ? (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Clock size={16} />
                <span>Resend available in {resendCooldown}s</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleResendCode}
                disabled={resendLoading || resendCooldown > 0}
                className="w-full px-4 py-2.5 rounded-lg border border-primary-500/50 text-primary-400 hover:text-primary-300 hover:border-primary-400 hover:bg-primary-500/10 transition-all disabled:opacity-60 disabled:cursor-not-allowed font-medium text-sm flex items-center justify-center gap-2"
              >
                {resendLoading ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Resend Code"
                )}
              </button>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-slate-400">
            Wrong email?{" "}
            <Link
              to="/register"
              className="text-primary-400 hover:text-primary-300 font-semibold transition"
            >
              Go back to registration
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;
