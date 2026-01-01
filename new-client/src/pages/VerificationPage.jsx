import React from "react";
import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router";
import { api } from "../lib/api";
import { Mail, AlertCircle, CheckCircle } from "lucide-react";

const VerificationPage = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  // Redirect if no email provided
  React.useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  const handleSubmit = async () => {
    setError("");

    if (!verificationCode.trim()) {
      setError("Please enter the verification code");
      return;
    }

    if (verificationCode.length !== 6) {
      setError("Verification code must be 6 digits");
      return;
    }

    setLoading(true);

    try {
      const res = await api.get("/auth/verify-email", {
        params: {
          code: verificationCode,
          email: email,
        },
      });

      console.log(res.data);

      // Success - user is now logged in via cookie
      navigate("/", {
        state: {
          message: "Email verified successfully! You are now logged in.",
        },
      });
    } catch (err) {
      console.error(err);
      const errorMessage =
        err.response?.data?.message || err.message || "Verification failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError("");
    setResendMessage("");
    setResendLoading(true);

    try {
      const res = await api.get("/auth/resend-verification-code", {
        params: { email },
      });

      setResendMessage(res.data.message || "New code sent to your email!");
    } catch (err) {
      console.error(err);
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to resend code";
      setError(errorMessage);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4">
            <Mail className="text-blue-400" size={32} />
          </div>
          <h1 className="text-4xl font-bold mb-2">
            Verify Your{" "}
            <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-transparent bg-clip-text">
              Email
            </span>
          </h1>
          <p className="text-neutral-400">
            We've sent a 6-digit verification code to
          </p>
          <p className="text-white font-semibold mt-1">{email}</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-start gap-3 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 mb-6">
            <AlertCircle
              size={20}
              className="text-red-400 mt-0.5 flex-shrink-0"
            />
            <div>
              <p className="font-semibold text-red-200">Verification Error</p>
              <p className="text-sm text-red-300">{error}</p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {resendMessage && (
          <div className="flex items-start gap-3 rounded-lg border border-green-500/40 bg-green-500/10 px-4 py-3 mb-6">
            <CheckCircle
              size={20}
              className="text-green-400 mt-0.5 flex-shrink-0"
            />
            <div>
              <p className="font-semibold text-green-200">Success</p>
              <p className="text-sm text-green-300">{resendMessage}</p>
            </div>
          </div>
        )}

        {/* Verification Form */}
        <form
          className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div>
            <label
              htmlFor="verification_code"
              className="block text-sm font-semibold mb-2"
            >
              Verification Code
            </label>
            <input
              type="text"
              id="verification_code"
              placeholder="Enter 6-digit code"
              value={verificationCode}
              onChange={(e) => {
                setVerificationCode(e.target.value);
              }}
              maxLength={6}
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 transition text-center text-2xl tracking-widest font-semibold"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 py-3 px-6 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        {/* Resend Code */}
        <div className="mt-6 text-center space-y-3">
          <p className="text-sm text-neutral-400">
            Didn't receive the code?{" "}
            <button
              type="button"
              onClick={handleResendCode}
              disabled={resendLoading}
              className="text-blue-400 hover:text-blue-300 font-semibold disabled:opacity-50"
            >
              {resendLoading ? "Sending..." : "Resend Code"}
            </button>
          </p>
          <p className="text-sm text-neutral-400">
            <Link to="/register" className="text-neutral-300 hover:text-white">
              ← Back to Registration
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;
