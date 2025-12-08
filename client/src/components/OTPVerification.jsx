import { Shield, Mail, RotateCcw, Check } from "lucide-react";
import { useState, useEffect } from "react";

export function OTPVerification({
  email,
  onVerify,
  onResend,
  loading,
  error,
  onBack,
}) {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [resendLoading, setResendLoading] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleVerify = (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      return;
    }
    onVerify(otp);
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await onResend(email);
      setOtp("");
      setTimeLeft(300); // Reset timer
    } finally {
      setResendLoading(false);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isExpired = timeLeft <= 0;

  return (
    <form
      onSubmit={handleVerify}
      className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-5"
    >
      <div className="flex items-center gap-2 mb-2">
        <Shield className="text-green-400" size={20} />
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-green-300">
            Verify Email
          </p>
          <h3 className="text-xl font-bold text-white">Email Verification</h3>
        </div>
      </div>

      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mb-2">
        <div className="flex items-center gap-2 mb-2">
          <Mail size={16} className="text-green-400" />
          <p className="text-sm text-green-300">Code sent to:</p>
        </div>
        <p className="text-sm font-semibold text-white break-all">{email}</p>
      </div>

      {error && (
        <div className="text-xs text-red-400 bg-red-500/10 rounded-lg p-2">
          ⚠ {error}
        </div>
      )}

      {/* OTP Input */}
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-gray-300">
          Enter 6-digit code
        </span>
        <input
          type="text"
          value={otp}
          onChange={(e) =>
            setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
          }
          placeholder="000000"
          maxLength="6"
          className="rounded-lg border border-white/15 bg-white/8 px-3 py-2 text-center text-lg font-semibold tracking-widest text-white placeholder-gray-500 transition focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/30"
        />
      </label>

      {/* Timer */}
      <div className="text-center text-sm">
        {isExpired ? (
          <p className="text-red-400 font-semibold">Code expired</p>
        ) : (
          <p className="text-gray-400">
            Code expires in{" "}
            <span className="font-semibold text-white">
              {minutes}:{seconds.toString().padStart(2, "0")}
            </span>
          </p>
        )}
      </div>

      {/* Verify Button */}
      <button
        type="submit"
        disabled={loading || otp.length !== 6 || isExpired}
        className="w-full rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-60 hover:shadow-lg hover:shadow-green-500/50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Verifying...
          </>
        ) : (
          <>
            <Check size={16} />
            Verify Email
          </>
        )}
      </button>

      {/* Resend OTP */}
      <div className="text-center text-xs">
        <p className="text-gray-400 mb-2">Didn't receive the code?</p>
        <button
          type="button"
          onClick={handleResend}
          disabled={resendLoading || timeLeft > 30}
          className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <RotateCcw size={14} />
          {resendLoading ? "Sending..." : "Resend OTP"}
        </button>
        {timeLeft > 30 && (
          <p className="text-gray-500 text-xs mt-1">
            Available after {Math.ceil((timeLeft - 30) / 60)} minute
          </p>
        )}
      </div>

      {/* Back Button */}
      <button
        type="button"
        onClick={onBack}
        className="w-full text-center text-xs text-gray-400 hover:text-gray-300 transition py-1"
      >
        ← Go back
      </button>
    </form>
  );
}
