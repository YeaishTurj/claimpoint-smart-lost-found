import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader,
  Package,
  Search,
  Link2,
  ThumbsUp,
  ThumbsDown,
  CheckCircle,
  Trash2,
  ChevronDown,
} from "lucide-react";
import { api } from "../lib/api";
import { toast } from "react-toastify";
import { useAuth } from "../context/auth.context";

const ManageMatchesPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("PENDING");
  const [isProcessing, setIsProcessing] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [expandedDetails, setExpandedDetails] = useState({});

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "STAFF") return;
    fetchMatches();
  }, [isAuthenticated, user]);

  const fetchMatches = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get("/staff/matches");
      setMatches(response.data.matches || []);
    } catch (err) {
      console.error("Failed to fetch matches:", err);
      setError(err.response?.data?.message || "Failed to load matches");
      toast.error("Failed to load matches");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = (match) => {
    setSelectedMatch(match);
    setConfirmAction("approve");
    setShowConfirmModal(true);
  };

  const handleReject = (match) => {
    setSelectedMatch(match);
    setConfirmAction("reject");
    setShowConfirmModal(true);
  };

  const handleCollect = (match) => {
    setSelectedMatch(match);
    setConfirmAction("collect");
    setShowConfirmModal(true);
  };

  const confirmAction_execute = async () => {
    if (!selectedMatch) return;

    setIsProcessing(selectedMatch.match_id);

    try {
      let endpoint = "";
      let successMessage = "";

      if (confirmAction === "approve") {
        endpoint = `/staff/matches/${selectedMatch.match_id}/approve`;
        successMessage = "Match approved! User will be notified.";
      } else if (confirmAction === "reject") {
        endpoint = `/staff/matches/${selectedMatch.match_id}/reject`;
        successMessage = "Match rejected.";
      } else if (confirmAction === "collect") {
        endpoint = `/staff/matches/${selectedMatch.match_id}/collected`;
        successMessage = "Item marked as collected. Report resolved.";
      }

      const response = await api.patch(endpoint);

      if (response.status === 200) {
        toast.success(successMessage);

        // Update the match in the list based on action
        setMatches((prev) =>
          prev.map((m) =>
            m.match_id === selectedMatch.match_id
              ? {
                  ...m,
                  match_status:
                    confirmAction === "approve"
                      ? "APPROVED"
                      : confirmAction === "reject"
                      ? "REJECTED"
                      : "APPROVED", // collected means approved
                  report_status:
                    confirmAction === "collect" ? "RESOLVED" : m.report_status,
                }
              : m
          )
        );
      }
    } catch (err) {
      console.error(`Error ${confirmAction} match:`, err);
      toast.error(
        err.response?.data?.message || `Failed to ${confirmAction} match`
      );
    } finally {
      setIsProcessing(null);
      setShowConfirmModal(false);
      setSelectedMatch(null);
      setConfirmAction(null);
    }
  };

  const filteredMatches = matches.filter((match) => {
    const reportType = match.report_item_type || "";
    const foundType = match.found_item_type || "";
    const scoreStr =
      typeof match.match_score === "number"
        ? match.match_score.toString()
        : String(match.match_score || "");

    const matchesSearch =
      reportType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      foundType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scoreStr.includes(searchTerm);

    const matchesFilter =
      filterStatus === "ALL" || match.match_status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    const config = {
      PENDING: { bg: "bg-amber-500/10", text: "text-amber-400", icon: "⏳" },
      APPROVED: {
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
        icon: "✓",
      },
      REJECTED: { bg: "bg-red-500/10", text: "text-red-400", icon: "✕" },
    };
    const c = config[status] || config.PENDING;
    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 ${c.bg} ${c.text} rounded-full text-xs font-semibold border border-current/20`}
      >
        {c.icon} {status}
      </span>
    );
  };

  const getReportStatusBadge = (status) => {
    const config = {
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
    };
    const c = config[status] || config.OPEN;
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 ${c.bg} ${c.text} rounded text-xs font-semibold`}
      >
        {c.label}
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

  const toggleDetails = (matchId, section) => {
    const key = `${matchId}-${section}`;
    setExpandedDetails((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderDetailSection = (matchId, section, details, isHidden = false) => {
    if (!details) return null;
    const key = `${matchId}-${section}`;
    const isExpanded = expandedDetails[key];

    const formatDetail = (key, value) => {
      if (typeof value === "object") {
        return JSON.stringify(value, null, 2);
      }
      return String(value);
    };

    return (
      <div
        className={`mt-3 rounded-lg border overflow-hidden ${
          isHidden
            ? "border-orange-500/40 bg-orange-950/20"
            : "border-slate-700/60 bg-slate-800/40"
        }`}
      >
        <button
          onClick={() => toggleDetails(matchId, section)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-700/30 transition-colors"
        >
          <span
            className={`text-xs font-bold uppercase tracking-wide ${
              isHidden ? "text-orange-400" : "text-slate-300"
            }`}
          >
            {isHidden ? "🔒 " : ""}
            {section}
          </span>
          <ChevronDown
            size={16}
            className={`transition-transform ${
              isExpanded ? "rotate-180" : ""
            } ${isHidden ? "text-orange-400" : "text-slate-400"}`}
          />
        </button>
        {isExpanded && (
          <div
            className={`border-t ${
              isHidden ? "border-orange-500/20" : "border-slate-700/40"
            } px-4 py-3`}
          >
            {typeof details === "object" ? (
              <div className="space-y-2">
                {Object.entries(details).map(([key, value]) => (
                  <div key={key} className="text-xs">
                    <span
                      className={
                        isHidden
                          ? "text-orange-300 font-semibold"
                          : "text-slate-400 font-semibold"
                      }
                    >
                      {key}:
                    </span>
                    <span
                      className={`ml-2 ${
                        isHidden ? "text-orange-100" : "text-slate-200"
                      }`}
                    >
                      {formatDetail(key, value)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p
                className={`text-xs whitespace-pre-wrap ${
                  isHidden ? "text-orange-100" : "text-slate-200"
                }`}
              >
                {String(details)}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  if (!isAuthenticated || user?.role !== "STAFF") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
        <div className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={36} className="text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Access Denied</h2>
          <p className="text-slate-300 mb-6">
            Only staff members can access this page.
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
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
                <Link2 size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  Manage Item Matches
                </h1>
                <p className="text-slate-400 mt-1">
                  Review and approve auto-matched lost reports
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-900/70 border border-white/10 rounded-xl p-4">
            <p className="text-slate-400 text-sm font-semibold uppercase">
              Total Matches
            </p>
            <p className="text-3xl font-bold text-white mt-2">
              {matches.length}
            </p>
          </div>
          <div className="bg-slate-900/70 border border-white/10 rounded-xl p-4">
            <p className="text-slate-400 text-sm font-semibold uppercase">
              Pending
            </p>
            <p className="text-3xl font-bold text-amber-400 mt-2">
              {matches.filter((m) => m.match_status === "PENDING").length}
            </p>
          </div>
          <div className="bg-slate-900/70 border border-white/10 rounded-xl p-4">
            <p className="text-slate-400 text-sm font-semibold uppercase">
              Approved
            </p>
            <p className="text-3xl font-bold text-emerald-400 mt-2">
              {matches.filter((m) => m.match_status === "APPROVED").length}
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 bg-slate-900/70 border border-white/10 rounded-2xl p-4 space-y-4">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search by item type, score..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 transition-all"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {["ALL", "PENDING", "APPROVED", "REJECTED"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filterStatus === status
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-800 text-slate-400 border border-white/10 hover:border-emerald-500/50"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-32 text-slate-300">
            <Loader size={48} className="text-emerald-400 animate-spin mr-4" />
            Loading matches...
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center text-red-400">
            <AlertCircle size={48} className="mx-auto mb-4" />
            <p>{error}</p>
            <button
              onClick={fetchMatches}
              className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
            >
              Retry
            </button>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-12 text-center text-white">
            <Link2 size={48} className="mx-auto mb-4 text-slate-500" />
            <h3 className="text-xl font-bold mb-2">No Matches Found</h3>
            <p className="text-slate-400">
              {matches.length === 0
                ? "No matches yet. Add found items to see matches with lost reports."
                : "No matches match your current filter."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMatches.map((match) => (
              <div
                key={match.match_id}
                className="bg-slate-900/70 border border-white/10 rounded-2xl p-6 shadow-2xl hover:border-emerald-500/30 transition-all"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Lost Report */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-white">
                        Lost Report
                      </h3>
                      {getReportStatusBadge(match.report_status)}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Item Type:</span>
                        <span className="text-white font-semibold">
                          {match.report_item_type}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Location:</span>
                        <span className="text-white">
                          {match.report_location}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Date Lost:</span>
                        <span className="text-white">
                          {formatDate(match.report_date)}
                        </span>
                      </div>
                      {renderDetailSection(
                        match.match_id,
                        "Report Details",
                        match.report_details,
                        false
                      )}
                    </div>
                  </div>

                  {/* Found Item */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-white">
                        Found Item
                      </h3>
                      {getStatusBadge(match.match_status)}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Item Type:</span>
                        <span className="text-white font-semibold">
                          {match.found_item_type}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Location:</span>
                        <span className="text-white">
                          {match.found_item_location}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Date Found:</span>
                        <span className="text-white">
                          {formatDate(match.found_item_date)}
                        </span>
                      </div>
                      {renderDetailSection(
                        match.match_id,
                        "Public Details",
                        match.found_public_details,
                        false
                      )}
                      {renderDetailSection(
                        match.match_id,
                        "Hidden Details (Backend)",
                        match.found_hidden_details,
                        true
                      )}
                    </div>
                  </div>
                </div>

                {/* Match Score */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-slate-300 font-semibold">
                      AI Match Score
                    </span>
                    <span className="text-2xl font-bold text-emerald-400">
                      {match.match_score}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full transition-all"
                      style={{ width: `${match.match_score}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                {match.match_status === "PENDING" && (
                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => handleApprove(match)}
                      disabled={isProcessing === match.match_id}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing === match.match_id ? (
                        <Loader size={18} className="animate-spin" />
                      ) : (
                        <ThumbsUp size={18} />
                      )}
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(match)}
                      disabled={isProcessing === match.match_id}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing === match.match_id ? (
                        <Loader size={18} className="animate-spin" />
                      ) : (
                        <ThumbsDown size={18} />
                      )}
                      Reject
                    </button>
                  </div>
                )}

                {match.match_status === "APPROVED" &&
                  match.report_status !== "RESOLVED" && (
                    <div className="mt-6">
                      <button
                        onClick={() => handleCollect(match)}
                        disabled={isProcessing === match.match_id}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing === match.match_id ? (
                          <Loader size={18} className="animate-spin" />
                        ) : (
                          <CheckCircle size={18} />
                        )}
                        Mark as Collected
                      </button>
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      {showConfirmModal && selectedMatch && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900/95 rounded-2xl border border-slate-700/50 p-8 max-w-md w-full">
            <div className="flex gap-4 mb-6">
              <AlertCircle size={28} className="text-amber-400" />
              <h3 className="text-2xl font-bold text-white">Confirm Action</h3>
            </div>
            <p className="text-slate-300 mb-6">
              {confirmAction === "approve"
                ? `Approve this match? The user will be notified.`
                : confirmAction === "reject"
                ? "Reject this match?"
                : "Mark item as collected? Report will be resolved."}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={isProcessing === selectedMatch.match_id}
                className="flex-1 py-3 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction_execute}
                disabled={isProcessing === selectedMatch.match_id}
                className={`flex-1 py-3 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                  confirmAction === "approve"
                    ? "bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600"
                    : confirmAction === "reject"
                    ? "bg-red-600 hover:bg-red-700 disabled:bg-red-600"
                    : "bg-teal-600 hover:bg-teal-700 disabled:bg-teal-600"
                }`}
              >
                {isProcessing === selectedMatch.match_id ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Processing...
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

export default ManageMatchesPage;
