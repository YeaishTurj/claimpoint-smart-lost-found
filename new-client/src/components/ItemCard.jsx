import React from "react";
import { Package, MapPin, Calendar, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const ItemCard = ({ item, onClick }) => {
  const imageUrl = item.image_urls?.[0] || null;

  // Logic for dynamic status colors
  const isClaimed = item.status?.toLowerCase() === "claimed";
  const statusColor = isClaimed
    ? "bg-red-500/20 text-red-300 border-red-500/40"
    : "bg-emerald-500/20 text-emerald-300 border-emerald-500/50";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="group relative flex flex-col h-full bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-lg rounded-2xl border border-slate-700/80 hover:border-emerald-500/60 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-emerald-500/20 overflow-hidden"
    >
      {/* Gradient overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/5 group-hover:to-teal-500/5 transition-all duration-500 pointer-events-none" />
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl bg-slate-700/50">
        {imageUrl ? (
          <motion.img
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.4 }}
            src={imageUrl}
            alt={item.item_type}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800 gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Package
                size={40}
                className="text-slate-500 group-hover:text-emerald-400 transition-colors"
              />
            </motion.div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              No Image
            </span>
          </div>
        )}

        {/* Status Overlay */}
        <div className="absolute top-3 left-3 flex gap-2">
          <motion.span
            whileHover={{ scale: 1.05 }}
            className={`px-3 py-1.5 text-xs font-bold tracking-wider uppercase rounded-lg border backdrop-blur-md shadow-lg ${statusColor}`}
          >
            {item.status || "AVAILABLE"}
          </motion.span>
        </div>

        {/* Glossy Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
      </div>

      {/* Content Body */}
      <div className="relative flex flex-col flex-grow p-5 gap-3">
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-emerald-300 group-hover:to-teal-300 transition-all duration-300 line-clamp-2">
            {item.item_type || "Uncategorized Item"}
          </h3>
        </div>

        {/* Info Blocks */}
        <div className="mt-auto grid grid-cols-2 gap-4 pt-4 border-t border-slate-700/60">
          <motion.div whileHover={{ scale: 1.05 }} className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-tight">
              <MapPin size={14} className="text-emerald-400" />
              <span>Location</span>
            </div>
            <p className="text-sm text-white font-semibold truncate">
              {item.location_found || "Unknown"}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="space-y-2 text-right"
          >
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
          </motion.div>
        </div>
      </div>

      {/* Modern Button */}
      <div className="relative px-5 pb-5">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/50"
        >
          <span className="text-sm font-bold flex items-center gap-1.5">
            <Sparkles size={16} />
            View Details
          </span>
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowRight size={18} className="text-white" />
          </motion.div>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ItemCard;
