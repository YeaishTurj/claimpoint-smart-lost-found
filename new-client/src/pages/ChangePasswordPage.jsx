import React, { useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../lib/api";
import { toast } from "react-toastify";
import { Lock, Eye, EyeOff, ArrowLeft, Loader, Save, X } from "lucide-react";

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "New password must be at least 6 characters";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword =
        "New password must be different from current password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await api.put("/auth/change-password", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      toast.success(
        "Password changed successfully! Please log in with your new password.",
        {
          position: "top-center",
          autoClose: 3000,
        }
      );

      // Wait for toast to show, then navigate to login
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to change password";
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/my-profile")}
            className="p-2 hover:bg-slate-200 rounded-lg transition-all"
          >
            <ArrowLeft size={24} className="text-slate-600" />
          </button>
          <h1 className="text-3xl font-bold text-slate-900">Change Password</h1>
        </div>

        {/* Password Change Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
          {/* Info Section */}
          <div className="mb-8 pb-8 border-b border-slate-200">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Lock size={24} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Secure Your Account
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Change your password to keep your account secure. You'll be
                  logged out and need to sign in again with your new password.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Current Password *
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  placeholder="Enter your current password"
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none transition-all ${
                    errors.currentPassword
                      ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-slate-300 hover:border-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-primary-600 transition"
                >
                  {showCurrentPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-xs text-red-600 mt-1.5">
                  {errors.currentPassword}
                </p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                New Password *
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="Enter your new password"
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none transition-all ${
                    errors.newPassword
                      ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-slate-300 hover:border-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-primary-600 transition"
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-xs text-red-600 mt-1.5">
                  {errors.newPassword}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Confirm New Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your new password"
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none transition-all ${
                    errors.confirmPassword
                      ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-slate-300 hover:border-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-primary-600 transition"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-600 mt-1.5">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm font-semibold text-amber-900 mb-2">
                Password Requirements:
              </p>
              <ul className="text-xs text-amber-800 space-y-1">
                <li>• At least 6 characters long</li>
                <li>• Different from your current password</li>
                <li>• Must be confirmed in the field above</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-8 border-t border-slate-200 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => navigate("/my-profile")}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all"
              >
                <X size={16} />
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Changing...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Change Password
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
