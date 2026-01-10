import React, { useEffect, useState } from "react";
import {
  X,
  AlertCircle,
  CheckCircle2,
  Clock,
  Image as ImageIcon,
  MapPin,
  Loader,
} from "lucide-react";
import { api } from "../lib/api";
import { toast } from "react-toastify";
import { useAuth } from "../context/auth.context";

const ClaimDetailsModal = ({ claimId, isOpen, onClose }) => {
  const { isAuthenticated, user } = useAuth();
  const [claim, setClaim] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && claimId && isAuthenticated && user?.role === "USER") {
      fetchClaim();
    }
  }, [isOpen, claimId, isAuthenticated, user]);

  const fetchClaim = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/user/claims/${claimId}`);
      setClaim(res.data.claim);
    } catch (error) {
      console.error("Failed to load claim", error);
      toast.error(error.response?.data?.message || "Failed to load claim");
      onClose?.();
    } finally {
      setIsLoading(false);
    }
  };

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

  const renderPublicDetails = (details) => {
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

  const renderUserProof = (proof) => {
    if (!proof) return null;

    if (typeof proof === "object" && !Array.isArray(proof)) {
      const entries = Object.entries(proof);
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

    return <p className="text-slate-300 mt-3 text-sm">{String(proof)}</p>;
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
              <h2 className="text-2xl font-bold text-white">Claim Details</h2>
              {claim && getStatusBadge(claim.status)}
            </div>
            <p className="text-sm text-slate-400 mt-1">
              {claim
                ? `Submitted ${formatDate(claim.created_at)}`
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
                <Loader size={48} className="text-emerald-400 animate-spin" />
                <span className="text-slate-300 text-lg font-semibold">
                  Loading...
                </span>
              </div>
            </div>
          ) : claim ? (
            <div className="p-8 space-y-6">
              {/* Match Score Badge */}
              {claim.match_percentage !== undefined && (
                <div className="px-4 py-3 bg-emerald-500/10 text-emerald-300 rounded-xl border border-emerald-500/20 font-semibold inline-flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  AI Match Score: {claim.match_percentage}%
                </div>
              )}

              {/* Main Content Grid */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Left Column: Item Info & Proof Images */}
                <div className="space-y-4">
                  {/* Found Item Information */}
                  <div className="bg-slate-950/40 border border-white/5 rounded-xl p-5">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <ImageIcon size={18} className="text-emerald-400" />
                      Found Item Info
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-4 pb-3 border-b border-white/5">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Item Type
                        </span>
                        <span className="text-sm font-semibold text-white text-right">
                          {claim.item_info?.type || "Unknown"}
                        </span>
                      </div>
                      <div className="flex items-start justify-between gap-4 pb-3 border-b border-white/5">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          <MapPin size={14} className="inline mr-1" />
                          Location
                        </span>
                        <span className="text-sm font-semibold text-white text-right">
                          {claim.item_info?.location || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-start justify-between gap-4 pb-3 border-b border-white/5">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          <Clock size={14} className="inline mr-1" />
                          Date Found
                        </span>
                        <span className="text-sm font-semibold text-white text-right">
                          {claim.item_info?.date
                            ? formatDate(claim.item_info.date)
                            : "N/A"}
                        </span>
                      </div>
                    </div>

                    {/* Public Details of Found Item */}
                    {claim.item_info?.public_details && (
                      <div className="mt-4 pt-4 border-t border-white/5">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                          Public Details
                        </p>
                        {renderPublicDetails(claim.item_info.public_details)}
                      </div>
                    )}
                  </div>

                  {/* User's Proof Images */}
                  {Array.isArray(claim.image_urls) &&
                    claim.image_urls.length > 0 && (
                      <div className="bg-slate-950/40 border border-white/5 rounded-xl p-5">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <ImageIcon size={18} className="text-amber-400" />
                          Your Proof Images
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {claim.image_urls.map((url, idx) => (
                            <img
                              key={idx}
                              src={url}
                              alt="Proof"
                              className="w-full h-32 object-cover rounded-lg border border-white/10 hover:border-amber-500/50 transition-all cursor-pointer"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                </div>

                {/* Right Column: User Proof & Item Photos */}
                <div className="space-y-4">
                  {/* User's Proof Details */}
                  {claim.claim_details?.user_proof && (
                    <div className="bg-slate-950/40 border border-white/5 rounded-xl p-5">
                      <h3 className="text-lg font-semibold text-white mb-4">
                        Your Proof Details
                      </h3>
                      {renderUserProof(claim.claim_details.user_proof)}
                    </div>
                  )}

                  {/* Found Item Photos */}
                  {Array.isArray(claim.item_info?.images) &&
                    claim.item_info.images.length > 0 && (
                      <div className="bg-slate-950/40 border border-white/5 rounded-xl p-5">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <ImageIcon size={18} className="text-teal-400" />
                          Found Item Photos
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                          {claim.item_info.images.map((url, idx) => (
                            <img
                              key={idx}
                              src={url}
                              alt="Found item"
                              className="w-full h-32 object-cover rounded-lg border border-white/10 hover:border-teal-500/50 transition-all cursor-pointer"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-28">
              <div className="text-center">
                <div className="w-20 h-20 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <AlertCircle size={48} className="text-red-400" />
                </div>
                <p className="text-slate-300 text-xl font-bold mb-2">
                  Failed to load claim
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

export default ClaimDetailsModal;
