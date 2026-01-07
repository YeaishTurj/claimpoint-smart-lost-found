import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  AlertCircle,
  Package,
  FileText,
  Edit2,
  Trash2,
  Eye,
  Loader,
  CheckCircle2,
  Clock,
  Plus,
  AlertTriangle,
} from "lucide-react";
import { api } from "../lib/api";
import { toast } from "react-toastify";
import { useAuth } from "../context/auth.context";
import ClaimDetailsModal from "../components/ClaimDetailsModal";
import LostReportDetailsModal from "../components/LostReportDetailsModal";

const MyDashboardPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState("reports");
  const [lostReports, setLostReports] = useState([]);
  const [claims, setClaims] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const [selectedClaimId, setSelectedClaimId] = useState(null);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [showDeleteReportModal, setShowDeleteReportModal] = useState(false);
  const [showDeleteClaimModal, setShowDeleteClaimModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user?.role === "USER") {
      fetchData();
    }
  }, [isAuthenticated, user]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [reportsRes, claimsRes] = await Promise.all([
        api.get("/user/lost-reports"),
        api.get("/user/claims"),
      ]);
      setLostReports(reportsRes.data.lostReports || []);
      setClaims(claimsRes.data.claims || []);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReport = async (reportId) => {
    setIsDeleting(reportId);
    try {
      await api.delete(`/user/lost-reports/${reportId}`);
      setLostReports((prev) => prev.filter((r) => r.id !== reportId));
      toast.success("Lost report deleted successfully");
      setShowDeleteReportModal(false);
      setItemToDelete(null);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete lost report"
      );
    } finally {
      setIsDeleting(null);
    }
  };

  const handleDeleteClaim = async (claimId) => {
    setIsDeleting(claimId);
    try {
      await api.delete(`/user/claims/${claimId}`);
      setClaims((prev) => prev.filter((c) => c.id !== claimId));
      toast.success("Claim deleted successfully");
      setShowDeleteClaimModal(false);
      setItemToDelete(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete claim");
    } finally {
      setIsDeleting(null);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      OPEN: { bg: "bg-blue-500/10", text: "text-blue-400", label: "Open" },
      MATCHED: {
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
        label: "Matched",
      },
      RESOLVED: {
        bg: "bg-teal-500/10",
        text: "text-teal-400",
        label: "Resolved",
      },
      PENDING: {
        bg: "bg-amber-500/10",
        text: "text-amber-400",
        label: "Pending",
      },
      APPROVED: {
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
        label: "Approved",
      },
      REJECTED: {
        bg: "bg-rose-500/10",
        text: "text-rose-400",
        label: "Rejected",
      },
      COLLECTED: {
        bg: "bg-teal-500/10",
        text: "text-teal-400",
        label: "Collected",
      },
    };
    const config = statusConfig[status] || statusConfig.OPEN;
    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 ${config.bg} ${config.text} rounded-full text-xs font-semibold border border-current/20`}
      >
        <CheckCircle2 size={12} />
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!isAuthenticated || user?.role !== "USER") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
        <div className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={36} className="text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            Authentication Required
          </h2>
          <button
            onClick={() => navigate("/login")}
            className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-xl"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="group inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 mb-6"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="font-medium">Back</span>
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <FileText size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  My Dashboard
                </h1>
                <p className="text-slate-400 mt-1">
                  Manage your lost reports and claims
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/report-lost-item")}
              className="hidden sm:flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl"
            >
              <Plus size={18} />
              <span>Report Lost Item</span>
            </button>
          </div>
        </div>

        <div className="mb-6 flex gap-3">
          <button
            onClick={() => setActiveTab("reports")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === "reports"
                ? "bg-emerald-600 text-white"
                : "bg-slate-900/70 text-slate-400 border border-white/10"
            }`}
          >
            <div className="flex items-center gap-2">
              <Package size={18} />
              Lost Reports ({lostReports.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab("claims")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === "claims"
                ? "bg-emerald-600 text-white"
                : "bg-slate-900/70 text-slate-400 border border-white/10"
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} />
              My Claims ({claims.length})
            </div>
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-32 text-slate-300">
            <Loader size={48} className="text-emerald-400 animate-spin mr-4" />
            Loading...
          </div>
        ) : activeTab === "reports" ? (
          <div className="space-y-6">
            {lostReports.length === 0 ? (
              <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-12 text-center text-white">
                <Package size={32} className="mx-auto mb-4 text-slate-500" />
                <h3>No Lost Reports Yet</h3>
              </div>
            ) : (
              lostReports.map((report) => (
                <div
                  key={report.id}
                  className="bg-slate-900/70 border border-white/10 rounded-2xl p-6 shadow-2xl hover:border-emerald-500/30 transition-all"
                >
                  <div className="flex items-start justify-between gap-4 text-white">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold">
                          {report.item_type}
                        </h3>
                        {getStatusBadge(report.status)}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-slate-400 font-bold uppercase text-xs">
                            Location
                          </p>
                          {report.location_lost}
                        </div>
                        <div>
                          <p className="text-slate-400 font-bold uppercase text-xs">
                            Date
                          </p>
                          {formatDate(report.date_lost)}
                        </div>
                        <div>
                          <p className="text-slate-400 font-bold uppercase text-xs">
                            Reported
                          </p>
                          {formatDate(report.created_at)}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedReportId(report.id);
                          setIsReportModalOpen(true);
                        }}
                        className="p-2.5 bg-slate-950/50 border border-white/10 rounded-lg text-slate-400 hover:text-emerald-400"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/update-lost-report/${report.id}`)
                        }
                        className="p-2.5 bg-slate-950/50 border border-white/10 rounded-lg text-slate-400 hover:text-blue-400"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setItemToDelete(report);
                          setShowDeleteReportModal(true);
                        }}
                        disabled={isDeleting === report.id}
                        className="p-2.5 bg-slate-950/50 border border-white/10 rounded-lg text-slate-400 hover:text-red-400"
                      >
                        {isDeleting === report.id ? (
                          <Loader size={18} className="animate-spin" />
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {claims.map((claim) => (
              <div
                key={claim.id}
                className="bg-slate-900/70 border border-white/10 rounded-2xl p-6 shadow-2xl hover:border-emerald-500/30 transition-all"
              >
                <div className="flex items-start gap-4 text-white">
                  {claim.thumbnail && (
                    <img
                      src={claim.thumbnail}
                      alt={claim.item_name}
                      className="w-24 h-24 rounded-xl object-cover border border-white/10"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold">{claim.item_name}</h3>
                      {getStatusBadge(claim.status)}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-slate-400 font-bold uppercase text-xs">
                          Match Score
                        </p>
                        {claim.match_score}%
                      </div>
                      <div>
                        <p className="text-slate-400 font-bold uppercase text-xs">
                          Submitted
                        </p>
                        {formatDate(claim.date_submitted)}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setSelectedClaimId(claim.id);
                        setIsClaimModalOpen(true);
                      }}
                      className="p-2.5 bg-slate-950/50 border border-white/10 rounded-lg text-slate-400 hover:text-emerald-400"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => {
                        setItemToDelete(claim);
                        setShowDeleteClaimModal(true);
                      }}
                      className="p-2.5 bg-slate-950/50 border border-white/10 rounded-lg text-slate-400 hover:text-red-400"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modals */}
        <ClaimDetailsModal
          claimId={selectedClaimId}
          isOpen={isClaimModalOpen}
          onClose={() => {
            setIsClaimModalOpen(false);
            setSelectedClaimId(null);
          }}
        />
        <LostReportDetailsModal
          reportId={selectedReportId}
          isOpen={isReportModalOpen}
          onClose={() => {
            setIsReportModalOpen(false);
            setSelectedReportId(null);
          }}
        />

        {showDeleteReportModal && itemToDelete && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900/95 rounded-2xl border border-slate-700/50 p-8 max-w-md w-full">
              <div className="flex gap-4 mb-6">
                <AlertTriangle size={28} className="text-red-400" />
                <h3 className="text-2xl font-bold text-white">
                  Confirm Deletion
                </h3>
              </div>
              <p className="text-slate-300 mb-6">
                Are you sure you want to delete the report for{" "}
                <span className="text-white font-bold">
                  {itemToDelete.item_type}
                </span>
                ?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteReportModal(false)}
                  className="flex-1 py-3 border border-slate-700 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteReport(itemToDelete.id)}
                  className="flex-1 py-3 bg-red-600 text-white rounded-xl"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {showDeleteClaimModal && itemToDelete && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900/95 rounded-2xl border border-slate-700/50 p-8 max-w-md w-full">
              <div className="flex gap-4 mb-6">
                <AlertTriangle size={28} className="text-red-400" />
                <h3 className="text-2xl font-bold text-white">
                  Confirm Deletion
                </h3>
              </div>
              <p className="text-slate-300 mb-6">
                Are you sure you want to delete the claim for{" "}
                <span className="text-white font-bold">
                  {itemToDelete.item_name}
                </span>
                ?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteClaimModal(false)}
                  className="flex-1 py-3 border border-slate-700 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteClaim(itemToDelete.id)}
                  className="flex-1 py-3 bg-red-600 text-white rounded-xl"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyDashboardPage;
