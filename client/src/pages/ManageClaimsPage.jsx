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
  ChevronRight,
  ClipboardList,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { api } from "../lib/api";
import { toast } from "react-toastify";
import { useAuth } from "../context/auth.context";
import StaffClaimDetailsModal from "../components/StaffClaimDetailsModal";
import { PageShell } from "../components/layout";
import { AccessCard } from "../components/ui";

const ManageClaimsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [claims, setClaims] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(null);

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [newStatus, setNewStatus] = useState(null);

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
      toast.error("Registry Access Error: Could not load claims", {
        theme: "dark",
      });
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

      toast.success(`Entry status updated to ${newStatus}`, { theme: "dark" });
      setShowStatusModal(false);

      setClaims((prev) =>
        prev.map((claim) =>
          claim.id === selectedClaim.id
            ? { ...claim, status: newStatus }
            : claim
        )
      );
    } catch (err) {
      console.error("Failed to update claim status:", err);
      toast.error(err.response?.data?.message || "Status update failed", {
        theme: "dark",
      });
    } finally {
      setIsUpdating(null);
    }
  };

  if (!isAuthenticated || user?.role !== "STAFF") {
    return (
      <PageShell variant="centered">
        <AccessCard
          icon={AlertCircle}
          title="Security Override"
          description="High-level personnel authentication required to access claim adjudications."
        />
      </PageShell>
    );
  }

  const pendingCount = claims.filter((c) => c.status === "PENDING").length;

  return (
    <PageShell>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
        <button
          onClick={() => navigate("/admin")}
          className="hover:text-emerald-400 transition-colors"
        >
          Staff Hub
        </button>
        <ChevronRight size={12} />
        <span className="text-slate-300">Claim Adjudication</span>
      </div>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg mb-4">
            <ClipboardList size={14} className="text-emerald-400" />
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
              Verification Queue
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Manage <span className="text-emerald-400">Claims.</span>
          </h1>
          <p className="text-slate-400 font-medium max-w-xl">
            Review cross-referenced metadata and adjudicate ownership claims.
            Ensure high match percentages before approval.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <StatPill label="Total Ledger" value={claims.length} color="slate" />
          <StatPill label="Pending Review" value={pendingCount} color="amber" />
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="py-24 flex flex-col items-center">
          <Loader className="animate-spin text-emerald-500 mb-4" size={40} />
          <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.2em]">
            Processing Ownership Data...
          </p>
        </div>
      ) : claims.length === 0 ? (
        <div className="bg-[#0b1120] rounded-[2.5rem] p-20 border border-slate-800 text-center">
          <Package size={60} className="mx-auto text-slate-800 mb-6" />
          <h3 className="text-xl font-black text-white">Queue Clear</h3>
          <p className="text-slate-500 text-sm mt-2">
            No active claims require adjudication at this time.
          </p>
        </div>
      ) : (
        <div className="bg-[#0b1120] rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-800">
                  <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Target Asset
                  </th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Claimant Identity
                  </th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Match Logic
                  </th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Auth State
                  </th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Adjudication
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {claims.map((claim) => (
                  <tr
                    key={claim.id}
                    className="hover:bg-slate-900/30 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <p className="font-bold text-white text-base">
                        {claim.product_type}
                      </p>
                      <p className="text-[9px] font-mono text-slate-600 uppercase tracking-tighter">
                        CLAIM_ID: {claim.id?.slice(0, 10)}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-xs font-bold text-slate-300 group-hover:text-emerald-400 transition-colors">
                        {claim.user_email}
                      </p>
                      <p className="text-[9px] font-black text-slate-600 uppercase mt-1">
                        Submitted:{" "}
                        {new Date(claim.date_submitted).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1.5 min-w-[120px]">
                        <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-500">
                          <span>Confidence</span>
                          <span className="text-emerald-400">
                            {claim.match_percentage}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
                            style={{
                              width: `${parseInt(claim.match_percentage)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <StatusBadge status={claim.status} />
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <ActionButton
                          label="Approve"
                          variant="emerald"
                          onClick={() =>
                            handleStatusChangeClick(claim, "APPROVED")
                          }
                          disabled={
                            claim.status === "APPROVED" ||
                            claim.status === "COLLECTED" ||
                            isUpdating === claim.id
                          }
                        />
                        <ActionButton
                          label="Reject"
                          variant="red"
                          onClick={() =>
                            handleStatusChangeClick(claim, "REJECTED")
                          }
                          disabled={
                            claim.status === "REJECTED" ||
                            claim.status === "COLLECTED" ||
                            isUpdating === claim.id
                          }
                        />
                        <ActionButton
                          label="Collected"
                          variant="blue"
                          onClick={() =>
                            handleStatusChangeClick(claim, "COLLECTED")
                          }
                          disabled={
                            claim.status === "COLLECTED" ||
                            claim.status === "REJECTED" ||
                            isUpdating === claim.id
                          }
                        />
                        <button
                          onClick={() => {
                            setSelectedClaimId(claim.id);
                            setShowDetailsModal(true);
                          }}
                          className="p-2.5 bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition-all rounded-xl"
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
        </div>
      )}

      {/* Details Modal */}
      <StaffClaimDetailsModal
        claimId={selectedClaimId}
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedClaimId(null);
        }}
      />

      {/* Confirmation Modal */}
      {showStatusModal && selectedClaim && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center z-[110] p-4">
          <div className="bg-[#0b1120] rounded-[2.5rem] border border-emerald-500/20 shadow-2xl max-w-md w-full p-10">
            <div className="flex flex-col items-center text-center">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border ${
                  newStatus === "APPROVED"
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                    : newStatus === "REJECTED"
                    ? "bg-red-500/10 border-red-500/20 text-red-500"
                    : "bg-blue-500/10 border-blue-500/20 text-blue-500"
                }`}
              >
                {newStatus === "APPROVED" ? (
                  <CheckCircle size={32} />
                ) : newStatus === "REJECTED" ? (
                  <XCircle size={32} />
                ) : (
                  <Package size={32} />
                )}
              </div>
              <h3 className="text-2xl font-black text-white mb-3 tracking-tight">
                Modify Claim State?
              </h3>
              <p className="text-slate-400 mb-8 text-sm font-medium leading-relaxed px-4">
                Execute state change for{" "}
                <span className="text-white font-bold">
                  {selectedClaim.product_type}
                </span>{" "}
                to <span className="text-white font-bold">{newStatus}</span>?
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowStatusModal(false)}
                disabled={isUpdating === selectedClaim.id}
                className="flex-1 px-5 py-4 bg-slate-900 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:text-white transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmStatusChange}
                disabled={isUpdating === selectedClaim.id}
                className={`flex-1 px-5 py-4 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 ${
                  newStatus === "APPROVED"
                    ? "bg-emerald-500 shadow-emerald-500/20"
                    : newStatus === "REJECTED"
                    ? "bg-red-500 shadow-red-500/20"
                    : "bg-blue-600 shadow-blue-500/20"
                }`}
              >
                {isUpdating === selectedClaim.id ? (
                  <Loader size={14} className="animate-spin" />
                ) : (
                  "Confirm Change"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
};

// --- Helper Components ---

const StatPill = ({ label, value, color }) => (
  <div
    className={`px-6 py-4 bg-slate-900/40 border ${
      color === "amber" ? "border-amber-500/20" : "border-slate-800"
    } rounded-2xl min-w-[140px]`}
  >
    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">
      {label}
    </p>
    <p
      className={`text-3xl font-black ${
        color === "amber" ? "text-amber-400" : "text-white"
      }`}
    >
      {value}
    </p>
  </div>
);

const ActionButton = ({ label, variant, onClick, disabled }) => {
  const styles = {
    emerald:
      "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950",
    red: "border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white",
    blue: "border-blue-500/30 text-blue-400 hover:bg-blue-500 hover:text-white",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg border transition-all disabled:opacity-20 disabled:cursor-not-allowed ${styles[variant]}`}
    >
      {label}
    </button>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    APPROVED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    REJECTED: "bg-red-500/10 text-red-400 border-red-500/20",
    COLLECTED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };
  return (
    <span
      className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-md border ${
        styles[status] || styles.PENDING
      }`}
    >
      {status}
    </span>
  );
};

export default ManageClaimsPage;
