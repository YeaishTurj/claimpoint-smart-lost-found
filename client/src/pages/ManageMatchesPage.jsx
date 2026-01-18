import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  AlertCircle,
  ArrowLeft,
  Loader,
  Package,
  Search,
  Link2,
  ThumbsUp,
  ThumbsDown,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Database,
  Cpu,
  Lock,
  Calendar,
  MapPin,
} from "lucide-react";
import { api } from "../lib/api";
import { toast } from "react-toastify";
import { useAuth } from "../context/auth.context";
import { PageShell } from "../components/layout";
import { AccessCard } from "../components/ui";

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
      toast.error("Registry Sync Failed", { theme: "dark" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = (match, action) => {
    setSelectedMatch(match);
    setConfirmAction(action);
    setShowConfirmModal(true);
  };

  const confirmAction_execute = async () => {
    if (!selectedMatch) return;
    setIsProcessing(selectedMatch.match_id);

    try {
      let endpoint = `/staff/matches/${selectedMatch.match_id}/${
        confirmAction === "collect" ? "collected" : confirmAction
      }`;
      let successMessage =
        confirmAction === "approve"
          ? "Match approved. User notified."
          : confirmAction === "reject"
          ? "Match rejected."
          : "Asset marked as collected.";

      await api.patch(endpoint);
      toast.success(successMessage, { theme: "dark" });

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
                    : "APPROVED",
                report_status:
                  confirmAction === "collect" ? "RESOLVED" : m.report_status,
              }
            : m
        )
      );
    } catch (err) {
      toast.error("Operation failed", { theme: "dark" });
    } finally {
      setIsProcessing(null);
      setShowConfirmModal(false);
      setSelectedMatch(null);
      setConfirmAction(null);
    }
  };

  const filteredMatches = matches.filter((match) => {
    const matchesSearch =
      match.report_item_type
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      match.found_item_type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "ALL" || match.match_status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const toggleDetails = (matchId, section) => {
    const key = `${matchId}-${section}`;
    setExpandedDetails((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!isAuthenticated || user?.role !== "STAFF") {
    return (
        <AccessCard
          icon={Lock}
          title="Security Override"
          description="Authentication as STAFF required to access Match Intelligence."
        />
    );
  }

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
        <span className="text-slate-300">Match Intelligence</span>
      </div>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg mb-4">
            <Cpu size={14} className="text-emerald-400" />
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
              AI Comparison Engine
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Manage <span className="text-emerald-400">Matches.</span>
          </h1>
          <p className="text-slate-400 font-medium max-w-xl">
            Review cross-referenced data points between lost reports and found
            inventory. Confirm or reject automated matches.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <StatPill label="Logic Links" value={matches.length} color="slate" />
          <StatPill
            label="Pending"
            value={matches.filter((m) => m.match_status === "PENDING").length}
            color="amber"
          />
          <StatPill
            label="Approved"
            value={matches.filter((m) => m.match_status === "APPROVED").length}
            color="emerald"
          />
        </div>
      </div>

      {/* Controls */}
      <div className="bg-[#0b1120] rounded-[2rem] p-6 border border-slate-800 shadow-2xl mb-10 space-y-4">
        <div className="relative">
          <Search
            size={20}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            placeholder="Query item type or match score..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-12 py-4 bg-[#010409] border border-slate-800 rounded-2xl text-white font-medium focus:border-emerald-500 transition-all"
          />
        </div>
        <div className="flex gap-2">
          {["ALL", "PENDING", "APPROVED", "REJECTED"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl border transition-all ${
                filterStatus === status
                  ? "bg-emerald-500 text-slate-950 border-emerald-500"
                  : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-600"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Content */}
      {isLoading ? (
        <div className="py-24 flex flex-col items-center">
          <Loader className="animate-spin text-emerald-500 mb-4" size={40} />
          <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.2em]">
            Analyzing Data Links...
          </p>
        </div>
      ) : filteredMatches.length === 0 ? (
        <div className="bg-[#0b1120] rounded-[2.5rem] p-20 border border-slate-800 text-center">
          <Link2 size={60} className="mx-auto text-slate-800 mb-6" />
          <h3 className="text-xl font-black text-white">No Active Links</h3>
          <p className="text-slate-500 text-sm mt-2">
            The matching engine has not identified any connections for this
            criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredMatches.map((match) => (
            <div
              key={match.match_id}
              className="bg-[#0b1120] rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl group"
            >
              <div className="p-8 lg:p-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {/* Column 1: Lost Report */}
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Subject: Lost Report
                      </span>
                      <StatusBadge status={match.report_status} type="report" />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-2xl font-black text-white">
                        {match.report_item_type}
                      </h3>
                      <div className="flex flex-col gap-2">
                        <DataRow
                          icon={<MapPin size={12} />}
                          label="Site"
                          value={match.report_location}
                        />
                        <DataRow
                          icon={<Calendar size={12} />}
                          label="Time"
                          value={new Date(
                            match.report_date
                          ).toLocaleDateString()}
                        />
                      </div>
                      {renderDetailSection(
                        match.match_id,
                        "Report Metadata",
                        match.report_details,
                        false,
                        toggleDetails,
                        expandedDetails
                      )}
                    </div>
                  </div>

                  {/* Column 2: Found Item */}
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Subject: Inventory Match
                      </span>
                      <StatusBadge status={match.match_status} type="match" />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-2xl font-black text-white">
                        {match.found_item_type}
                      </h3>
                      <div className="flex flex-col gap-2">
                        <DataRow
                          icon={<MapPin size={12} />}
                          label="Site"
                          value={match.found_item_location}
                        />
                        <DataRow
                          icon={<Calendar size={12} />}
                          label="Time"
                          value={new Date(
                            match.found_item_date
                          ).toLocaleDateString()}
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        {renderDetailSection(
                          match.match_id,
                          "Public Metadata",
                          match.found_public_details,
                          false,
                          toggleDetails,
                          expandedDetails
                        )}
                        {renderDetailSection(
                          match.match_id,
                          "Backend Security Data",
                          match.found_hidden_details,
                          true,
                          toggleDetails,
                          expandedDetails
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Score Section */}
                <div className="mt-10 pt-10 border-t border-slate-800">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Cpu size={18} className="text-emerald-400" />
                      <span className="text-xs font-black text-slate-300 uppercase tracking-widest">
                        Logic Confidence Score
                      </span>
                    </div>
                    <span className="text-3xl font-black text-emerald-400">
                      {match.match_score}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-800 p-0.5">
                    <div
                      className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${match.match_score}%` }}
                    />
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-8 flex flex-wrap gap-3">
                  {match.match_status === "PENDING" && (
                    <>
                      <button
                        onClick={() => handleAction(match, "approve")}
                        className="flex-1 py-4 bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-2"
                      >
                        <ThumbsUp size={16} /> Approve Match
                      </button>
                      <button
                        onClick={() => handleAction(match, "reject")}
                        className="flex-1 py-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                      >
                        <ThumbsDown size={16} /> Reject
                      </button>
                    </>
                  )}
                  {match.match_status === "APPROVED" &&
                    match.report_status !== "RESOLVED" && (
                      <button
                        onClick={() => handleAction(match, "collect")}
                        className="w-full py-4 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-blue-500 transition-all flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={16} /> Confirm Collection & Resolve
                        Report
                      </button>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirmModal && selectedMatch && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center z-[110] p-4">
          <div className="bg-[#0b1120] rounded-[2.5rem] border border-slate-800 shadow-2xl max-w-md w-full p-10">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mb-6">
                <AlertCircle size={32} className="text-emerald-400" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3 tracking-tight">
                Execute Action?
              </h3>
              <p className="text-slate-400 mb-8 text-sm font-medium leading-relaxed px-4">
                Confirming the{" "}
                <span className="text-white font-bold">{confirmAction}</span>{" "}
                protocol for match ref:{" "}
                <span className="font-mono text-emerald-400">
                  #{selectedMatch.match_id.slice(0, 8)}
                </span>
                .
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-5 py-4 bg-slate-900 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:text-white transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction_execute}
                className="flex-1 px-5 py-4 bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-400 transition-all"
              >
                {isProcessing ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
};

// --- Helpers ---

const StatPill = ({ label, value, color }) => (
  <div
    className={`px-6 py-4 bg-slate-900/40 border ${
      color === "amber"
        ? "border-amber-500/20"
        : color === "emerald"
        ? "border-emerald-500/20"
        : "border-slate-800"
    } rounded-2xl min-w-[140px]`}
  >
    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">
      {label}
    </p>
    <p
      className={`text-3xl font-black ${
        color === "amber"
          ? "text-amber-400"
          : color === "emerald"
          ? "text-emerald-400"
          : "text-white"
      }`}
    >
      {value}
    </p>
  </div>
);

const DataRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
    <span className="text-emerald-500">{icon}</span>
    <span className="uppercase text-[10px] text-slate-600 min-w-[40px]">
      {label}:
    </span>
    <span className="text-slate-300">{value}</span>
  </div>
);

const StatusBadge = ({ status, type }) => {
  const isMatch = type === "match";
  const colors = {
    PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    APPROVED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    REJECTED: "bg-red-500/10 text-red-400 border-red-500/20",
    OPEN: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    MATCHED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    RESOLVED: "bg-teal-500/10 text-teal-400 border-teal-500/20",
  };
  return (
    <span
      className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-md border ${
        colors[status] || "bg-slate-800 text-slate-400"
      }`}
    >
      {status}
    </span>
  );
};

const renderDetailSection = (
  matchId,
  section,
  details,
  isHidden,
  toggleDetails,
  expandedDetails
) => {
  if (!details) return null;
  const key = `${matchId}-${section}`;
  const isExpanded = expandedDetails[key];

  return (
    <div
      className={`rounded-xl border overflow-hidden ${
        isHidden
          ? "border-amber-500/30 bg-amber-500/5"
          : "border-slate-800 bg-slate-900/50"
      }`}
    >
      <button
        onClick={() => toggleDetails(matchId, section)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-800/50 transition-colors"
      >
        <span
          className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${
            isHidden ? "text-amber-400" : "text-slate-400"
          }`}
        >
          {isHidden && <Lock size={10} />} {section}
        </span>
        <ChevronDown
          size={14}
          className={`transition-transform ${
            isExpanded ? "rotate-180" : ""
          } text-slate-500`}
        />
      </button>
      {isExpanded && (
        <div className="px-4 py-3 border-t border-slate-800 text-[11px] font-medium text-slate-300">
          {typeof details === "object"
            ? Object.entries(details).map(([k, v]) => (
                <div key={k} className="mb-1">
                  <span className="text-slate-500 uppercase text-[9px] mr-2">
                    {k}:
                  </span>{" "}
                  {v}
                </div>
              ))
            : details}
        </div>
      )}
    </div>
  );
};

export default ManageMatchesPage;
