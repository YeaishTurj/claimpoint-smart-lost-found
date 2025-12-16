import { useState, useEffect } from "react";
import { Package, FileText, CheckSquare, TrendingUp } from "lucide-react";
import { ProfileCard } from "./ProfileCard";

export function StaffDashboard({ foundItems, onRecordItemClick, authToken }) {
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
      label: "Total Found Items",
      value: foundItems?.length || 0,
      icon: Package,
      color: "blue",
    },
    {
      label: "Pending Claims",
      value: "Coming Soon",
      icon: CheckSquare,
      color: "yellow",
    },
    {
      label: "My Recordings",
      value: "Coming Soon",
      icon: FileText,
      color: "purple",
    },
    {
      label: "Items Claimed",
      value: "Coming Soon",
      icon: TrendingUp,
      color: "green",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome, {profile?.full_name || "Staff"}!
        </h1>
        <p className="text-gray-400">
          Manage found items, review claims, and track your recordings
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
        <button
          onClick={onRecordItemClick}
          className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition group text-left"
        >
          <FileText className="text-blue-400 mb-4" size={32} />
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition">
            Record Found Item
          </h3>
          <p className="text-gray-400">
            Add a new found item to the system with details and images
          </p>
        </button>

        <a
          href="#review-claims"
          className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition group"
        >
          <CheckSquare className="text-purple-400 mb-4" size={32} />
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition">
            Review Claims
          </h3>
          <p className="text-gray-400">
            Review and verify claims made by users for found items
          </p>
        </a>

        <a
          href="#my-recordings"
          className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition group"
        >
          <Package className="text-green-400 mb-4" size={32} />
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition">
            My Recordings
          </h3>
          <p className="text-gray-400">
            View all items you have recorded in the system
          </p>
        </a>
      </div>
    </div>
  );
}
