import { useState, useEffect } from "react";
import { X, Loader, AlertCircle } from "lucide-react";
import api from "../services/api";

export function ItemDetailsCard({ itemId, type = "found", authToken, onClose }) {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        let data;
        if (type === "lost") {
          data = await api.getLostReportById(itemId, authToken);
        } else {
          data = await api.getFoundItemById(itemId, authToken);
        }
        setItem(data);
      } catch (err) {
        setError(err.message || "Failed to load details");
        console.error("Error fetching item details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [itemId, type, authToken]);

  const renderDetails = (detailsObj) => {
    if (!detailsObj || typeof detailsObj !== "object") return null;
    return Object.entries(detailsObj).map(([key, value]) => (
      <div key={key} className="flex justify-between items-start">
        <span className="text-gray-400 capitalize">{key.replace(/_/g, " ")}:</span>
        <span className="text-white font-medium text-right ml-2">{value}</span>
      </div>
    ));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-slate-900 rounded-xl border border-white/10 w-full max-w-2xl shadow-2xl shadow-black/50 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition z-10 bg-slate-800 rounded-full p-1"
        >
          <X size={20} />
        </button>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="animate-spin text-blue-400" size={32} />
          </div>
        ) : error ? (
          <div className="p-6">
            <div className="flex items-center gap-3 text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          </div>
        ) : item ? (
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="border-b border-white/10 pb-4">
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-2xl font-bold text-white capitalize">
                  {item.item_type}
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    item.status === "open"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : item.status === "found" || item.status === "matched"
                      ? "bg-green-500/20 text-green-400"
                      : item.status === "closed"
                      ? "bg-gray-500/20 text-gray-400"
                      : "bg-blue-500/20 text-blue-400"
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <p className="text-gray-400 text-sm">
                {type === "lost" ? "Lost Report" : "Found Item"}
              </p>
            </div>

            {/* Location and Date Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/5 rounded-lg p-4">
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase mb-1">
                  {type === "lost" ? "Location Lost" : "Location Found"}
                </p>
                <p className="text-white font-medium">{item.location_lost || item.location_found}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase mb-1">
                  {type === "lost" ? "Date Lost" : "Date Found"}
                </p>
                <p className="text-white font-medium">
                  {new Date(item.date_lost || item.date_found).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Details Section */}
            {(item.report_details || item.public_details) && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">
                  {type === "lost" ? "Report Details" : "Item Details"}
                </h3>
                <div className="bg-white/5 rounded-lg p-4 space-y-2">
                  {renderDetails(item.report_details || item.public_details)}
                </div>
              </div>
            )}

            {/* Images */}
            {item.image_urls && item.image_urls.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {item.image_urls.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`${item.item_type} ${idx + 1}`}
                      className="w-full h-40 object-cover rounded-lg border border-white/10 hover:border-white/30 transition"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="bg-white/5 rounded-lg p-4 text-sm text-gray-400 space-y-2">
              <div className="flex justify-between">
                <span>Report ID:</span>
                <span className="text-gray-300 font-mono">{item.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Reported:</span>
                <span className="text-gray-300">
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
              </div>
              {item.updated_at && (
                <div className="flex justify-between">
                  <span>Last Updated:</span>
                  <span className="text-gray-300">
                    {new Date(item.updated_at).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-full px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium transition"
            >
              Close
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
