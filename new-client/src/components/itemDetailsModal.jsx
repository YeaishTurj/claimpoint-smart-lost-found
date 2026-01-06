import React, { useEffect, useState } from "react";
import {
  X,
  Package,
  MapPin,
  Calendar,
  Eye,
  EyeOff,
  Loader,
  AlertCircle,
  CheckCircle2,
  Shield,
} from "lucide-react";
import { api } from "../lib/api";
import { toast } from "react-toastify";
import { useAuth } from "../context/auth.context";

const ItemDetailsModal = ({ itemId, isOpen, onClose }) => {
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const isPrivileged = user?.role === "STAFF" || user?.role === "ADMIN";

  useEffect(() => {
    if (isOpen && itemId) {
      fetchItemDetails();
    }
  }, [itemId, isOpen]);

  const fetchItemDetails = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/items/found-items/${itemId}`);
      setItem(response.data.data);
    } catch (error) {
      console.error("Failed to fetch item details:", error);
      toast.error(
        error.response?.data?.message || "Failed to load item details",
        {
          position: "top-center",
          autoClose: 2000,
        }
      );
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900/95 to-slate-900/80 backdrop-blur-xl border-b border-slate-800/50 px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Package size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Item Details</h2>
                <p className="text-sm text-slate-400 mt-0.5">
                  Complete item information
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 hover:bg-slate-800/50 rounded-xl transition-all text-slate-400 hover:text-white active:scale-95"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto max-h-[calc(90vh-160px)] bg-gradient-to-br from-slate-950/50 via-slate-900/30 to-slate-950/50">
          {isLoading ? (
            <div className="flex items-center justify-center py-32">
              <div className="flex flex-col items-center gap-4">
                <Loader size={48} className="text-emerald-400 animate-spin" />
                <span className="text-slate-300 text-lg font-semibold">
                  Loading details...
                </span>
              </div>
            </div>
          ) : item ? (
            <div className="p-8 space-y-6">
              {/* Status and Privilege Badges */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg ${
                    item.status === "FOUND"
                      ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border-2 border-emerald-500/30"
                      : "bg-slate-500/20 text-slate-300 border-2 border-slate-500/30"
                  }`}
                >
                  {item.status === "FOUND" ? (
                    <>
                      <CheckCircle2 size={18} />
                      Available for Claim
                    </>
                  ) : (
                    <>
                      <AlertCircle size={18} />
                      {item.status}
                    </>
                  )}
                </div>
                {isPrivileged && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border-2 border-amber-500/30 rounded-xl text-sm font-bold text-amber-300 shadow-lg">
                    <Shield size={16} />
                    {user.role} ACCESS
                  </div>
                )}
              </div>

              {/* Main Info Card */}
              <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8 shadow-xl space-y-6">
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-wider">
                    <Package size={18} className="text-emerald-400" />
                    Item Type
                  </label>
                  <p className="text-3xl font-bold text-white">
                    {item.item_type}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-700/50">
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-wider">
                      <MapPin size={18} className="text-emerald-400" />
                      Location Found
                    </label>
                    <p className="text-lg font-semibold text-white">
                      {item.location_found}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-wider">
                      <Calendar size={18} className="text-emerald-400" />
                      Date Found
                    </label>
                    <p className="text-lg font-semibold text-white">
                      {formatDate(item.date_found)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Public Details */}
              {item.public_details &&
                Object.keys(item.public_details).length > 0 && (
                  <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-emerald-500/10 rounded-lg">
                        <Eye size={20} className="text-emerald-400" />
                      </div>
                      <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                        Public Attributes
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(item.public_details).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="bg-slate-950/50 border border-slate-700/50 rounded-xl p-4 hover:border-emerald-500/30 transition-all"
                          >
                            <p className="text-xs font-bold text-emerald-400 mb-2 uppercase tracking-wider">
                              {key}
                            </p>
                            <p className="text-base text-white font-semibold">
                              {value}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Hidden Details (Only for Staff/Admin) */}
              {isPrivileged &&
                item.hidden_details &&
                Object.keys(item.hidden_details).length > 0 && (
                  <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-xl border-2 border-amber-500/30 rounded-2xl p-8 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-amber-500/20 rounded-lg">
                        <EyeOff size={20} className="text-amber-300" />
                      </div>
                      <h3 className="text-lg font-bold text-amber-200 uppercase tracking-wider">
                        Hidden Attributes
                        <span className="ml-2 text-xs font-semibold text-amber-400/80">
                          (Staff Only)
                        </span>
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(item.hidden_details).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 hover:border-amber-400/50 transition-all"
                          >
                            <p className="text-xs font-bold text-amber-300 mb-2 uppercase tracking-wider">
                              {key}
                            </p>
                            <p className="text-base text-amber-50 font-semibold">
                              {value}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Images */}
              {item.image_urls && item.image_urls.length > 0 && (
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8 shadow-xl">
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6">
                    Evidence Photos
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {item.image_urls.map((url, index) => (
                      <div
                        key={index}
                        className="aspect-square rounded-xl overflow-hidden border-2 border-slate-700/50 hover:border-emerald-500/50 transition-all shadow-lg group"
                      >
                        <img
                          src={url}
                          alt={`${item.item_type} - Photo ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Claim Notice */}
              {!isPrivileged && item.status === "FOUND" && (
                <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 border-l-4 border-emerald-500 px-8 py-5 rounded-r-xl">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-emerald-500/10 rounded-lg flex-shrink-0">
                      <AlertCircle size={22} className="text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-emerald-100 text-base mb-2">
                        Is this your item?
                      </h4>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        If you believe this item belongs to you, please contact
                        our support team or visit the lost and found desk to
                        start the claim process. Be prepared to answer security
                        questions to verify ownership.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center py-32">
              <div className="text-center">
                <div className="w-20 h-20 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <AlertCircle size={48} className="text-red-400" />
                </div>
                <p className="text-slate-300 text-xl font-bold mb-2">
                  Failed to load item details
                </p>
                <p className="text-slate-500 text-sm">Please try again later</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-slate-900/95 to-slate-900/80 backdrop-blur-xl border-t border-slate-800/50 px-8 py-2">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-8 py-2 border-2 border-slate-700/50 text-slate-300 font-bold rounded-xl hover:bg-slate-800/50 hover:border-slate-600 transition-all active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailsModal;
