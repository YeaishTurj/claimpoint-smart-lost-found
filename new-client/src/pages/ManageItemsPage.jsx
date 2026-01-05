import React, { useState, useEffect } from "react";
import {
  Package,
  Search,
  Shield,
  MapPin,
  Calendar,
  Edit,
  Trash2,
  AlertTriangle,
  Filter,
  X,
  Eye,
  Plus,
} from "lucide-react";
import { api } from "../lib/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const ManageItemsPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/items/found-items");
      setItems(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch items:", error);
      toast.error("Failed to load items", {
        position: "top-center",
        autoClose: 5000,
      });
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await api.delete(`/staff/found-items/${itemId}`);

      toast.success("Item deleted successfully", {
        position: "top-center",
        autoClose: 5000,
      });

      fetchItems();
      setShowConfirmModal(false);
      setSelectedItem(null);
    } catch (error) {
      console.error("Failed to delete item:", error);
      toast.error(error.response?.data?.message || "Failed to delete item", {
        position: "top-center",
        autoClose: 5000,
      });
    }
  };

  const openDeleteConfirmation = (item) => {
    setSelectedItem(item);
    setShowConfirmModal(true);
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.item_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location_found?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.public_details?.description
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      item.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const foundCount = items.filter(
    (item) => item.status?.toLowerCase() === "found"
  ).length;
  const claimedCount = items.filter(
    (item) => item.status?.toLowerCase() === "claimed"
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full backdrop-blur-sm">
              <Shield size={16} className="text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-300">
                Staff Dashboard
              </span>
            </div>

            <button
              onClick={() => navigate("/add-found-item")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold rounded-xl hover:from-emerald-500 hover:to-emerald-400 shadow-lg shadow-emerald-500/30 transition-all"
            >
              <Plus size={18} />
              Add New Item
            </button>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
                Manage Found Items
              </h1>
              <p className="text-lg text-slate-400 max-w-2xl">
                View, update, and manage all found items in the system
              </p>
            </div>

            {/* Stats Cards */}
            <div className="flex gap-4">
              <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-xl px-4 py-3 min-w-[120px]">
                <p className="text-xs text-slate-400 mb-1">Total Items</p>
                <p className="text-2xl font-bold text-white">{items.length}</p>
              </div>
              <div className="bg-slate-900/40 backdrop-blur-xl border border-emerald-500/20 rounded-xl px-4 py-3 min-w-[120px]">
                <p className="text-xs text-emerald-400 mb-1">Found</p>
                <p className="text-2xl font-bold text-emerald-300">
                  {foundCount}
                </p>
              </div>
              <div className="bg-slate-900/40 backdrop-blur-xl border border-teal-500/20 rounded-xl px-4 py-3 min-w-[120px]">
                <p className="text-xs text-teal-300 mb-1">Claimed</p>
                <p className="text-2xl font-bold text-teal-200">
                  {claimedCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-800/50 shadow-2xl mb-8">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="relative">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search by item type, location, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 border-2 border-slate-700/50 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all bg-slate-950/50 text-white placeholder:text-slate-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3.5 border-2 border-slate-700/50 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all bg-slate-950/50 text-white"
            >
              <option value="all">All Statuses</option>
              <option value="found">Found</option>
              <option value="claimed">Claimed</option>
              <option value="returned">Returned</option>
            </select>
          </div>

          <div className="flex items-center justify-between text-sm">
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
            {(searchTerm || statusFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
                className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-slate-700 border-t-emerald-400 rounded-full animate-spin"></div>
              </div>
              <span className="text-slate-300 text-lg font-medium">
                Loading items...
              </span>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredItems.length === 0 && (
          <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl p-16 border border-slate-800/50 shadow-2xl text-center">
            <div className="w-20 h-20 bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Package size={40} className="text-slate-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              No Items Found
            </h3>
            <p className="text-slate-400 text-lg max-w-md mx-auto mb-6">
              {searchTerm || statusFilter !== "all"
                ? "No items match your search criteria. Try adjusting your filters."
                : "No found items have been added yet."}
            </p>
            <button
              onClick={() => navigate("/add-found-item")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold rounded-xl hover:from-emerald-500 hover:to-emerald-400 shadow-lg shadow-emerald-500/30 transition-all"
            >
              <Plus size={18} />
              Add Your First Item
            </button>
          </div>
        )}

        {/* Items Table */}
        {!isLoading && filteredItems.length > 0 && (
          <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-slate-800/50 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800/40 border-b border-slate-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Date Found
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/30">
                  {filteredItems.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-800/20 transition-colors"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <Package size={20} className="text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-white text-base">
                              {item.item_type || "Unknown"}
                            </p>
                            <p className="text-xs text-slate-500 font-mono">
                              ID: {item.id?.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <MapPin
                            size={14}
                            className="text-emerald-400 flex-shrink-0"
                          />
                          <span className="truncate max-w-[200px]">
                            {item.location_found || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <Calendar size={14} className="text-emerald-400" />
                          {item.date_found
                            ? new Date(item.date_found).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )
                            : "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${
                            item.status?.toLowerCase() === "found"
                              ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                              : item.status?.toLowerCase() === "claimed"
                              ? "bg-blue-500/15 text-blue-300 border-blue-500/30"
                              : "bg-slate-700/50 text-slate-300 border-slate-600/50"
                          }`}
                        >
                          {item.status || "FOUND"}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              navigate(`/items/${item.id}`, {
                                state: { item },
                              })
                            }
                            className="p-2 bg-blue-500/15 text-blue-300 hover:bg-blue-500/25 border border-blue-500/30 rounded-lg transition-all group"
                            title="View Details"
                          >
                            <Eye
                              size={16}
                              className="group-hover:scale-110 transition-transform"
                            />
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/update-item/${item.id}`, {
                                state: { item },
                              })
                            }
                            className="p-2 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30 rounded-lg transition-all group"
                            title="Edit Item"
                          >
                            <Edit
                              size={16}
                              className="group-hover:scale-110 transition-transform"
                            />
                          </button>
                          <button
                            onClick={() => openDeleteConfirmation(item)}
                            disabled={item.status?.toLowerCase() === "claimed"}
                            className={`p-2 rounded-lg transition-all group ${
                              item.status?.toLowerCase() === "claimed"
                                ? "bg-slate-700/30 text-slate-500 cursor-not-allowed border border-slate-600/30"
                                : "bg-red-500/15 text-red-300 hover:bg-red-500/25 border border-red-500/30"
                            }`}
                            title={
                              item.status?.toLowerCase() === "claimed"
                                ? "Cannot delete claimed items"
                                : "Delete Item"
                            }
                          >
                            <Trash2
                              size={16}
                              className={
                                item.status?.toLowerCase() !== "claimed"
                                  ? "group-hover:scale-110 transition-transform"
                                  : ""
                              }
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && selectedItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 bg-red-500/15 border-2 border-red-500/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={28} className="text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">
                  Confirm Deletion
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-white">
                    {selectedItem.item_type}
                  </span>
                  ? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6">
              <p className="text-sm text-amber-200 flex items-start gap-2">
                <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
                <span>
                  Once deleted, all associated data will be permanently removed
                  from the system.
                </span>
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setSelectedItem(null);
                }}
                className="flex-1 px-5 py-3 border-2 border-slate-700/50 text-slate-300 font-semibold rounded-xl hover:bg-slate-800/50 hover:border-slate-600 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteItem(selectedItem.id)}
                className="flex-1 px-5 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-800 hover:shadow-xl hover:shadow-red-500/30 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageItemsPage;
