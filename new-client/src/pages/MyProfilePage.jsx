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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="flex items-center gap-3">
          <Loader size={24} className="animate-spin text-emerald-400" />
          <span className="text-slate-200">
            {isLoading
              ? "Loading profile..."
              : "Please login to view your profile"}
          </span>
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
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-800 rounded-lg transition-all"
          >
            <ArrowLeft size={24} className="text-slate-300" />
          </button>
          <h1 className="text-3xl font-bold text-white">My Profile</h1>
        </div>

        {/* Profile Card */}
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] p-8 border border-slate-700/50">
          {/* Profile Header */}
          <div className="flex items-start justify-between mb-8 pb-8 border-b border-slate-700/50">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                <User size={32} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {user.full_name}
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <Shield size={16} className="text-emerald-400" />
                  <span className="text-sm font-semibold text-emerald-200 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
                    {user.role}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/update-profile")}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-lg transition-all shadow-lg shadow-emerald-500/20"
            >
              <Edit2 size={16} />
              Edit Profile
            </button>
          </div>

          {/* Profile Details */}
          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Full Name
              </label>
              <p className="px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white">
                {user.full_name}
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-emerald-400" />
                  Email Address
                </div>
              </label>
              <p className="px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white">
                {user.email}
              </p>
              {user.email_verified && (
                <p className="text-xs text-emerald-400 mt-2">✓ Verified</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-emerald-400" />
                  Phone Number
                </div>
              </label>
              <p className="px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white">
                {user.phone || "Not provided"}
              </p>
            </div>

            {/* Account Status */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-emerald-400" />
                  Account Status
                </div>
              </label>
              <p className="px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-300 font-semibold">
                {user.is_active ? "✓ Active" : "Inactive"}
              </p>
            </div>

            {/* Member Since */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Member Since
              </label>
              <p className="px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white">
                {new Date(user.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-8 border-t border-slate-700/50">
            <button
              onClick={() => navigate("/change-password")}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-emerald-200 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl transition-all"
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
