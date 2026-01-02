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
      toast.success("Email verified successfully!", {
        position: "top-center",
        autoClose: 2000,
      });

      // Navigate to home after short delay
      setTimeout(() => {
        navigate("/");
      }, 1500);
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
        autoClose: 3000,
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center px-4 py-12">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-400/20 rounded-2xl blur-xl" />

        <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-300 mb-6 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Registration
          </Link>

          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                <Mail size={24} className="text-white" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                Verification
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Verify Your Email
            </h1>
            <p className="text-slate-400 text-sm mb-2">
              We've sent a 6-digit code to:
            </p>
            <p className="text-blue-400 font-medium text-sm break-all">
              {email}
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
                  Verification Error
                </p>
                <p className="text-xs text-red-300 mt-1">{errors.submit}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-slate-300 mb-2">
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
                className={`w-full rounded-lg border px-4 py-4 text-center text-2xl font-bold tracking-widest text-white transition-all bg-slate-800/50 focus:outline-none ${
                  errors.code
                    ? "border-red-500/50 focus:border-red-500"
                    : "border-slate-700/50 focus:border-blue-500"
                }`}
              />
              {errors.code && (
                <p className="text-xs text-red-400 mt-1.5">{errors.code}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || verificationCode.length !== 6}
              className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-3 font-semibold text-white transition-all disabled:opacity-60 hover:shadow-lg hover:shadow-blue-500/50 flex items-center justify-center gap-2"
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
                disabled={resendLoading}
                className="w-full px-4 py-2.5 rounded-lg border border-blue-500/50 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-all font-medium text-sm flex items-center justify-center gap-2"
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

          <div className="mt-6 text-center text-sm text-slate-400">
            Wrong email?{" "}
            <Link
              to="/register"
              className="text-blue-400 hover:text-blue-300 font-semibold transition"
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
