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
        autoClose: 2000,
      });

      // Navigate to my-profile page after 1.5 seconds
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
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100">
        <div className="flex items-center gap-3">
          <Loader size={24} className="animate-spin text-primary-600" />
          <span className="text-slate-600">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <p className="text-slate-600 mb-4">
            Please login to update your profile
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/my-profile")}
            className="p-2 hover:bg-slate-200 rounded-lg transition-all"
          >
            <ArrowLeft size={24} className="text-slate-600" />
          </button>
          <h1 className="text-3xl font-bold text-slate-900">Update Profile</h1>
        </div>

        {/* Update Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
          {/* Profile Info */}
          <div className="mb-8 pb-8 border-b border-slate-200">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-linear-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                <User size={32} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {user.full_name}
                </h2>
                <p className="text-sm text-slate-600 mt-1">{user.email}</p>
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
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-primary-600" />
                  Full Name *
                </div>
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-all ${
                  errors.full_name
                    ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                    : "border-slate-300 hover:border-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                }`}
              />
              {errors.full_name && (
                <p className="text-xs text-red-600 mt-1.5">
                  {errors.full_name}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-primary-600" />
                  Phone Number *
                </div>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-all ${
                  errors.phone
                    ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                    : "border-slate-300 hover:border-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                }`}
              />
              {errors.phone && (
                <p className="text-xs text-red-600 mt-1.5">{errors.phone}</p>
              )}
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
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
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
