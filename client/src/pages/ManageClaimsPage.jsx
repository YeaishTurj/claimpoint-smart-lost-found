import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Loader,
  Package,
  X,
  XCircle,
  Eye,
} from "lucide-react";
import { api } from "../lib/api";
import { toast } from "react-toastify";
import { useAuth } from "../context/auth.context";
import StaffClaimDetailsModal from "../components/StaffClaimDetailsModal";

const ManageClaimsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [claims, setClaims] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(null); // Track which claim is updating

  // Modal state for status update
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [newStatus, setNewStatus] = useState(null);

  // Modal state for claim details
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedClaimId, setSelectedClaimId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "STAFF") return;
    fetchClaims();
  }, [isAuthenticated, user]);

  const fetchClaims = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get("/staff/claims");
      setClaims(response.data.claims || []);
    } catch (err) {
      console.error("Failed to fetch claims:", err);
      setError(err.response?.data?.message || "Failed to load claims");
      toast.error("Failed to load claims");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChangeClick = (claim, status) => {
    setSelectedClaim(claim);
    setNewStatus(status);
    setShowStatusModal(true);
  };

  const confirmStatusChange = async () => {
    if (!selectedClaim || !newStatus) return;

    setIsUpdating(selectedClaim.id);
    try {
      await api.patch(`/staff/claims/${selectedClaim.id}`, {
        status: newStatus,
      });

      toast.success(`Claim updated to ${newStatus}`);
      setShowStatusModal(false);

      // Update local state
      setClaims((prev) =>
        prev.map((claim) =>
          claim.id === selectedClaim.id
            ? { ...claim, status: newStatus }
            : claim
        )
      );
    } catch (err) {
      console.error("Failed to update claim status:", err);
      toast.error(err.response?.data?.message || "Failed to update claim");
    } finally {
      setIsUpdating(null);
    }
  };

  if (!isAuthenticated || user?.role !== "STAFF") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
        <div className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={36} className="text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            Access Required
          </h2>
          <p className="text-slate-400 mb-8 text-sm leading-relaxed">
            You must be logged in as staff to manage claims.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
        <div className="flex flex-col items-center gap-4 text-slate-300">
          <Loader className="w-10 h-10 animate-spin text-emerald-400" />
          <p className="text-sm">Loading claims...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="group inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors mb-6"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="font-medium">Back</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-linear-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <AlertCircle size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Manage Claims
              </h1>
              <p className="text-slate-400 mt-1">
                Review and update the status of user claims
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        {error && (
          <div className="mb-6 bg-red-500/10 border-l-4 border-red-500 px-6 py-4 rounded-r-xl">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-red-400 mt-0.5 shrink-0" />
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          </div>
        )}

        {claims.length === 0 ? (
          <div className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-12 text-center">
            <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package size={32} className="text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-300 mb-2">
              No Claims Yet
            </h3>
            <p className="text-slate-400 text-sm">
              All pending claims will appear here once users submit them.
            </p>
          </div>
        ) : (
          <div className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-white/10 bg-white/5">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Claims Table
              </h2>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-slate-950/50">
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Item Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                      User Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Match %
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Date Submitted
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {claims.map((claim) => (
                    <tr
                      key={claim.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-white font-medium">
                        {claim.product_type}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">
                        {claim.user_email}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-slate-700/50 rounded-full h-2 max-w-xs">
                            <div
                              className="bg-linear-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all"
                              style={{
                                width: `${parseInt(claim.match_percentage)}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-emerald-400 min-w-max">
                            {claim.match_percentage}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                            claim.status === "APPROVED"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                              : claim.status === "REJECTED"
                              ? "bg-red-500/10 text-red-400 border-red-500/30"
                              : claim.status === "COLLECTED"
                              ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                          }`}
                        >
                          {claim.status === "APPROVED" && (
                            <CheckCircle size={14} />
                          )}
                          {claim.status === "REJECTED" && <XCircle size={14} />}
                          {claim.status === "COLLECTED" && (
                            <Package size={14} />
                          )}
                          {claim.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {new Date(claim.date_submitted).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleStatusChangeClick(claim, "APPROVED")
                            }
                            disabled={
                              claim.status === "APPROVED" ||
                              claim.status === "COLLECTED" ||
                              isUpdating === claim.id
                            }
                            className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-semibold border border-emerald-500/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Approve this claim"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChangeClick(claim, "REJECTED")
                            }
                            disabled={
                              claim.status === "REJECTED" ||
                              claim.status === "COLLECTED" ||
                              isUpdating === claim.id
                            }
                            className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-semibold border border-red-500/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Reject this claim"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChangeClick(claim, "COLLECTED")
                            }
                            disabled={
                              claim.status === "COLLECTED" ||
                              claim.status === "REJECTED" ||
                              isUpdating === claim.id
                            }
                            className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg text-xs font-semibold border border-blue-500/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Mark as collected"
                          >
                            Collected
                          </button>
                          <button
                            onClick={() => {
                              setSelectedClaimId(claim.id);
                              setShowDetailsModal(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all"
                            title="View claim details"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="px-6 py-4 border-t border-white/10 bg-white/5">
              <p className="text-sm text-slate-400">
                Total claims:{" "}
                <span className="font-semibold">{claims.length}</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Claim Details Modal */}
      <StaffClaimDetailsModal
        claimId={selectedClaimId}
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedClaimId(null);
        }}
      />

      {/* Status Update Confirmation Modal */}
      {showStatusModal && selectedClaim && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">
                Update Claim Status
              </h3>
              <button
                onClick={() => setShowStatusModal(false)}
                disabled={isUpdating === selectedClaim.id}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-slate-300 text-sm mb-6">
              Are you sure you want to change this claim status to{" "}
              <span className="font-semibold text-emerald-400">
                {newStatus}
              </span>
              ?
            </p>

            <div className="bg-slate-950/50 rounded-xl p-4 mb-6 space-y-2">
              <p className="text-xs text-slate-400">Claim Details:</p>
              <p className="text-sm text-white font-medium">
                Item: {selectedClaim.product_type}
              </p>
              <p className="text-sm text-slate-300">
                User: {selectedClaim.user_email}
              </p>
              <p className="text-sm text-slate-300">
                Match: {selectedClaim.match_percentage}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowStatusModal(false)}
                disabled={isUpdating === selectedClaim.id}
                className="flex-1 py-2.5 px-4 bg-transparent border border-white/20 hover:bg-white/5 text-slate-300 hover:text-white rounded-lg font-semibold text-sm transition-all active:scale-95 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmStatusChange}
                disabled={isUpdating === selectedClaim.id}
                className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-sm transition-all active:scale-95 shadow-lg shadow-emerald-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isUpdating === selectedClaim.id ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageClaimsPage;
