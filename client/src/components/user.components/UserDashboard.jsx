import { useState, useEffect } from "react";
import { ProfileCard } from "../ProfileCard";

export function UserDashboard({ authToken, onNavigate }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!authToken) return;
      try {
        const response = await fetch("/api/auth/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
        const data = await response.json();
        setProfile(data.user);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, [authToken]);

  return (
    <div className="max-w-2xl mx-auto py-8">
      <ProfileCard profile={profile} />
    </div>
  );
}
