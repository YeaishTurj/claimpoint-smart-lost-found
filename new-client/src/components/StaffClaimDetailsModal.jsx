import React, { useEffect, useState } from "react";
import {
  X,
  AlertCircle,
  Package,
  MapPin,
  Calendar,
  User,
  Mail,
  Phone,
  FileText,
  CheckCircle2,
  Image as ImageIcon,
} from "lucide-react";
import { api } from "../lib/api";
import { toast } from "react-toastify";

const StaffClaimDetailsModal = ({ claimId, isOpen, onClose }) => {
  const [claimData, setClaimData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchClaimDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(`/staff/claims/${claimId}`);
      setClaimData(response.data.data);
    } catch (err) {
      console.error("Failed to fetch claim details:", err);
      setError(err.response?.data?.message || "Failed to load claim details");
      toast.error("Failed to load claim details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen || !claimId) return;
    fetchClaimDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, claimId]);

  if (!isOpen) return null;

  const getStatusBadge = (status) => {
    const statusConfig = {
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
        bg: "bg-red-500/10",
        text: "text-red-400",
        label: "Rejected",
      },
      COLLECTED: {
        bg: "bg-blue-500/10",
        text: "text-blue-400",
        label: "Collected",
      },
    };
    const config = statusConfig[status] || statusConfig.PENDING;
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

  const renderDetails = (details) => {
    if (!details) return null;
    if (typeof details === "string")
      return (
        <p className="text-slate-300 mt-3 text-sm leading-relaxed">{details}</p>
      );
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
                {typeof value === "object"
                  ? JSON.stringify(value)
                  : String(value)}
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
              <h2 className="text-2xl font-bold text-white">Claim Details</h2>
              {claimData?.claim?.status &&
                getStatusBadge(claimData.claim.status)}
            </div>
            <p className="text-sm text-slate-400 mt-1">
              {claimData?.claim?.created_at
                ? `Submitted ${formatDate(claimData.claim.created_at)}`
                : "Loading claim details"}
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
                <div className="w-12 h-12 border-4 border-slate-700 border-t-emerald-400 rounded-full animate-spin" />
                <span className="text-slate-300 text-lg font-semibold">
                  Loading...
                </span>
              </div>
            </div>
          ) : claimData?.claim ? (
            <div className="p-8 space-y-6">
              {/* Claim Overview Card */}
              <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8 shadow-xl space-y-6">
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-wider">
                    <Package size={18} className="text-emerald-400" />
                    Claim Information
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Claim ID
                    </p>
                    <p className="text-sm font-mono text-slate-300 break-all">
                      {claimData.claim.id}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Match Percentage
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-700/50 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all"
                          style={{
                            width: `${claimData.claim.match_percentage}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-emerald-400">
                        {claimData.claim.match_percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Date Submitted
                    </p>
                    <p className="text-sm text-slate-300 flex items-center gap-2">
                      <Calendar size={14} className="text-slate-500" />
                      {formatDate(claimData.claim.created_at)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Found Item Details */}
              {claimData.found_item && (
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8 shadow-xl space-y-6">
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-wider">
                      <Package size={18} className="text-emerald-400" />
                      Found Item Details
                    </label>
                    <p className="text-3xl font-bold text-white">
                      {claimData.found_item.item_type}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-700/50">
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-wider">
                        <MapPin size={18} className="text-emerald-400" />
                        Location Found
                      </label>
                      <p className="text-lg font-semibold text-white">
                        {claimData.found_item.location_found}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-wider">
                        <Calendar size={18} className="text-emerald-400" />
                        Date Found
                      </label>
                      <p className="text-lg font-semibold text-white">
                        {formatDate(claimData.found_item.date_found)}
                      </p>
                    </div>
                  </div>

                  {/* Public Details */}
                  {claimData.found_item.public_details &&
                    Object.keys(claimData.found_item.public_details).length >
                      0 && (
                      <div className="pt-4 border-t border-slate-700/50">
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
                          Public Details
                        </h4>
                        {renderDetails(claimData.found_item.public_details)}
                      </div>
                    )}

                  {/* Hidden Details */}
                  {claimData.found_item.hidden_details &&
                    Object.keys(claimData.found_item.hidden_details).length >
                      0 && (
                      <div className="pt-4 border-t border-slate-700/50">
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
                          Hidden Details (For Verification)
                        </h4>
                        {renderDetails(claimData.found_item.hidden_details)}
                      </div>
                    )}
                </div>
              )}

              {/* Claimant Info */}
              {claimData.user && (
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                      <User size={20} className="text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                      Claimant Information
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1 min-w-fit">
                        Name:
                      </p>
                      <p className="text-white font-medium">
                        {claimData.user.name || "Not provided"}
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1 min-w-fit">
                        Email:
                      </p>
                      <p className="text-white font-medium break-all">
                        {claimData.user.email || "Not provided"}
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1 min-w-fit">
                        Phone:
                      </p>
                      <p className="text-white font-medium">
                        {claimData.user.phone || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Claim Details (User Proof) */}
              {claimData.claim.claim_details &&
                Object.keys(claimData.claim.claim_details).length > 0 && (
                  <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-emerald-500/10 rounded-lg">
                        <FileText size={20} className="text-emerald-400" />
                      </div>
                      <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                        Claim Details
                      </h3>
                    </div>

                    {claimData.claim.claim_details.user_proof && (
                      <div className="mb-4">
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
                          User Proof
                        </h4>
                        {renderDetails(
                          claimData.claim.claim_details.user_proof
                        )}
                      </div>
                    )}

                    {claimData.claim.claim_details.item_snapshot && (
                      <div className="pt-4 border-t border-slate-700/50">
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
                          Item Snapshot (At Time of Claim)
                        </h4>
                        {renderDetails(
                          claimData.claim.claim_details.item_snapshot
                        )}
                      </div>
                    )}
                  </div>
                )}

              {/* Evidence Images */}
              {Array.isArray(claimData.claim.image_urls) &&
                claimData.claim.image_urls.length > 0 && (
                  <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8 shadow-xl">
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6">
                      Claim Evidence Photos
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {claimData.claim.image_urls.map((url, index) => (
                        <div
                          key={index}
                          className="aspect-square rounded-xl overflow-hidden border-2 border-slate-700/50 hover:border-emerald-500/50 transition-all shadow-lg group"
                        >
                          <img
                            src={url}
                            alt={`Claim Evidence ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              e.target.src =
                                "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=400&fit=crop";
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Found Item Images */}
              {Array.isArray(claimData.found_item?.image_urls) &&
                claimData.found_item.image_urls.length > 0 && (
                  <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8 shadow-xl">
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6">
                      Found Item Photos
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {claimData.found_item.image_urls.map((url, index) => (
                        <div
                          key={index}
                          className="aspect-square rounded-xl overflow-hidden border-2 border-slate-700/50 hover:border-emerald-500/50 transition-all shadow-lg group"
                        >
                          <img
                            src={url}
                            alt={`Found Item ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              e.target.src =
                                "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=400&fit=crop";
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-28">
              <div className="text-center">
                <div className="w-20 h-20 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <AlertCircle size={48} className="text-red-400" />
                </div>
                <p className="text-slate-300 text-xl font-bold mb-2">
                  Failed to load claim
                </p>
                <p className="text-slate-500 text-sm">{error}</p>
              </div>
            </div>
          ) : null}
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

export default StaffClaimDetailsModal;
