import React, { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import { toast } from "react-toastify";
import { Eye, EyeOff, Loader, CheckCircle, Lock } from "lucide-react";
import { PageShell } from "../components/layout";
import api from "../services/api.js";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!resetCode.trim()) {
      newErrors.resetCode = "Reset code is required";
    } else if (resetCode.trim().length !== 6) {
      newErrors.resetCode = "Reset code must be 6 digits";
    }

    if (!newPassword) {
      newErrors.newPassword = "Password is required";
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearFieldError = (field) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await api.resetPassword(
        email,
        resetCode.trim(),
        newPassword,
      );

      // Check success flag in response
      if (response.success) {
        setResetSuccess(true);
        toast.success("Password reset successfully! Redirecting to login...", {
          position: "bottom-right",
          theme: "dark",
        });
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        // Show error message from backend
        toast.error(response.message || "Failed to reset password", {
          position: "bottom-right",
          theme: "dark",
        });
      }
    } catch (error) {
      toast.error(error.message || "Failed to reset password", {
        position: "bottom-right",
        theme: "dark",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) {
    return (
      <PageShell
        className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 min-h-screen flex items-center justify-center"
        containerClassName="max-w-md"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-slate-900/40 backdrop-blur-xl border border-emerald-500/20 rounded-3xl p-8 md:p-10"
        >
          <h2 className="text-2xl font-bold text-white mb-4">
            Invalid Reset Link
          </h2>
          <p className="text-slate-400 mb-8">
            The password reset link is missing required information.
          </p>
          <Link
            to="/forgot-password"
            className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-xl transition-all"
          >
            Request New Reset Link
          </Link>
        </motion.div>
      </PageShell>
    );
  }

  if (resetSuccess) {
    return (
      <PageShell
        className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 min-h-screen flex items-center justify-center"
        containerClassName="max-w-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-16 h-16 bg-emerald-500/20 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle size={32} className="text-emerald-400" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Password Reset Successful!
          </h2>
          <p className="text-slate-300 mb-8">
            Your password has been successfully reset. You will be redirected to
            login shortly.
          </p>
        </motion.div>
      </PageShell>
    );
  }

  return (
    <PageShell
      className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 min-h-screen flex items-center justify-center py-12"
      containerClassName="max-w-md"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, -30, 0], opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-slate-900/40 backdrop-blur-xl border border-emerald-500/20 rounded-3xl p-8 md:p-10 shadow-2xl"
      >
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mb-4"
          >
            <Lock size={24} className="text-emerald-400" />
          </motion.div>
          <h1 className="text-3xl font-black text-white mb-2">
            Reset Password
          </h1>
          <p className="text-slate-400 text-sm">
            Enter the code from your email and set a new password.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Reset Code */}
          <div>
            <label className="block text-sm font-bold text-slate-200 mb-2">
              Reset Code
            </label>
            <input
              type="text"
              maxLength="6"
              value={resetCode}
              onChange={(e) => {
                setResetCode(e.target.value.replace(/\D/g, ""));
                clearFieldError("resetCode");
              }}
              placeholder="000000"
              className={`w-full px-4 py-3 bg-slate-900/50 border-2 rounded-xl transition-all duration-200 outline-none text-white placeholder-slate-500 font-medium text-center text-2xl tracking-widest ${
                errors.resetCode
                  ? "border-red-500/50 focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
                  : "border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              }`}
            />
            {errors.resetCode && (
              <p className="text-red-400 text-xs mt-2 font-semibold">
                {errors.resetCode}
              </p>
            )}
            <p className="text-xs text-slate-500 mt-2">
              Check your email for the 6-digit code
            </p>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-bold text-slate-200 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  clearFieldError("newPassword");
                }}
                placeholder="••••••••"
                className={`w-full px-4 py-3 pr-12 bg-slate-900/50 border-2 rounded-xl transition-all duration-200 outline-none text-white placeholder-slate-500 font-medium ${
                  errors.newPassword
                    ? "border-red-500/50 focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
                    : "border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
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
            {errors.newPassword && (
              <p className="text-red-400 text-xs mt-2 font-semibold">
                {errors.newPassword}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-bold text-slate-200 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  clearFieldError("confirmPassword");
                }}
                placeholder="••••••••"
                className={`w-full px-4 py-3 pr-12 bg-slate-900/50 border-2 rounded-xl transition-all duration-200 outline-none text-white placeholder-slate-500 font-medium ${
                  errors.confirmPassword
                    ? "border-red-500/50 focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
                    : "border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-400 p-1.5 rounded-lg hover:bg-slate-700/50 transition-all"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-400 text-xs mt-2 font-semibold">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2.5 disabled:opacity-70 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 mt-6"
          >
            {isLoading ? (
              <>
                <Loader className="animate-spin" size={20} />
                <span>Resetting...</span>
              </>
            ) : (
              <>
                <Lock size={18} />
                <span>Reset Password</span>
              </>
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm">
            Need help?{" "}
            <Link
              to="/contact"
              className="text-emerald-400 font-bold hover:underline"
            >
              Contact us
            </Link>
          </p>
        </div>
      </motion.div>
    </PageShell>
  );
};

export default ResetPasswordPage;
