import { useState, useEffect } from "react";
import api from "../../services/api";
import { Trash2 } from "lucide-react";
import { UpdateLostItemForm } from "../../components/user.components/UpdateLostItemForm";

export function MyReportsPage({ authToken }) {
  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [loadingEdit, setLoadingEdit] = useState(false);

  // Fetch latest report details before editing (like claims page)
  const handleEditReport = async (report) => {
    setLoadingEdit(true);
    setShowEditModal(true);
    try {
      const data = await api.getUserLostReportDetails(authToken, report.id);
      setEditingReport(data.lostReport || report);
    } catch (err) {
      setEditingReport(report); // fallback
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleEditSuccess = (updatedReport) => {
    setReports((prev) =>
      prev.map((r) => (r.id === updatedReport.id ? updatedReport : r))
    );
    setShowEditModal(false);
    setEditingReport(null);
  };

  const handleEditClose = () => {
    setShowEditModal(false);
    setEditingReport(null);
  };

  const handleShowDetails = (report) => {
    setSelectedReport(report);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedReport(null);
  };

  const handleDeleteReport = async (reportId) => {
    if (!authToken) return;
    const confirmed = window.confirm(
      "Are you sure you want to delete this report? This action cannot be undone."
    );
    if (!confirmed) return;
    setDeletingId(reportId);
    try {
      await api.deleteUserLostReport(authToken, reportId);
      setReports((prev) => prev.filter((r) => r.id !== reportId));
    } catch (error) {
      alert("Failed to delete report. Please try again.");
      console.error("Error deleting report:", error);
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    if (!authToken) return;
    setLoadingReports(true);
    api
      .getUserLostReports(authToken)
      .then((data) => setReports(data.lostReports || []))
      .catch((error) => {
        console.error("Error fetching reports:", error);
      })
      .finally(() => setLoadingReports(false));
  }, [authToken]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 py-10">
      <div className="bg-slate-900 rounded-xl border border-white/10 w-full max-w-4xl mx-auto shadow-2xl shadow-black/50 relative mt-8 mb-12 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-2 p-8 border-b border-white/10 bg-gradient-to-r from-orange-900/40 to-slate-900/80 rounded-t-xl">
          <svg
            className="text-orange-400"
            width={28}
            height={28}
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 17v2m-7-2a7 7 0 1 1 14 0v2a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-2Z"
            />
          </svg>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-orange-300">
              Reports Dashboard
            </p>
            <h2 className="text-3xl font-bold text-white drop-shadow">
              My Lost Reports
            </h2>
          </div>
        </div>

        <div className="flex-1 px-8 py-8">
          {loadingReports ? (
            <div className="text-center text-orange-400 py-20 text-lg animate-pulse">
              Loading reports...
            </div>
          ) : reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <svg
                width="60"
                height="60"
                fill="none"
                viewBox="0 0 24 24"
                className="mb-4 text-slate-700"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M9 10h.01M15 10h.01M8 15c1.333-1 4.667-1 6 0"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <div className="text-gray-400 text-lg font-medium">
                No lost reports found.
              </div>
              <div className="text-xs text-slate-500 mt-2">
                You haven't reported any lost items yet.
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-7">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="bg-slate-800 p-7 rounded-xl shadow border border-slate-700 flex items-center gap-7 hover:shadow-2xl hover:border-orange-400/60 transition-all duration-200 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition bg-orange-400 pointer-events-none rounded-xl" />
                  {report.image_urls && report.image_urls[0] && (
                    <img
                      src={report.image_urls[0]}
                      alt={report.item_type}
                      className="w-24 h-24 object-cover rounded-lg border border-slate-700 shadow-lg"
                    />
                  )}
                  <div className="flex-1">
                    <div className="font-semibold text-xl text-white mb-1 drop-shadow">
                      {report.item_type}
                    </div>
                    <span className="text-xs px-2 py-1 rounded bg-orange-700/30 text-orange-300 border border-orange-500/40">
                      {report.status}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <div className="flex gap-2">
                      <button
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-600 to-orange-400 text-white font-semibold border border-orange-500/40 hover:from-orange-700 hover:to-orange-500 transition shadow mb-1"
                        onClick={() => handleShowDetails(report)}
                      >
                        View Details
                      </button>
                      <button
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold border border-blue-500/40 hover:from-blue-700 hover:to-blue-500 transition shadow mb-1"
                        onClick={() => handleEditReport(report)}
                      >
                        Edit
                      </button>
                    </div>
                    <button
                      className={`flex items-center gap-1 px-3 py-1 rounded-lg bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold border border-red-500/40 hover:from-red-700 hover:to-orange-600 transition shadow text-xs ${
                        deletingId === report.id
                          ? "opacity-60 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={() => handleDeleteReport(report.id)}
                      disabled={deletingId === report.id}
                      title="Delete Report"
                    >
                      <Trash2 size={16} />
                      {deletingId === report.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>

                  {showEditModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                      <div className="w-full max-w-2xl mx-auto animate-fade-in">
                        {loadingEdit || !editingReport ? (
                          <div className="bg-slate-900 rounded-xl shadow-xl p-8 text-center text-orange-400 text-lg animate-pulse">
                            Loading report details...
                          </div>
                        ) : (
                          <UpdateLostItemForm
                            authToken={authToken}
                            report={editingReport}
                            onSuccess={handleEditSuccess}
                            onClose={handleEditClose}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Report Details Modal */}
        {showDetailsModal && selectedReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-slate-900 rounded-2xl shadow-2xl p-8 max-w-2xl w-full relative border border-orange-500/30 animate-fade-in">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl"
                onClick={handleCloseDetailsModal}
                aria-label="Close"
              >
                &times;
              </button>
              <h3 className="text-2xl font-bold mb-6 text-orange-300 drop-shadow">
                Lost Report Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <span className="block text-sm font-semibold text-slate-400 mb-1">
                      Status
                    </span>
                    <span className="text-lg text-orange-300 font-medium">
                      {selectedReport.status}
                    </span>
                  </div>
                  <div>
                    <span className="block text-sm font-semibold text-slate-400 mb-1">
                      Date Lost
                    </span>
                    <span className="text-lg text-orange-300 font-medium">
                      {new Date(selectedReport.date_lost).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="block text-sm font-semibold text-slate-400 mb-1">
                      Location Lost
                    </span>
                    <span className="text-lg text-orange-300 font-medium">
                      {selectedReport.location_lost}
                    </span>
                  </div>
                  <div>
                    <span className="block text-sm font-semibold text-slate-400 mb-3">
                      Report Details
                    </span>
                    <div className="text-base leading-relaxed">
                      {typeof selectedReport.report_details === "object" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                          {Object.entries(selectedReport.report_details).map(
                            ([key, value]) => (
                              <div key={key} className="flex flex-col mb-2">
                                <span className="font-semibold text-slate-400 capitalize text-xs">
                                  {key.replace(/_/g, " ")}
                                </span>
                                <span className="text-slate-100 text-sm break-words">
                                  {String(value)}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        String(selectedReport.report_details)
                      )}
                    </div>
                  </div>
                </div>
                {selectedReport.image_urls &&
                  selectedReport.image_urls.length > 0 && (
                    <div className="flex flex-wrap gap-3 items-start justify-center">
                      {selectedReport.image_urls.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Report Image ${idx + 1}`}
                          className="w-32 h-32 object-cover rounded-lg border-2 border-orange-500/30 shadow-lg hover:scale-105 transition"
                        />
                      ))}
                    </div>
                  )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
