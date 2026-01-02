import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/auth.context";
import { api } from "../lib/api";
import { toast } from "react-toastify";
import {
  User,
  Mail,
  Phone,
  Shield,
  ArrowLeft,
  Loader,
  Edit2,
  Lock,
} from "lucide-react";

const MyProfilePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch full user profile on mount
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

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex items-center gap-3">
          <Loader size={24} className="animate-spin text-primary-600" />
          <span className="text-slate-600">
            {isLoading
              ? "Loading profile..."
              : "Please login to view your profile"}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-200 rounded-lg transition-all"
          >
            <ArrowLeft size={24} className="text-slate-600" />
          </button>
          <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
          {/* Profile Header */}
          <div className="flex items-start justify-between mb-8 pb-8 border-b border-slate-200">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                <User size={32} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {user.full_name}
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <Shield size={16} className="text-primary-600" />
                  <span className="text-sm font-semibold text-primary-600 bg-primary-50 border border-primary-100 px-3 py-1 rounded-full">
                    {user.role}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/update-profile")}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-all"
            >
              <Edit2 size={16} />
              Edit Profile
            </button>
          </div>

          {/* Profile Details */}
          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Full Name
              </label>
              <p className="px-4 py-2.5 bg-slate-50 rounded-lg text-slate-900">
                {user.full_name}
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-primary-600" />
                  Email Address
                </div>
              </label>
              <p className="px-4 py-2.5 bg-slate-50 rounded-lg text-slate-900">
                {user.email}
              </p>
              {user.email_verified && (
                <p className="text-xs text-green-600 mt-2">✓ Verified</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-primary-600" />
                  Phone Number
                </div>
              </label>
              <p className="px-4 py-2.5 bg-slate-50 rounded-lg text-slate-900">
                {user.phone || "Not provided"}
              </p>
            </div>

            {/* Account Status */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-primary-600" />
                  Account Status
                </div>
              </label>
              <p className="px-4 py-2.5 bg-green-50 border border-green-200 rounded-lg text-green-700 font-semibold">
                {user.is_active ? "✓ Active" : "Inactive"}
              </p>
            </div>

            {/* Member Since */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Member Since
              </label>
              <p className="px-4 py-2.5 bg-slate-50 rounded-lg text-slate-900">
                {new Date(user.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-8 border-t border-slate-200">
            <button
              onClick={() => navigate("/change-password")}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 border border-primary-200 rounded-lg transition-all"
            >
              <Lock size={16} />
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfilePage;
