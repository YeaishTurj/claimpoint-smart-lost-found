// Helper to render claim details safely
function renderClaimDetails(details) {
  if (typeof details === "object" && details !== null) {
    if (Array.isArray(details)) {
      return details.join(", ");
    }
    // Object: join key-value pairs
    return Object.entries(details)
      .map(([key, value]) => `${key}: ${String(value)}`)
      .join(", ");
  }
  return String(details);
}
import { useState, useEffect, useCallback } from "react";
import {
  Package,
  FileText,
  ClipboardList,
  Search,
  Eye,
  Trash2,
} from "lucide-react";
import { ProfileCard } from "../ProfileCard";
import api from "../../services/api";
import { ReportLostItemForm } from "./ReportLostItemForm";
import { ItemDetailsCard } from "../ItemDetailsCard";

export function UserDashboard({
  foundItems,
  authToken,
  onNavigate,
  showOnlyClaims = false,
  showOnlyReports = false,
}) {
  const [selectedClaimId, setSelectedClaimId] = useState(null);
  const [claimDetails, setClaimDetails] = useState(null);
  const [loadingClaimDetails, setLoadingClaimDetails] = useState(false);
  const [showClaimDetailsModal, setShowClaimDetailsModal] = useState(false);

  const handleShowClaimDetails = async (claimId) => {
    setSelectedClaimId(claimId);
    setLoadingClaimDetails(true);
    setShowClaimDetailsModal(true);
    try {
      const data = await api.getUserClaimDetails(authToken, claimId);
      setClaimDetails(data.claim);
    } catch (error) {
      setClaimDetails(null);
      console.error("Error fetching claim details:", error);
    } finally {
      setLoadingClaimDetails(false);
    }
  };

  const handleCloseClaimDetailsModal = () => {
    setShowClaimDetailsModal(false);
    setClaimDetails(null);
    setSelectedClaimId(null);
  };
  const [claims, setClaims] = useState([]);
  const [loadingClaims, setLoadingClaims] = useState(false);

  const fetchClaims = useCallback(async () => {
    if (!authToken) return;
    setLoadingClaims(true);
    try {
      const data = await api.getAllClaimsByUser(authToken);
      setClaims(data.claims || []);
    } catch (error) {
      console.error("Error fetching claims:", error);
    } finally {
      setLoadingClaims(false);
    }
  }, [authToken]);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  // Fetch lost reports for My Reports view
  const fetchLostReports = useCallback(async () => {
    if (!authToken) return;
    setLoadingReports(true);
    try {
      const data = await api.getUserLostReports(authToken);
      setLostReports(data.reports || []);
    } catch (error) {
      console.error("Error fetching lost reports:", error);
    } finally {
      setLoadingReports(false);
    }
  }, [authToken]);

  useEffect(() => {
    if (showOnlyReports) {
      fetchLostReports();
    }
  }, [showOnlyReports, fetchLostReports]);
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
    const confirmed = window.confirm(
      "Are you sure you want to delete this lost report? This action cannot be undone."
    );
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

  // ...existing code...

  if (showOnlyClaims) {
    // ...existing claims-only UI...
    // (keep as is)
    return (
      <div className="max-w-2xl mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-6">My Claims</h2>
        {loadingClaims ? (
          <div>Loading claims...</div>
        ) : claims.length === 0 ? (
          <div>No claims found.</div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {claims.map((claim) => (
              <div
                key={claim.id}
                className="bg-slate-800 p-4 rounded-lg shadow border border-slate-700"
              >
                <div className="flex items-center gap-4">
                  {claim.displayImage && (
                    <img
                      src={claim.displayImage}
                      alt={claim.item_type}
                      className="w-20 h-20 object-cover rounded-lg border border-slate-700"
                    />
                  )}
                  <div className="flex-1">
                    <div className="font-semibold text-lg">
                      {claim.item_type}
                    </div>
                  </div>
                  <button
                    className="px-3 py-1 rounded bg-blue-700/30 text-blue-300 border border-blue-500/40 hover:bg-blue-700/50 transition"
                    onClick={() => handleShowClaimDetails(claim.id)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Claim Details Modal */}
        {showClaimDetailsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-slate-900 rounded-lg shadow-lg p-8 max-w-lg w-full relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-white"
                onClick={handleCloseClaimDetailsModal}
              >
                &times;
              </button>
              <h3 className="text-xl font-bold mb-4">Claim Details</h3>
              {loadingClaimDetails ? (
                <div>Loading...</div>
              ) : claimDetails ? (
                <div>
                  <div className="mb-2">
                    <span className="font-semibold">Status:</span>{" "}
                    {claimDetails.status}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Match %:</span>{" "}
                    {claimDetails.match_percentage}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Claimed At:</span>{" "}
                    {new Date(claimDetails.created_at).toLocaleString()}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Details:</span>{" "}
                    {renderClaimDetails(claimDetails.claim_details)}
                  </div>
                  {claimDetails.image_urls &&
                    claimDetails.image_urls.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">Images:</h4>
                        <div className="flex gap-2 flex-wrap">
                          {claimDetails.image_urls.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt={`Claim Image ${idx + 1}`}
                              className="w-20 h-20 object-cover rounded border border-slate-700"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              ) : (
                <div>No details found.</div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (showOnlyReports) {
    // Only show lost reports section
    return (
      <div className="max-w-2xl mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-6">My Lost Reports</h2>
        {loadingReports ? (
          <div>Loading lost reports...</div>
        ) : lostReports.length === 0 ? (
          <div>No lost reports found.</div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {lostReports.map((report) => (
              <div
                key={report.id}
                className="bg-slate-800 p-4 rounded-lg shadow border border-slate-700"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{report.item_type}</div>
                    <div className="text-xs text-slate-400">
                      {report.description}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="text-blue-400 hover:underline"
                      onClick={() => handleShowDetails(report.id)}
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="text-yellow-400 hover:underline"
                      onClick={() => handleEditReport(report)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-400 hover:underline"
                      onClick={() => handleDeleteReport(report.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
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
    );
  }

  return (
    <>
      {/* ...existing dashboard code... */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile and Lost Reports */}
        <div>
          <ProfileCard profile={profile} />
          {/* Lost Reports Section */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">My Lost Reports</h2>
            {loadingReports ? (
              <div>Loading lost reports...</div>
            ) : lostReports.length === 0 ? (
              <div>No lost reports found.</div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {lostReports.map((report) => (
                  <div
                    key={report.id}
                    className="bg-slate-800 p-4 rounded-lg shadow border border-slate-700"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold">{report.item_type}</div>
                        <div className="text-xs text-slate-400">
                          {report.description}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="text-blue-400 hover:underline"
                          onClick={() => handleShowDetails(report.id)}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="text-yellow-400 hover:underline"
                          onClick={() => handleEditReport(report)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-400 hover:underline"
                          onClick={() => handleDeleteReport(report.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
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
        {/* Claims Section */}
        <div>
          <h2 className="text-xl font-bold mb-4">My Claims</h2>
          {loadingClaims ? (
            <div>Loading claims...</div>
          ) : claims.length === 0 ? (
            <div>No claims found.</div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {claims.map((claim) => (
                <div
                  key={claim.id}
                  className="bg-slate-800 p-4 rounded-lg shadow border border-slate-700"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold">{claim.item_type}</div>
                      <div className="text-xs text-slate-400">
                        {renderClaimDetails(claim.claim_details)}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-xs px-2 py-1 rounded bg-blue-700/30 text-blue-300 border border-blue-500/40">
                        {claim.status}
                      </span>
                    </div>
                  </div>
                  {claim.image_urls && claim.image_urls.length > 0 && (
                    <div className="mt-4">
                      <img
                        src={claim.image_urls[0]}
                        alt={claim.item_type}
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
