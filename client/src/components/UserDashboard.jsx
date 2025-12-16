import { useState, useEffect } from "react";
import { Package, FileText, ClipboardList, Search } from "lucide-react";
import { ProfileCard } from "./ProfileCard";

export function UserDashboard({ foundItems, authToken, onNavigate }) {
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
      label: "Available Items",
      value: foundItems?.length || 0,
      icon: Package,
      color: "blue",
    },
    {
      label: "My Claims",
      value: "Coming Soon",
      icon: ClipboardList,
      color: "purple",
    },
    {
      label: "Lost Reports",
      value: "Coming Soon",
      icon: FileText,
      color: "yellow",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome, {profile?.full_name || "User"}!
        </h1>
        <p className="text-gray-400">
          Track your claims, report lost items, and browse found items
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => onNavigate?.("browse-items")}
          className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition group text-left"
        >
          <Search className="text-blue-400 mb-4" size={32} />
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition">
            Browse Found Items
          </h3>
          <p className="text-gray-400">
            Search through all found items to see if yours is there
          </p>
        </button>

        <button
          onClick={() => onNavigate?.("report-lost-item")}
          className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition group text-left"
        >
          <FileText className="text-red-400 mb-4" size={32} />
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition">
            Report Lost Item
          </h3>
          <p className="text-gray-400">
            Report your lost item and we'll notify you if it's found
          </p>
        </button>
      </div>
    </div>
  );
}
