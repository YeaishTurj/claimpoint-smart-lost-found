import React, { useEffect, useState } from "react";
import {
  X,
  AlertCircle,
  MapPin,
  Calendar,
  User,
  FileText,
  CheckCircle2,
  Package,
  Camera,
  ClipboardList,
  Fingerprint,
} from "lucide-react";
import { api } from "../lib/api";
import { toast } from "react-toastify";

const StaffLostReportDetailsModal = ({ reportId, isOpen, onClose }) => {
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && reportId) fetchReportDetails();
  }, [isOpen, reportId]);

  const fetchReportDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(`/staff/lost-reports/${reportId}`);
      setReportData(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load report details");
      toast.error("Registry Link Failure", { theme: "dark" });
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
                Report <span className="text-emerald-400">Analysis.</span>
              </h2>
              {reportData?.report?.status && (
                <StatusBadge status={reportData.report.status} />
              )}
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Report ID:{" "}
              <span className="text-slate-300 font-mono">
                #{reportId?.slice(0, 12)}
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
                Retrieving Loss Data...
              </p>
            </div>
          ) : reportData ? (
            <div className="space-y-8">
              {/* Primary Incident Asset Card */}
              <div className="bg-slate-900/40 border border-slate-800 rounded-[2rem] p-8">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">
                        Reported Asset
                      </p>
                      <h3 className="text-4xl font-black text-white leading-tight">
                        {reportData.report.item_type}
                      </h3>
                    </div>
                    <div className="flex flex-col gap-3">
                      <DataRow
                        icon={<MapPin size={14} />}
                        label="Loss Site"
                        value={reportData.report.location_lost}
                      />
                      <DataRow
                        icon={<Calendar size={14} />}
                        label="Event Time"
                        value={new Date(
                          reportData.report.date_lost
                        ).toLocaleDateString()}
                      />
                    </div>
                  </div>
                  <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-5 min-w-[200px] self-start">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">
                      Internal Meta
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[11px] font-bold uppercase">
                        <span className="text-slate-600">Created</span>
                        <span className="text-slate-300">
                          {new Date(
                            reportData.report.created_at
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px] font-bold uppercase">
                        <span className="text-slate-600">Sync Status</span>
                        <span className="text-emerald-500">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Reporter Dossier */}
                <div className="space-y-4">
                  <SectionHeader icon={User} title="Claimant Identity" />
                  <div className="bg-slate-900/40 border border-slate-800 rounded-[2rem] p-6 space-y-4">
                    <DossierRow
                      label="Full Name"
                      value={reportData.user.name || "N/A"}
                    />
                    <DossierRow
                      label="Email Access"
                      value={reportData.user.email}
                      isMono
                    />
                    <DossierRow
                      label="Contact Phone"
                      value={reportData.user.phone || "Not provided"}
                    />
                  </div>
                </div>

                {/* Technical Specifications */}
                <div className="space-y-4">
                  <SectionHeader
                    icon={ClipboardList}
                    title="Loss Specifications"
                  />
                  <div className="bg-slate-900/40 border border-slate-800 rounded-[2rem] p-6">
                    {reportData.report.report_details ? (
                      renderMetadata(reportData.report.report_details)
                    ) : (
                      <p className="text-xs text-slate-600 italic uppercase font-black">
                        No supplemental specs provided.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Evidence Photos */}
              {reportData.report.image_urls?.length > 0 && (
                <div className="space-y-4">
                  <SectionHeader icon={Camera} title="Evidence Documentation" />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {reportData.report.image_urls.map((url, i) => (
                      <div
                        key={i}
                        className="aspect-square rounded-[1.5rem] bg-slate-900 border border-slate-800 overflow-hidden group"
                      >
                        <img
                          src={url}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?q=80&w=400&auto=format&fit=crop";
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : error ? (
            <div className="py-20 text-center">
              <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
              <p className="text-white font-black uppercase tracking-widest text-xs">
                Analysis Link Failed.
              </p>
            </div>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="px-10 py-6 border-t border-slate-800 bg-slate-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-slate-800 text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-700 transition-all"
          >
            Close Analysis
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Helpers ---

const StatusBadge = ({ status }) => {
  const colors = {
    OPEN: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    MATCHED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    RESOLVED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  };
  return (
    <span
      className={`px-3 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest ${colors[status]}`}
    >
      {status}
    </span>
  );
};

const SectionHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-3 px-2">
    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
      <Icon size={16} />
    </div>
    <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">
      {title}
    </h3>
  </div>
);

const DataRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
    <span className="text-emerald-500">{icon}</span>
    <span className="uppercase text-[10px] text-slate-600 min-w-[60px]">
      {label}:
    </span>
    <span className="text-slate-200">{value}</span>
  </div>
);

const DossierRow = ({ label, value, isMono }) => (
  <div className="flex flex-col py-1">
    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">
      {label}
    </span>
    <span
      className={`text-sm font-bold text-white ${
        isMono ? "font-mono tracking-tight" : ""
      }`}
    >
      {value}
    </span>
  </div>
);

const renderMetadata = (data) => {
  if (typeof data === "string")
    return (
      <p className="text-sm font-bold text-slate-300 leading-relaxed">{data}</p>
    );
  return Object.entries(data).map(([key, value]) => (
    <div key={key} className="flex flex-col mb-4 last:mb-0">
      <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">
        {key}
      </span>
      <span className="text-sm font-bold text-slate-300">{String(value)}</span>
    </div>
  ));
};

export default StaffLostReportDetailsModal;
