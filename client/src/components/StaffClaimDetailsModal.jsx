import React, { useEffect, useState } from "react";
import {
  X,
  AlertCircle,
  Package,
  MapPin,
  Calendar,
  User,
  FileText,
  CheckCircle2,
  ShieldCheck,
  Fingerprint,
  Camera,
  ExternalLink,
  Info,
} from "lucide-react";
import { api } from "../lib/api";
import { toast } from "react-toastify";

const StaffClaimDetailsModal = ({ claimId, isOpen, onClose }) => {
  const [claimData, setClaimData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && claimId) fetchClaimDetails();
  }, [isOpen, claimId]);

  const fetchClaimDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(`/staff/claims/${claimId}`);
      setClaimData(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load claim details");
      toast.error("Database Link Failure", { theme: "dark" });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-150 flex items-center justify-center pt-15">
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative w-full max-w-5xl max-h-[80vh] bg-[#0b1120] border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-10 py-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl font-black text-white tracking-tight">
                Claim <span className="text-emerald-400">Verification.</span>
              </h2>
              {claimData?.claim?.status && (
                <StatusBadge status={claimData.claim.status} />
              )}
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Reference:{" "}
              <span className="text-slate-300 font-mono">
                #{claimId?.slice(0, 12)}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-3 bg-slate-800 text-slate-400 hover:text-white rounded-2xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Decrypting Asset Data...
              </p>
            </div>
          ) : claimData ? (
            <div className="space-y-10">
              {/* Top Bar Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MiniStat
                  label="Match Probability"
                  value={`${claimData.claim.match_percentage}%`}
                  icon={<Fingerprint size={14} />}
                  color="emerald"
                />
                <MiniStat
                  label="Submission Date"
                  value={new Date(
                    claimData.claim.created_at
                  ).toLocaleDateString()}
                  icon={<Calendar size={14} />}
                />
                <MiniStat
                  label="Claimant Identity"
                  value={claimData.user?.name || "Anonymous"}
                  icon={<User size={14} />}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Left Side: Found Item Source of Truth */}
                <div className="space-y-6">
                  <SectionHeader
                    icon={Package}
                    title="Original Inventory Record"
                  />
                  <div className="bg-slate-900/40 border border-slate-800 rounded-[2rem] p-6 space-y-6">
                    <div>
                      <h4 className="text-2xl font-black text-white mb-2">
                        {claimData.found_item.item_type}
                      </h4>
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                          <MapPin size={14} className="text-emerald-500" />{" "}
                          {claimData.found_item.location_found}
                        </div>
                      </div>
                    </div>

                    <DetailGroup
                      title="Internal Hidden Details (Vault)"
                      isSecurity
                    >
                      {renderMetadata(claimData.found_item.hidden_details)}
                    </DetailGroup>

                    <PhotoGrid
                      title="Asset Reference Photos"
                      images={claimData.found_item.image_urls}
                    />
                  </div>
                </div>

                {/* Right Side: Claimant Evidence */}
                <div className="space-y-6">
                  <SectionHeader
                    icon={ShieldCheck}
                    title="Claimant Submission"
                  />
                  <div className="bg-emerald-500/[0.02] border border-emerald-500/10 rounded-[2rem] p-6 space-y-6">
                    <div className="space-y-4">
                      <DetailGroup title="User Provided Proof">
                        {renderMetadata(
                          claimData.claim.claim_details?.user_proof
                        )}
                      </DetailGroup>

                      <DetailGroup title="Contact Dossier">
                        <div className="grid grid-cols-1 gap-2 text-xs font-bold">
                          <div className="flex justify-between py-2 border-b border-slate-800/50">
                            <span className="text-slate-500">EMAIL</span>
                            <span className="text-white font-mono">
                              {claimData.user.email}
                            </span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-slate-800/50">
                            <span className="text-slate-500">PHONE</span>
                            <span className="text-white">
                              {claimData.user.phone || "UNAVAILABLE"}
                            </span>
                          </div>
                        </div>
                      </DetailGroup>
                    </div>

                    <PhotoGrid
                      title="User Evidence Photos"
                      images={claimData.claim.image_urls}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center">
              <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
              <p className="text-white font-black uppercase tracking-widest text-xs">
                Error loading claim intelligence.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-10 py-6 border-t border-slate-800 bg-slate-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-slate-800 text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-700 transition-all"
          >
            Dismiss Details
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Sub-Components ---

const StatusBadge = ({ status }) => {
  const colors = {
    PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    APPROVED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    REJECTED: "bg-red-500/10 text-red-400 border-red-500/20",
    COLLECTED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  };
  return (
    <span
      className={`px-3 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest ${colors[status]}`}
    >
      {status}
    </span>
  );
};

const MiniStat = ({ label, value, icon, color }) => (
  <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex items-center gap-4">
    <div
      className={`p-2 rounded-lg ${
        color === "emerald"
          ? "bg-emerald-500/10 text-emerald-400"
          : "bg-slate-800 text-slate-400"
      }`}
    >
      {icon}
    </div>
    <div>
      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
        {label}
      </p>
      <p className="text-sm font-bold text-white leading-none mt-0.5">
        {value}
      </p>
    </div>
  </div>
);

const SectionHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
      <Icon size={16} />
    </div>
    <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">
      {title}
    </h3>
  </div>
);

const DetailGroup = ({ title, children, isSecurity }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      <span
        className={`text-[10px] font-black uppercase tracking-widest ${
          isSecurity ? "text-amber-500" : "text-slate-500"
        }`}
      >
        {title}
      </span>
      {isSecurity && <ShieldCheck size={12} className="text-amber-500" />}
    </div>
    <div className="space-y-1">{children}</div>
  </div>
);

const PhotoGrid = ({ title, images }) => {
  if (!images || images.length === 0) return null;
  return (
    <div className="space-y-3">
      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
        {title}
      </span>
      <div className="grid grid-cols-3 gap-2">
        {images.map((url, i) => (
          <div
            key={i}
            className="aspect-square rounded-xl bg-slate-900 border border-slate-800 overflow-hidden group relative"
          >
            <img
              src={url}
              alt=""
              className="w-full h-full object-cover group-hover:scale-110 transition-transform"
            />
            <div className="absolute inset-0 bg-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera size={16} className="text-white" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const renderMetadata = (data) => {
  if (!data)
    return (
      <p className="text-xs text-slate-600 italic">
        No supplemental data provided.
      </p>
    );
  if (typeof data === "string")
    return (
      <p className="text-xs font-bold text-slate-300 leading-relaxed">{data}</p>
    );

  return Object.entries(data).map(([key, value]) => (
    <div key={key} className="flex flex-col mb-2">
      <span className="text-[9px] font-black text-slate-600 uppercase tracking-tighter">
        {key}
      </span>
      <span className="text-xs font-bold text-slate-300">{String(value)}</span>
    </div>
  ));
};

export default StaffClaimDetailsModal;
