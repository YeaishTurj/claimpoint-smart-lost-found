import React, { useState, useEffect, useMemo } from "react";
import { Search, Filter, Package, X } from "lucide-react";
import { api } from "../lib/api";
import { toast } from "react-toastify";
import ItemCard from "../components/ItemCard";
import ItemDetailsModal from "../components/itemDetailsModal";
import { motion } from "framer-motion";

const BrowseFoundItems = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/items/found-items");
      // Adjust according to your actual API response structure
      setItems(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch items:", error);
      toast.error("Failed to load items", {
        position: "top-center",
        autoClose: 2000,
      });
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Memoized filtering to prevent unnecessary calculations on every render
  const filteredItems = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return items.filter((item) => {
      const matchesType = item.item_type?.toLowerCase().includes(term);
      const matchesDescription = item.public_details?.description
        ?.toLowerCase()
        .includes(term);
      const matchesLocation = item.location_found?.toLowerCase().includes(term);
      return matchesType || matchesDescription || matchesLocation;
    });
  }, [items, searchTerm]);

  const availableCount = useMemo(
    () =>
      items.filter((item) => {
        const status = item.status?.toLowerCase();
        return status === "found" || status === "available" || !status;
      }).length,
    [items]
  );

  const claimedCount = useMemo(
    () =>
      items.filter((item) => item.status?.toLowerCase() === "claimed").length,
    [items]
  );

  const handleItemClick = (itemId) => {
    setSelectedItemId(itemId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItemId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center justify-between mb-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full backdrop-blur-sm"
            >
              <Package size={16} className="text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-300">
                Lost & Found Desk
              </span>
            </motion.div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
                Browse Found Items
              </h1>
              <p className="text-lg text-slate-400 max-w-2xl">
                Explore items that have been turned in and start a claim for
                what belongs to you.
              </p>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-xl px-4 py-3 min-w-[140px] hover:border-slate-700/70 transition-colors"
              >
                <p className="text-xs text-slate-400 mb-1">Total Items</p>
                <p className="text-2xl font-bold text-white">{items.length}</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-slate-900/40 backdrop-blur-xl border border-emerald-500/20 rounded-xl px-4 py-3 min-w-[140px] hover:border-emerald-500/40 transition-colors"
              >
                <p className="text-xs text-emerald-400 mb-1">Available</p>
                <p className="text-2xl font-bold text-emerald-300">
                  {availableCount}
                </p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-slate-900/40 backdrop-blur-xl border border-teal-500/20 rounded-xl px-4 py-3 min-w-[140px] hidden sm:block hover:border-teal-500/40 transition-colors"
              >
                <p className="text-xs text-teal-300 mb-1">Claimed</p>
                <p className="text-2xl font-bold text-teal-200">
                  {claimedCount}
                </p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Search and Filter Section */}
        <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-800/50 shadow-2xl mb-8">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search by item type, description, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-12 py-3.5 border-2 border-slate-700/50 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all bg-slate-950/50 text-white placeholder:text-slate-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-slate-400" />
              <p className="text-slate-400">
                Showing{" "}
                <span className="font-semibold text-white">
                  {filteredItems.length}
                </span>{" "}
                of {items.length} items
              </p>
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        </div>

        {/* Content States */}
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-slate-700 border-t-emerald-400 rounded-full animate-spin" />
              </div>
              <span className="text-slate-300 text-lg font-medium">
                Loading items...
              </span>
            </div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl p-16 border border-slate-800/50 shadow-2xl text-center">
            <div className="w-20 h-20 bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Package size={40} className="text-slate-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              No Items Found
            </h3>
            <p className="text-slate-400 text-lg max-w-md mx-auto">
              {searchTerm
                ? "No items match your search criteria. Try using different keywords."
                : "There are currently no found items listed in the system."}
            </p>
          </div>
        ) : (
          /* Success State - Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id || item._id}
                item={item}
                onClick={() => handleItemClick(item.id || item._id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Item Details Modal */}
      <ItemDetailsModal
        itemId={selectedItemId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default BrowseFoundItems;
