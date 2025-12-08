import { useState } from "react";
import { LogIn, Eye, EyeOff } from "lucide-react";

export function LoginForm({ loading, onSubmit, form, setForm }) {
  const [userRole, setUserRole] = useState("general");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, role: userRole });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-6"
    >
      <div className="flex items-center gap-2">
        <LogIn className="text-blue-400" size={24} />
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-300">
            Welcome Back
          </p>
          <h3 className="text-2xl font-bold text-white">Login</h3>
        </div>
      </div>

      {/* Role Selection */}
      <div className="space-y-2">
        <span className="text-xs font-medium text-gray-300 block">
          Select Your Role
        </span>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: "general", label: "General User" },
            { value: "staff", label: "Staff" },
            { value: "admin", label: "Admin" },
          ].map((role) => (
            <button
              key={role.value}
              type="button"
              onClick={() => setUserRole(role.value)}
              className={`py-2 px-3 rounded-lg font-semibold transition ${
                userRole === role.value
                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/50"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              {role.label}
            </button>
          ))}
        </div>
      </div>

      {/* Email Input */}
      <label className="flex flex-col gap-2">
        <span className="text-xs font-medium text-gray-300">Email Address</span>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          autoComplete="email"
          placeholder="your@email.com"
          className="rounded-lg border border-white/15 bg-white/8 px-4 py-2 text-white placeholder-gray-500 transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
        />
      </label>

      {/* Password Input */}
      <label className="flex flex-col gap-2">
        <span className="text-xs font-medium text-gray-300">Password</span>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className="w-full rounded-lg border border-white/15 bg-white/8 px-4 py-2 pr-12 text-white placeholder-gray-500 transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-400 transition"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </label>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-3 font-semibold text-white transition disabled:opacity-60 hover:shadow-lg hover:shadow-blue-500/50 disabled:cursor-not-allowed"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
