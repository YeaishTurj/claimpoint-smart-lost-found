import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Eye,
  Loader,
  MapPin,
  Package,
  User,
  ChevronRight,
  ClipboardList,
  Search,
  Filter,
} from "lucide-react";
import { api } from "../lib/api";
import { toast } from "react-toastify";
import { useAuth } from "../context/auth.context";
import StaffLostReportDetailsModal from "../components/StaffLostReportDetailsModal";
import { PageShell } from "../components/layout";
import { AccessCard } from "../components/ui";

const ManageLostReportsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "STAFF") return;
    fetchReports();
  }, [isAuthenticated, user]);

  const fetchReports = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get("/staff/lost-reports");
      setReports(response.data.reports || []);
    } catch (err) {
      console.error("Failed to fetch lost reports:", err);
      setError(err.response?.data?.message || "Failed to load lost reports");
      toast.error("Database Error: Failed to retrieve lost property ledger", {
        theme: "dark",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredReports = reports.filter(
    (report) =>
      report.item_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.user_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated || user?.role !== "STAFF") {
    return (
      <PageShell variant="centered">
        <AccessCard
          icon={AlertCircle}
          title="Identity Verification Required"
          description="Access to the Lost Property Ledger is restricted to authorized personnel only."
        />
      </PageShell>
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
          Operations
        </button>
        <ChevronRight size={12} />
        <span className="text-slate-300">Lost Property Ledger</span>
      </div>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg mb-4">
            <ClipboardList size={14} className="text-emerald-400" />
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
              Incident Registry
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Lost <span className="text-emerald-400">Reports.</span>
          </h1>
          <p className="text-slate-400 font-medium max-w-xl">
            Monitor incoming loss reports. Use the intelligence data below to
            cross-reference with found items in the inventory.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <StatPill label="Total Logs" value={reports.length} color="slate" />
          <StatPill
            label="Unresolved"
            value={reports.filter((r) => r.status === "OPEN").length}
            color="amber"
          />
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-[#0b1120] rounded-[2rem] p-6 border border-slate-800 shadow-2xl mb-10 flex items-center gap-4">
        <div className="relative flex-1">
          <Search
            size={20}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            placeholder="Search by asset type, claimant name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-12 py-4 bg-[#010409] border border-slate-800 rounded-2xl text-white font-medium focus:border-emerald-500 transition-all placeholder:text-slate-600"
          />
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="py-24 flex flex-col items-center">
          <Loader className="animate-spin text-emerald-500 mb-4" size={40} />
          <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.2em]">
            Synchronizing Report Data...
          </p>
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="bg-[#0b1120] rounded-[2.5rem] p-20 border border-slate-800 text-center">
          <Package size={60} className="mx-auto text-slate-800 mb-6" />
          <h3 className="text-xl font-black text-white">No Incidents Found</h3>
          <p className="text-slate-500 text-sm mt-2">
            The registry is currently clear of matching loss reports.
          </p>
        </div>
      ) : (
        <div className="bg-[#0b1120] rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-800">
                  <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Asset Type
                  </th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Reported By
                  </th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Event Context
                  </th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredReports.map((report) => (
                  <tr
                    key={report.id}
                    className="hover:bg-slate-900/30 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center text-emerald-400">
                          <Package size={18} />
                        </div>
                        <p className="font-bold text-white text-base">
                          {report.item_type}
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-xs font-bold text-slate-300">
                        {report.user_name}
                      </p>
                      <p className="text-[10px] font-mono text-slate-600 uppercase tracking-tighter mt-1">
                        {report.user_email}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                          <MapPin size={12} className="text-emerald-500" />{" "}
                          {report.location_lost}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                          <Calendar size={12} className="text-emerald-500" />{" "}
                          {new Date(report.date_lost).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg border ${
                          report.status === "MATCHED"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : report.status === "RESOLVED"
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}
                      >
                        {report.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <button
                        onClick={() => {
                          setSelectedReportId(report.id);
                          setShowDetailsModal(true);
                        }}
                        className="p-2.5 bg-slate-900 border border-slate-700 text-slate-400 hover:text-emerald-400 hover:border-emerald-400 transition-all rounded-xl"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Status Breakdown Footer */}
          <div className="px-8 py-6 bg-slate-900/50 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Database sync complete. Total records:{" "}
              <span className="text-white">{reports.length}</span>
            </p>
            <div className="flex items-center gap-6">
              <StatusDot
                label="Open"
                count={reports.filter((r) => r.status === "OPEN").length}
                color="bg-amber-500"
              />
              <StatusDot
                label="Matched"
                count={reports.filter((r) => r.status === "MATCHED").length}
                color="bg-emerald-500"
              />
              <StatusDot
                label="Resolved"
                count={reports.filter((r) => r.status === "RESOLVED").length}
                color="bg-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      <StaffLostReportDetailsModal
        reportId={selectedReportId}
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedReportId(null);
        }}
      />
    </PageShell>
  );
};

// --- Helpers ---

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

const StatusDot = ({ label, count, color }) => (
  <div className="flex items-center gap-2">
    <div className={`w-1.5 h-1.5 rounded-full ${color}`}></div>
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
      {label} ({count})
    </span>
  </div>
);

export default ManageLostReportsPage;
