import { useState, useEffect } from "react";
import api from "../../services/api";
import { Trash2, Pencil } from "lucide-react";
import { UpdateClaimForm } from "../../components/user.components/UpdateClaimForm";

export function MyClaimsPage({ authToken }) {
  const [claims, setClaims] = useState([]);
  const [loadingClaims, setLoadingClaims] = useState(false);
  const [selectedClaimId, setSelectedClaimId] = useState(null);
  const [claimDetails, setClaimDetails] = useState(null);
  const [loadingClaimDetails, setLoadingClaimDetails] = useState(false);
  const [showClaimDetailsModal, setShowClaimDetailsModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingClaim, setEditingClaim] = useState(null);
  const [loadingEdit, setLoadingEdit] = useState(false);

  // Fetch latest claim details before editing (like MyReportsPage)
  const handleShowEditModal = async (claim) => {
    setLoadingEdit(true);
    setShowEditModal(true);
    try {
      const data = await api.getUserClaimDetails(authToken, claim.id);
      setEditingClaim(data.claim || claim);
    } catch (err) {
      setEditingClaim(claim); // fallback
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingClaim(null);
  };

  const handleUpdateClaimSuccess = (updatedClaim) => {
    setClaims((prev) =>
      prev.map((c) =>
        c.id === updatedClaim.id ? { ...c, ...updatedClaim } : c
      )
    );
    handleCloseEditModal();
  };

  const handleDeleteClaim = async (claimId) => {
    if (!authToken) return;
    const confirmed = window.confirm(
      "Are you sure you want to delete this claim? This action cannot be undone."
    );
    if (!confirmed) return;
    setDeletingId(claimId);
    try {
      await api.deleteUserClaim(authToken, claimId);
      setClaims((prev) => prev.filter((c) => c.id !== claimId));
    } catch (error) {
      alert("Failed to delete claim. Please try again.");
      console.error("Error deleting claim:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleShowClaimDetails = async (claimId) => {
    setSelectedClaimId(claimId);
    setLoadingClaimDetails(true);
    setShowClaimDetailsModal(true);
    try {
      const data = await api.getUserClaimDetails(authToken, claimId);
      // console.log("Fetched claim details:", data);
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

  useEffect(() => {
    if (!authToken) return;
    setLoadingClaims(true);
    api
      .getAllClaimsByUser(authToken)
      .then((data) => setClaims(data.claims || []))
      .catch((error) => {
        console.error("Error fetching claims:", error);
      })
      .finally(() => setLoadingClaims(false));
  }, [authToken]);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-blue-950 py-10">
      <div className="bg-slate-900 rounded-xl border border-white/10 w-full max-w-4xl mx-auto shadow-2xl shadow-black/50 relative mt-8 mb-12 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-2 p-8 border-b border-white/10 bg-linear-to-r from-blue-900/40 to-slate-900/80 rounded-t-xl">
          <svg
            className="text-blue-400"
            width={28}
            height={28}
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 17v2m-7-2a7 7 0 1 1 14 0v2a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-2Z"
            />
          </svg>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-300">
              Claims Dashboard
            </p>
            <h2 className="text-3xl font-bold text-white drop-shadow">
              My Claims
            </h2>
          </div>
        </div>

        <div className="flex-1 px-8 py-8">
          {loadingClaims ? (
            <div className="text-center text-blue-400 py-20 text-lg animate-pulse">
              Loading claims...
            </div>
          ) : claims.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <svg
                width="60"
                height="60"
                fill="none"
                viewBox="0 0 24 24"
                className="mb-4 text-slate-700"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M9 10h.01M15 10h.01M8 15c1.333-1 4.667-1 6 0"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <div className="text-gray-400 text-lg font-medium">
                No claims found.
              </div>
              <div className="text-xs text-slate-500 mt-2">
                You haven't made any claims yet.
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-7">
              {claims.map((claim) => (
                <div
                  key={claim.id}
                  className="bg-slate-800 p-7 rounded-xl shadow border border-slate-700 flex items-center gap-7 hover:shadow-2xl hover:border-blue-400/60 transition-all duration-200 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition bg-blue-400 pointer-events-none rounded-xl" />
                  {claim.displayImage && (
                    <img
                      src={claim.displayImage}
                      alt={claim.item_type}
                      className="w-24 h-24 object-cover rounded-lg border border-slate-700 shadow-lg"
                    />
                  )}
                  <div className="flex-1">
                    <div className="font-semibold text-xl text-white mb-2 drop-shadow">
                      {claim.item_type}
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-xs px-2 py-1 rounded bg-blue-700/30 text-blue-300 border border-blue-500/40 font-medium">
                        {claim.status}
                      </span>
                      {claim.match_percentage !== undefined && (
                        <span className="text-xs px-2 py-1 rounded bg-green-700/30 text-green-300 border border-green-500/40 font-medium">
                          Match: {claim.match_percentage}%
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <button
                      className="px-4 py-2 rounded-lg bg-linear-to-r from-blue-600 to-blue-400 text-white font-semibold border border-blue-500/40 hover:from-blue-700 hover:to-blue-500 transition shadow mb-1"
                      onClick={() => handleShowClaimDetails(claim.id)}
                    >
                      View Details
                    </button>
                    <button
                      className="flex items-center gap-1 px-3 py-1 rounded-lg bg-linear-to-r from-green-700 to-blue-500 text-white font-semibold border border-green-500/40 hover:from-green-800 hover:to-blue-600 transition shadow text-xs"
                      onClick={() => handleShowEditModal(claim)}
                      title="Edit Claim"
                    >
                      <Pencil size={15} /> Edit
                    </button>
                    <button
                      className={`flex items-center gap-1 px-3 py-1 rounded-lg bg-linear-to-r from-red-600 to-orange-500 text-white font-semibold border border-red-500/40 hover:from-red-700 hover:to-orange-600 transition shadow text-xs ${
                        deletingId === claim.id
                          ? "opacity-60 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={() => handleDeleteClaim(claim.id)}
                      disabled={deletingId === claim.id}
                      title="Delete Claim"
                    >
                      <Trash2 size={16} />
                      {deletingId === claim.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                  {/* Edit Claim Modal */}
                  {showEditModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                      <div className="w-full max-w-3xl mx-auto animate-fade-in">
                        {loadingEdit || !editingClaim ? (
                          <div className="bg-slate-900 rounded-xl shadow-xl p-8 text-center text-blue-400 text-lg animate-pulse">
                            Loading claim details...
                          </div>
                        ) : (
                          <UpdateClaimForm
                            authToken={authToken}
                            claim={editingClaim}
                            onSuccess={handleUpdateClaimSuccess}
                            onClose={handleCloseEditModal}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Claim Details Modal */}
        {showClaimDetailsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-slate-900 rounded-2xl shadow-2xl p-8 max-w-2xl w-full relative border border-blue-500/30 animate-fade-in">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl"
                onClick={handleCloseClaimDetailsModal}
                aria-label="Close"
              >
                &times;
              </button>
              <h3 className="text-2xl font-bold mb-6 text-blue-300 drop-shadow">
                Claim Details
              </h3>
              {loadingClaimDetails ? (
                <div className="text-blue-400 text-center py-8">Loading...</div>
              ) : claimDetails ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <span className="block text-sm font-semibold text-slate-400 mb-1">
                        Status
                      </span>
                      <span className="text-lg text-blue-300 font-medium">
                        {claimDetails.status}
                      </span>
                    </div>
                    {claimDetails.match_percentage !== undefined && (
                      <div>
                        <span className="block text-sm font-semibold text-slate-400 mb-1">
                          Match Percentage
                        </span>
                        <span className="text-lg text-green-300 font-medium">
                          {claimDetails.match_percentage}%
                        </span>
                      </div>
                    )}
                    <div>
                      <span className="block text-sm font-semibold text-slate-400 mb-1">
                        Claimed At
                      </span>
                      <span className="text-lg text-blue-300 font-medium">
                        {new Date(claimDetails.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="block text-sm font-semibold text-slate-400 mb-3">
                        Claim Details
                      </span>
                      <div className="text-base leading-relaxed">
                        {typeof claimDetails.claim_details === "object" ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                            {Object.entries(claimDetails.claim_details).map(
                              ([key, value]) => (
                                <div key={key} className="flex flex-col mb-2">
                                  <span className="font-semibold text-slate-400 capitalize text-xs">
                                    {key.replace(/_/g, " ")}
                                  </span>
                                  <span className="text-slate-100 text-sm wrap-break-word">
                                    {String(value)}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          String(claimDetails.claim_details)
                        )}
                      </div>
                    </div>
                  </div>
                  {claimDetails.image_urls &&
                    claimDetails.image_urls.length > 0 && (
                      <div className="flex flex-wrap gap-3 items-start justify-center">
                        {claimDetails.image_urls.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`Claim Image ${idx + 1}`}
                            className="w-32 h-32 object-cover rounded-lg border-2 border-blue-500/30 shadow-lg hover:scale-105 transition"
                          />
                        ))}
                      </div>
                    )}
                </div>
              ) : (
                <div className="text-gray-400 text-center py-8">
                  No details found.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
