import React, { useEffect, useState } from "react";
import {
  X,
  AlertCircle,
  CheckCircle2,
  Clock,
  Package,
  MapPin,
  Loader,
  Calendar,
} from "lucide-react";
import { api } from "../lib/api";
import { toast } from "react-toastify";
import { useAuth } from "../context/auth.context";

const LostReportDetailsModal = ({ reportId, isOpen, onClose }) => {
  const { isAuthenticated, user } = useAuth();
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && reportId && isAuthenticated && user?.role === "USER") {
      fetchReport();
    }
  }, [isOpen, reportId, isAuthenticated, user]);

  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/user/lost-reports/${reportId}`);
      setReport(res.data.lostReport);
    } catch (error) {
      console.error("Failed to load report", error);
      toast.error(error.response?.data?.message || "Failed to load report");
      onClose?.();
    } finally {
      setIsLoading(false);
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

  const formatDate = (value) => {
    if (!value) return "N/A";
    const date = new Date(value);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderReportDetails = (details) => {
    if (!details) return null;

    if (typeof details === "string") {
      return (
        <p className="text-slate-300 mt-3 text-sm leading-relaxed">{details}</p>
      );
    }

    if (Array.isArray(details)) {
      if (details.length === 0) return null;
      return (
        <ul className="text-slate-300 mt-3 text-sm leading-relaxed list-disc list-inside space-y-1">
          {details.map((item, idx) => (
            <li key={idx}>{String(item)}</li>
          ))}
        </ul>
      );
    }

    if (typeof details === "object") {
      const entries = Object.entries(details);
      if (entries.length === 0) return null;
      return (
        <div className="mt-3 space-y-2">
          {entries.map(([key, value]) => (
            <div
              key={key}
              className="flex items-start justify-between gap-4 border border-white/5 rounded-lg px-3 py-2 bg-slate-950/50"
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {key}
              </span>
              <span className="text-sm text-slate-200 break-words text-right">
                {String(value)}
              </span>
            </div>
          ))}
        </div>
      );
    }

    return (
      <p className="text-slate-300 mt-3 text-sm leading-relaxed">
        {String(details)}
      </p>
    );
  };

  if (!isOpen) return null;

  if (!isAuthenticated || user?.role !== "USER") {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900/95 to-slate-900/80 backdrop-blur-xl border-b border-slate-800/50 px-8 py-5 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-white">
                Lost Report Details
              </h2>
              {report && getStatusBadge(report.status)}
            </div>
            <p className="text-sm text-slate-400 mt-1">
              {report
                ? `Reported ${formatDate(report.created_at)}`
                : "Loading report details"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 hover:bg-slate-800/50 rounded-xl transition-all text-slate-400 hover:text-white active:scale-95"
            aria-label="Close"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto max-h-[calc(90vh-160px)] bg-gradient-to-br from-slate-950/50 via-slate-900/30 to-slate-950/50">
          {isLoading ? (
            <div className="flex items-center justify-center py-28">
              <div className="flex flex-col items-center gap-4">
                <Loader size={48} className="text-emerald-400 animate-spin" />
                <span className="text-slate-300 text-lg font-semibold">
                  Loading...
                </span>
              </div>
            </div>
          ) : report ? (
            <div className="p-8 space-y-6">
              {/* Main Info Card */}
              <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8 shadow-xl space-y-6">
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-wider">
                    <Package size={18} className="text-emerald-400" />
                    Item Type
                  </label>
                  <p className="text-3xl font-bold text-white">
                    {report.item_type}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-700/50">
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-wider">
                      <MapPin size={18} className="text-emerald-400" />
                      Location Lost
                    </label>
                    <p className="text-lg font-semibold text-white">
                      {report.location_lost}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-wider">
                      <Calendar size={18} className="text-emerald-400" />
                      Date Lost
                    </label>
                    <p className="text-lg font-semibold text-white">
                      {formatDate(report.date_lost)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Report Details */}
              {report.report_details &&
                Object.keys(report.report_details).length > 0 && (
                  <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-emerald-500/10 rounded-lg">
                        <Package size={20} className="text-emerald-400" />
                      </div>
                      <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                        Item Details
                      </h3>
                    </div>
                    {renderReportDetails(report.report_details)}
                  </div>
                )}

              {/* Images */}
              {Array.isArray(report.image_urls) &&
                report.image_urls.length > 0 && (
                  <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8 shadow-xl">
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6">
                      Evidence Photos
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {report.image_urls.map((url, index) => (
                        <div
                          key={index}
                          className="aspect-square rounded-xl overflow-hidden border-2 border-slate-700/50 hover:border-emerald-500/50 transition-all shadow-lg group"
                        >
                          <img
                            src={url}
                            alt={`Evidence ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          ) : (
            <div className="flex items-center justify-center py-28">
              <div className="text-center">
                <div className="w-20 h-20 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <AlertCircle size={48} className="text-red-400" />
                </div>
                <p className="text-slate-300 text-xl font-bold mb-2">
                  Failed to load report
                </p>
                <p className="text-slate-500 text-sm">Please try again later</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-slate-900/95 to-slate-900/80 backdrop-blur-xl border-t border-slate-800/50 px-8 py-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-2 border-2 border-slate-700/50 text-slate-300 font-bold rounded-xl hover:bg-slate-800/50 hover:border-slate-600 transition-all active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LostReportDetailsModal;
