import { UserPlus, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export function RegisterForm({ loading, onSubmit, form, setForm }) {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordChange = (value) => {
    setForm({ ...form, password: value });
    if (confirmPassword && value !== confirmPassword) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
    if (value !== form.password) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    onSubmit({ ...form, role: "general" });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-5"
    >
      <div className="flex items-center gap-2 mb-2">
        <UserPlus className="text-purple-400" size={20} />
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-purple-300">
            Join Us
          </p>
          <h3 className="text-xl font-bold text-white">Create Account</h3>
        </div>
      </div>

      <p className="text-xs text-gray-400 bg-white/5 rounded-lg p-2 mb-2">
        ✓ Registration is available for general users only.
      </p>

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-3">
        {/* Full Name Input */}
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-300">Full Name</span>
          <input
            type="text"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            required
            autoComplete="name"
            placeholder="Full name"
            className="rounded-lg border border-white/15 bg-white/8 px-3 py-2 text-sm text-white placeholder-gray-500 transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/30"
          />
        </label>

        {/* Phone Input */}
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-300">Phone</span>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="Phone number"
            autoComplete="tel"
            className="rounded-lg border border-white/15 bg-white/8 px-3 py-2 text-sm text-white placeholder-gray-500 transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/30"
          />
        </label>
      </div>

      {/* Email Input - Full Width */}
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-gray-300">Email Address</span>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          autoComplete="email"
          placeholder="your@email.com"
          className="rounded-lg border border-white/15 bg-white/8 px-3 py-2 text-sm text-white placeholder-gray-500 transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/30"
        />
      </label>

      {/* Password Fields - Two Column */}
      <div className="grid grid-cols-2 gap-3">
        {/* Password Input */}
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-300">Password</span>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              required
              autoComplete="new-password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-white/15 bg-white/8 px-3 py-2 pr-10 text-sm text-white placeholder-gray-500 transition focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/30"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-400 transition"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </label>

        {/* Confirm Password Input */}
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-gray-300">Confirm</span>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => handleConfirmPasswordChange(e.target.value)}
              required
              autoComplete="new-password"
              placeholder="••••••••"
              className={`w-full rounded-lg border px-3 py-2 pr-10 text-sm text-white placeholder-gray-500 transition focus:outline-none focus:ring-2 ${
                passwordError
                  ? "border-red-500 bg-red-500/10 focus:border-red-400 focus:ring-red-400/30"
                  : "border-white/15 bg-white/8 focus:border-purple-400 focus:ring-purple-400/30"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-400 transition"
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </label>
      </div>

      {/* Error Message */}
      {passwordError && (
        <p className="text-xs text-red-400 bg-red-500/10 rounded-lg p-2">
          ⚠ {passwordError}
        </p>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || passwordError}
        className="w-full rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-60 hover:shadow-lg hover:shadow-purple-500/50 disabled:cursor-not-allowed"
      >
        {loading ? "Creating Account..." : "Create Account"}
      </button>
    </form>
  );
}
