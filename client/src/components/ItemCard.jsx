import React from "react";
import { Package, MapPin, Calendar, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const ItemCard = ({ item, onClick }) => {
  const imageUrl = item.image_urls?.[0] || null;

  // High-Contrast Status Logic
  const isClaimed = item.status?.toLowerCase() === "claimed";
  const statusStyles = isClaimed
    ? "bg-red-950/40 text-red-400 border-red-500/30"
    : "bg-emerald-950/60 text-emerald-400 border-emerald-500/40";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="group relative flex flex-col h-full bg-[#0b1120] rounded-[1.5rem] border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 cursor-pointer shadow-2xl overflow-hidden"
    >
      {/* 1. Image Header */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
        {imageUrl ? (
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6 }}
            src={imageUrl}
            alt={item.item_type}
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 gap-3">
            <Package
              size={42}
              className="text-slate-700 group-hover:text-emerald-500/50 transition-colors"
            />
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
              No Preview
            </span>
          </div>
        )}

        {/* Floating Status Badge */}
        <div className="absolute top-4 left-4 z-20">
          <span
            className={`px-3 py-1 text-[10px] font-black tracking-widest uppercase rounded-full border backdrop-blur-md ${statusStyles}`}
          >
            {item.status || "Available"}
          </span>
        </div>

        {/* Dark Vignette for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120] via-transparent to-transparent opacity-80" />
      </div>

      {/* 2. Content Section */}
      <div className="relative flex flex-col flex-grow p-6">
        <h3 className="text-xl font-bold text-white mb-4 line-clamp-1 group-hover:text-emerald-400 transition-colors">
          {item.item_type || "Uncategorized Item"}
        </h3>

        {/* Detailed Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <MapPin size={12} className="text-emerald-500" /> Location
            </div>
            <p className="text-sm text-slate-200 font-semibold truncate">
              {item.location_found || "Unknown"}
            </p>
          </div>

          <div className="space-y-1 border-l border-slate-800 pl-4">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <Calendar size={12} className="text-emerald-500" /> Found on
            </div>
            <p className="text-sm text-slate-200 font-semibold">
              {item.date_found
                ? new Date(item.date_found).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                : "N/A"}
            </p>
          </div>
        </div>

        {/* 3. Action Button (Bottom Anchored) */}
        <div className="mt-auto">
          <motion.div className="w-full flex items-center justify-between px-5 py-3.5 bg-slate-900 border border-slate-700 group-hover:border-emerald-500/50 text-white rounded-xl transition-all duration-300">
            <span className="text-sm font-bold flex items-center gap-2">
              <Sparkles size={16} className="text-emerald-400" />
              View Details
            </span>
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform text-emerald-400"
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ItemCard;
