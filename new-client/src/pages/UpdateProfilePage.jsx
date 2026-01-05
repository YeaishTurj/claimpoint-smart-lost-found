import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/auth.context";
import { api } from "../lib/api";
import { toast } from "react-toastify";
import { User, Phone, ArrowLeft, Loader, Save, X } from "lucide-react";

const UpdateProfilePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
  });

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await api.get("/auth/profile");
        setUser(response.data.user);
        setFormData({
          full_name: response.data.user.full_name || "",
          phone: response.data.user.phone || "",
        });
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        toast.error("Failed to load profile data", {
          position: "top-center",
          autoClose: 2000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated]);

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

    if (!formData.full_name.trim()) {
      newErrors.full_name = "Full name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      const response = await api.patch("/auth/profile", formData);
      setUser(response.data.user);

      toast.success("Profile updated successfully!", {
        position: "top-center",
        autoClose: 5000,
      });

      // Navigate to my-profile page after 2.5 seconds
      setTimeout(() => {
        navigate("/my-profile");
      }, 1500);
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile", {
        position: "top-center",
        autoClose: 2000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="flex items-center gap-3">
          <Loader size={24} className="animate-spin text-emerald-400" />
          <span className="text-slate-200">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center">
          <p className="text-slate-200 mb-4">
            Please login to update your profile
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-500/20 transition-all"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-24 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/my-profile")}
            className="p-2 hover:bg-slate-800 rounded-lg transition-all"
          >
            <ArrowLeft size={24} className="text-slate-300" />
          </button>
          <h1 className="text-3xl font-bold text-white">Update Profile</h1>
        </div>

        {/* Update Form Card */}
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] p-8 border border-slate-700/50">
          {/* Profile Info */}
          <div className="mb-8 pb-8 border-b border-slate-700/50">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                <User size={32} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {user.full_name}
                </h2>
                <p className="text-sm text-slate-300 mt-1">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="space-y-6"
          >
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-emerald-400" />
                  Full Name *
                </div>
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all bg-slate-900/50 text-white placeholder:text-slate-400 ${
                  errors.full_name
                    ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                    : "border-slate-700 hover:border-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                }`}
              />
              {errors.full_name && (
                <p className="text-xs text-red-400 mt-1.5">
                  {errors.full_name}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-emerald-400" />
                  Phone Number *
                </div>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all bg-slate-900/50 text-white placeholder:text-slate-400 ${
                  errors.phone
                    ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                    : "border-slate-700 hover:border-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                }`}
              />
              {errors.phone && (
                <p className="text-xs text-red-400 mt-1.5">{errors.phone}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-8 border-t border-slate-700/50 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => navigate("/my-profile")}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-slate-200 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all"
              >
                <X size={16} />
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
              >
                {isSaving ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Changes
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

export default UpdateProfilePage;
