import React from "react";
import { Package, MapPin, Calendar, ArrowRight } from "lucide-react";

const ItemCard = ({ item, onClick }) => {
  const imageUrl = item.image_urls?.[0] || null;

  // Logic for dynamic status colors
  const isClaimed = item.status?.toLowerCase() === "claimed";
  const statusColor = isClaimed
    ? "bg-red-500/20 text-red-300 border-red-500/30"
    : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";

  return (
    <div
      onClick={onClick}
      className="group relative flex flex-col h-full bg-gradient-to-br from-slate-800/60 to-slate-900/40 backdrop-blur-lg rounded-2xl border border-slate-700/80 hover:border-emerald-500/60 transition-all duration-300 cursor-pointer hover:-translate-y-2 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/20"
    >
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl bg-slate-700/50">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.item_type}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800 gap-3">
            <Package
              size={40}
              className="text-slate-500 group-hover:text-emerald-400 transition-colors"
            />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              No Image
            </span>
          </div>
        )}

        {/* Status Overlay */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span
            className={`px-3 py-1.5 text-xs font-bold tracking-wider uppercase rounded-lg border backdrop-blur-sm ${statusColor}`}
          >
            {item.status || "AVAILABLE"}
          </span>
        </div>

        {/* Glossy Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-50 group-hover:opacity-30 transition-opacity" />
      </div>

      {/* Content Body */}
      <div className="flex flex-col flex-grow p-5 gap-3">
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors duration-300 line-clamp-2">
            {item.item_type || "Uncategorized Item"}
          </h3>
        </div>

        {/* Info Blocks */}
        <div className="mt-auto grid grid-cols-2 gap-4 pt-4 border-t border-slate-700/60">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-tight">
              <MapPin size={14} className="text-emerald-400" />
              <span>Location</span>
            </div>
            <p className="text-sm text-white font-semibold truncate">
              {item.location_found || "Unknown"}
            </p>
          </div>

          <div className="space-y-2 text-right">
            <div className="flex items-center justify-end gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-tight">
              <Calendar size={14} className="text-emerald-400" />
              <span>Found</span>
            </div>
            <p className="text-sm text-white font-semibold">
              {item.date_found
                ? new Date(item.date_found).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Modern Button - Only shows full hover effect on group hover */}
      <div className="px-5 pb-5">
        <button className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/50 group/btn">
          <span className="text-sm font-bold">View Details</span>
          <ArrowRight
            size={18}
            className="text-white group-hover/btn:translate-x-1 transition-transform"
          />
        </button>
      </div>
    </div>
  );
};

export default ItemCard;
