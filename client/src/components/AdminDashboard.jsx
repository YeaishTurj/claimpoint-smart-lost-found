import { useState, useEffect } from "react";
import {
  Users,
  Package,
  CheckSquare,
  TrendingUp,
  UserPlus,
} from "lucide-react";
import { ProfileCard } from "./ProfileCard";

export function AdminDashboard({ foundItems, authToken }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!authToken) return;
      try {
        const response = await fetch("/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setProfile(data.user);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, [authToken]);
  const stats = [
    {
      label: "Total Users",
      value: "Coming Soon",
      icon: Users,
      color: "blue",
    },
    {
      label: "Total Items",
      value: foundItems?.length || 0,
      icon: Package,
      color: "purple",
    },
    {
      label: "Pending Claims",
      value: "Coming Soon",
      icon: CheckSquare,
      color: "yellow",
    },
    {
      label: "Success Rate",
      value: "Coming Soon",
      icon: TrendingUp,
      color: "green",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome, {profile?.full_name || "Admin"}!
        </h1>
        <p className="text-gray-400">
          Manage users, staff, and oversee all system operations
        </p>
      </div>

      {/* Profile Card */}
      {profile && (
        <ProfileCard
          profile={profile}
          authToken={authToken}
          onProfileUpdate={setProfile}
        />
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl border border-${stat.color}-500/20 bg-${stat.color}-500/10`}
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`text-${stat.color}-400`} size={32} />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {stat.value}
            </div>
            <div className={`text-sm text-${stat.color}-300`}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a
          href="#add-staff"
          className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition group"
        >
          <UserPlus className="text-blue-400 mb-4" size={32} />
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition">
            Add Staff Member
          </h3>
          <p className="text-gray-400">
            Create new staff accounts to help manage the system
          </p>
        </a>

        <a
          href="#user-management"
          className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition group"
        >
          <Users className="text-purple-400 mb-4" size={32} />
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition">
            User Management
          </h3>
          <p className="text-gray-400">
            View and manage all registered users in the system
          </p>
        </a>

        <a
          href="#all-claims"
          className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition group"
        >
          <CheckSquare className="text-green-400 mb-4" size={32} />
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition">
            All Claims
          </h3>
          <p className="text-gray-400">
            Monitor and manage all item claims across the system
          </p>
        </a>
      </div>
    </div>
  );
}
