import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit2,
  Check,
  X,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

export function ProfileCard({ profile, authToken, onProfileUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    phone: profile?.phone || "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!formData.full_name.trim()) {
      setError("Full name is required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      // Update parent component's profile
      onProfileUpdate({ ...profile, ...formData });
      setIsEditing(false);
    } catch (err) {
      setError(err.message || "Error updating profile");
      console.error("Error updating profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: profile?.full_name || "",
      phone: profile?.phone || "",
    });
    setIsEditing(false);
    setError("");
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangePassword = async () => {
    setError("");
    setSuccessMessage("");

    // Validation
    if (!passwordData.currentPassword.trim()) {
      setError("Current password is required");
      return;
    }
    if (!passwordData.newPassword.trim()) {
      setError("New password is required");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    if (passwordData.currentPassword === passwordData.newPassword) {
      setError("New password must be different from current password");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to change password");
      }

      setSuccessMessage("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsChangingPassword(false);
    } catch (err) {
      setError(err.message || "Error changing password");
      console.error("Error changing password:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelPassword = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setIsChangingPassword(false);
    setError("");
    setSuccessMessage("");
  };

  if (!profile) {
    return (
      <div className="p-6 rounded-xl border border-slate-700/50 bg-slate-800/50">
        <p className="text-gray-400">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-xl border border-slate-700/50 bg-slate-800/50">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">
            {profile.full_name || "User Profile"}
          </h2>
          <p className="text-sm text-gray-400">{profile.role} Account</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 transition"
          >
            <Edit2 size={16} />
            Edit
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/20 text-red-300 border border-red-500/30">
          {error}
        </div>
      )}

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-600/50 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-600/50 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check size={16} />
              {isLoading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X size={16} />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Mail size={18} className="text-blue-400 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-400">Email</p>
              <p className="text-white">{profile.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone size={18} className="text-purple-400 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-400">Phone</p>
              <p className="text-white">{profile.phone || "Not provided"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin size={18} className="text-green-400 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-400">Role</p>
              <p className="text-white">
                {profile.role === "ADMIN" && "Administrator"}
                {profile.role === "STAFF" && "Staff Member"}
                {profile.role === "USER" && "Regular User"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar size={18} className="text-yellow-400 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-400">Member Since</p>
              <p className="text-white">
                {new Date(profile.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-700/50">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  profile.email_verified ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <p className="text-sm text-gray-300">
                Email {profile.email_verified ? "Verified" : "Not Verified"}
              </p>
            </div>
          </div>

          {/* Change Password Section */}
          <div className="mt-6 pt-6 border-t border-slate-700/50">
            {isChangingPassword ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Change Password
                </h3>

                {error && (
                  <div className="p-3 rounded-lg bg-red-500/20 text-red-300 border border-red-500/30">
                    {error}
                  </div>
                )}

                {successMessage && (
                  <div className="p-3 rounded-lg bg-green-500/20 text-green-300 border border-green-500/30">
                    {successMessage}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter current password"
                      className="w-full px-4 py-2 pr-12 rounded-lg bg-slate-900/50 border border-slate-600/50 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-400 transition"
                    >
                      {showCurrentPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter new password"
                      className="w-full px-4 py-2 pr-12 rounded-lg bg-slate-900/50 border border-slate-600/50 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-400 transition"
                    >
                      {showNewPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm new password"
                      className="w-full px-4 py-2 pr-12 rounded-lg bg-slate-900/50 border border-slate-600/50 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-400 transition"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleChangePassword}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Check size={16} />
                    {isLoading ? "Changing..." : "Change Password"}
                  </button>
                  <button
                    onClick={handleCancelPassword}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsChangingPassword(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 hover:bg-yellow-500/30 transition"
              >
                <Lock size={16} />
                Change Password
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
