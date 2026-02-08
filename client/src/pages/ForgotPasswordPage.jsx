import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import { toast } from "react-toastify";
import { Mail, ArrowLeft, Loader, CheckCircle } from "lucide-react";
import { PageShell } from "../components/layout";
import api from "../services/api.js";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validateEmail = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail()) return;

    setIsLoading(true);
    try {
      const response = await api.forgotPassword(email.trim());

      // Show success if backend returned success
      if (response.success) {
        setSubmitted(true);
        toast.success("Password reset code sent! Check your email.", {
          position: "bottom-right",
          theme: "dark",
        });
      }
    } catch (error) {
      // Handle error from backend or network error
      toast.error(error.message || "Failed to request password reset", {
        position: "bottom-right",
        theme: "dark",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
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
            Check Your Email
          </h2>
          <p className="text-slate-300 mb-8">
            We've sent a password reset link to <strong>{email}</strong>. Follow
            the link to reset your password.
          </p>
          <p className="text-sm text-slate-400 mb-8">
            The reset link will expire in 15 minutes.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl transition-all"
            >
              Back to Login
            </button>
            <button
              onClick={() => setSubmitted(false)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-xl transition-all"
            >
              Try Another Email
            </button>
          </div>
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
        {/* Back Button */}
        <button
          onClick={() => navigate("/login")}
          className="mb-6 flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Back to Login
        </button>

        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mb-4"
          >
            <Mail size={24} className="text-emerald-400" />
          </motion.div>
          <h1 className="text-3xl font-black text-white mb-2">
            Forgot Password?
          </h1>
          <p className="text-slate-400 text-sm">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-200 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({});
              }}
              placeholder="your@email.com"
              className={`w-full px-4 py-3 bg-slate-900/50 border-2 rounded-xl transition-all duration-200 outline-none text-white placeholder-slate-500 font-medium ${
                errors.email
                  ? "border-red-500/50 focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
                  : "border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              }`}
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-2 font-semibold">
                {errors.email}
              </p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2.5 disabled:opacity-70 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40"
          >
            {isLoading ? (
              <>
                <Loader className="animate-spin" size={20} />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Mail size={18} />
                <span>Send Reset Link</span>
              </>
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-emerald-400 font-bold hover:underline"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </motion.div>
    </PageShell>
  );
};

export default ForgotPasswordPage;
