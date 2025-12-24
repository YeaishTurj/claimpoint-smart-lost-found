import { useState, useEffect, useCallback } from "react";
import { Package, FileText, ClipboardList, Search, Eye, Trash2 } from "lucide-react";
import { ProfileCard } from "./ProfileCard";
import api from "../services/api";
import { ReportLostItemForm } from "./ReportLostItemForm";
import { ItemDetailsCard } from "./ItemDetailsCard";

export function UserDashboard({ foundItems, authToken, onNavigate }) {
  const [profile, setProfile] = useState(null);
  const [lostReports, setLostReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [showDetailsCard, setShowDetailsCard] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const handleDeleteReport = async (reportId) => {
    if (!authToken) return;
    const confirmed = window.confirm("Are you sure you want to delete this lost report? This action cannot be undone.");
    if (!confirmed) return;
    setDeletingId(reportId);
    try {
      await api.deleteUserLostReport(authToken, reportId);
      await fetchLostReports();
    } catch (error) {
      console.error("Error deleting report:", error);
    } finally {
      setDeletingId(null);
    }
  };

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

  const fetchLostReports = useCallback(async () => {
    if (!authToken) return;
    setLoadingReports(true);
    try {
      const data = await api.getUserLostReports(authToken);
      setLostReports(data.lostReports || []);
    } catch (error) {
      console.error("Error fetching lost reports:", error);
    } finally {
      setLoadingReports(false);
    }
  }, [authToken]);

  useEffect(() => {
    fetchLostReports();
  }, [fetchLostReports]);

  const handleEditReport = (report) => {
    setEditingReport(report);
    setShowEditForm(true);
  };

  const handleEditSuccess = async () => {
    setShowEditForm(false);
    setEditingReport(null);
    await fetchLostReports();
  };

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
      value: lostReports.length,
      icon: FileText,
      color: "yellow",
    },
  ];
  return (
    <>
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

        {/* My Lost Reports Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">My Lost Reports</h2>
            <button
              onClick={() => onNavigate?.("report-lost-item")}
              className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition"
            >
              + New Report
            </button>
          </div>

          {loadingReports ? (
            <div className="text-center py-12 text-gray-400">
              Loading your reports...
            </div>
          ) : lostReports.length === 0 ? (
            <div className="text-center py-12 rounded-xl border border-white/10 bg-white/5">
              <FileText className="mx-auto mb-4 text-gray-500" size={48} />
              <p className="text-gray-400 mb-4">You haven't reported any lost items yet</p>
              <button
                onClick={() => onNavigate?.("report-lost-item")}
                className="px-6 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition"
              >
                Report Your First Item
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lostReports.map((report) => (
                <div
                  key={report.id}
                  className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        report.status === "open"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : report.status === "matched"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {report.status}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedReportId(report.id);
                          setShowDetailsCard(true);
                        }}
                        className="text-xs px-2 py-1 rounded-lg border border-purple-500/40 text-purple-300 hover:bg-purple-500/10 transition flex items-center gap-1"
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => handleEditReport(report)}
                        className="text-xs px-3 py-1 rounded-lg border border-blue-500/40 text-blue-300 hover:bg-blue-500/10 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteReport(report.id)}
                        className="text-xs px-2 py-1 rounded-lg border border-red-500/40 text-red-300 hover:bg-red-500/10 transition flex items-center gap-1"
                        title="Delete Report"
                        disabled={deletingId === report.id}
                      >
                        <Trash2 size={14} />
                        {deletingId === report.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 capitalize">
                    {report.item_type}
                  </h3>
                  <div className="space-y-2 text-sm text-gray-400">
                    <p>
                      <span className="font-medium text-gray-300">Location:</span>{" "}
                      {report.location_lost}
                    </p>
                    <p>
                      <span className="font-medium text-gray-300">Date Lost:</span>{" "}
                      {new Date(report.date_lost).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-medium text-gray-300">Reported:</span>{" "}
                      {new Date(report.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {report.image_urls && report.image_urls.length > 0 && (
                    <div className="mt-4">
                      <img
                        src={report.image_urls[0]}
                        alt={report.item_type}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showEditForm && editingReport && (
        <ReportLostItemForm
          authToken={authToken}
          mode="edit"
          report={editingReport}
          onSuccess={handleEditSuccess}
          onClose={() => {
            setShowEditForm(false);
            setEditingReport(null);
          }}
        />
      )}

      {showDetailsCard && selectedReportId && (
        <ItemDetailsCard
          itemId={selectedReportId}
          type="lost"
          authToken={authToken}
          onClose={() => {
            setShowDetailsCard(false);
            setSelectedReportId(null);
          }}
        />
      )}
    </>
  );
} 