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
} from "lucide-react";
import { api } from "../lib/api";
import { toast } from "react-toastify";
import { useAuth } from "../context/auth.context";
import StaffLostReportDetailsModal from "../components/StaffLostReportDetailsModal";

const ManageLostReportsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);

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
      toast.error("Failed to load lost reports");
    } finally {
      setIsLoading(false);
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
            You must be logged in as staff to manage lost reports.
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
          <p className="text-sm">Loading lost reports...</p>
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
                Manage Lost Reports
              </h1>
              <p className="text-slate-400 mt-1">
                Review all lost item reports submitted by users
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

        {reports.length === 0 ? (
          <div className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-12 text-center">
            <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package size={32} className="text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-300 mb-2">
              No Lost Reports Yet
            </h3>
            <p className="text-slate-400 text-sm">
              All lost item reports will appear here once users submit them.
            </p>
          </div>
        ) : (
          <div className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-white/10 bg-white/5">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Lost Reports Table
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
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Location Lost
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Date Lost
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Reported On
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr
                      key={report.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center shrink-0">
                            <Package size={18} className="text-emerald-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">
                              {report.item_type}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-slate-500" />
                          <div>
                            <p className="text-sm text-white font-medium">
                              {report.user_name}
                            </p>
                            <p className="text-xs text-slate-400">
                              {report.user_email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <MapPin
                            size={14}
                            className="text-slate-500 shrink-0"
                          />
                          <span>{report.location_lost}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <Calendar
                            size={14}
                            className="text-slate-500 shrink-0"
                          />
                          <span>
                            {new Date(report.date_lost).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                            report.status === "MATCHED"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                              : report.status === "RESOLVED"
                              ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                          }`}
                        >
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {new Date(report.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            setSelectedReportId(report.id);
                            setShowDetailsModal(true);
                          }}
                          className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all"
                          title="View report details"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="px-6 py-4 border-t border-white/10 bg-white/5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-400">
                  Total reports:{" "}
                  <span className="font-semibold">{reports.length}</span>
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span>
                      Open ({reports.filter((r) => r.status === "OPEN").length})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span>
                      Matched (
                      {reports.filter((r) => r.status === "MATCHED").length})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>
                      Resolved (
                      {reports.filter((r) => r.status === "RESOLVED").length})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Staff Lost Report Details Modal */}
      <StaffLostReportDetailsModal
        reportId={selectedReportId}
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedReportId(null);
        }}
      />
    </div>
  );
};

export default ManageLostReportsPage;
