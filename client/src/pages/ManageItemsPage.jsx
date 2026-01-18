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
  User,
  ChevronRight,
  Database,
  Lock,
  Loader,
} from "lucide-react";
import { api } from "../lib/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useAuth } from "../context/auth.context";
import ItemDetailsModal from "../components/itemDetailsModal";
import { PageShell } from "../components/layout";
import { AccessCard, Button, EmptyState, LoadingState } from "../components/ui";

const ManageItemsPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();

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
      toast.error("Database Error: Failed to retrieve inventory registry", {
        theme: "dark",
      });
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await api.delete(`/staff/found-items/${itemId}`);
      toast.success("Entry purged from registry", { theme: "dark" });
      fetchItems();
      setShowConfirmModal(false);
      setSelectedItem(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Purge operation failed", {
        theme: "dark",
      });
    }
  };

  const openDeleteConfirmation = (item) => {
    setSelectedItem(item);
    setShowConfirmModal(true);
  };

  const handleOpenDetails = (itemId) => {
    setSelectedItemId(itemId);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsModalOpen(false);
    setSelectedItemId(null);
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
    (u) => u.status?.toLowerCase() === "found",
  ).length;
  const claimedCount = items.filter(
    (u) => u.status?.toLowerCase() === "claimed",
  ).length;

  if (!isAuthenticated) {
    return (
      <AccessCard
        icon={Shield}
        description="Authentication required. Please sign in to access the staff inventory ledger."
      />
    );
  }

  return (
    <PageShell>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
        <button
          onClick={() => navigate("/admin")}
          className="hover:text-emerald-400 transition-colors"
        >
          Staff Hub
        </button>
        <ChevronRight size={12} />
        <span className="text-slate-300">Inventory Ledger</span>
      </div>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg mb-4">
            <Database size={14} className="text-emerald-400" />
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
              Active Inventory
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Manage <span className="text-emerald-400">Items.</span>
          </h1>
          <p className="text-slate-400 font-medium max-w-xl">
            Real-time control over the found property registry. Update metadata,
            verify claims, or purge obsolete entries.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <StatPill label="Total Registry" value={items.length} color="slate" />
          <StatPill label="Found" value={foundCount} color="emerald" />
          <StatPill label="Claimed" value={claimedCount} color="teal" />
        </div>
      </div>

      {/* Intelligence Bar */}
      <div className="bg-[#0b1120] rounded-[2rem] p-6 border border-slate-800 shadow-2xl mb-10">
        <div className="grid lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3 relative">
            <Search
              size={20}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="text"
              placeholder="Query item type, location, or metadata..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-12 py-4 bg-[#010409] border border-slate-800 rounded-2xl text-white font-medium focus:border-emerald-500 transition-all placeholder:text-slate-600"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-6 py-4 bg-[#010409] border border-slate-800 rounded-2xl text-xs font-black text-slate-300 uppercase tracking-widest focus:border-emerald-500 outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="found">Found</option>
            <option value="claimed">Claimed</option>
            <option value="returned">Returned</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <div className="py-24 flex flex-col items-center">
          <Loader className="animate-spin text-emerald-500 mb-4" size={40} />
          <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.2em]">
            Synchronizing Registry...
          </p>
        </div>
      ) : filteredItems.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No Records Found"
          description="The current query yielded no results in the inventory database."
          action={
            <Button onClick={() => navigate("/add-found-item")}>
              <Plus size={18} /> Initialize Record
            </Button>
          }
        />
      ) : (
        <div className="bg-[#0b1120] rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-800">
                  <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Asset Information
                  </th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Discovery Hub
                  </th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Timestamp
                  </th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Action Hub
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-900/30 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center text-emerald-400">
                          <Package size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-white text-base">
                            {item.item_type}
                          </p>
                          <p className="text-[10px] font-mono text-slate-600 uppercase tracking-tighter">
                            REF: {item.id?.slice(0, 12)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                        <MapPin size={12} className="text-emerald-500" />
                        {item.location_found}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-xs font-bold text-slate-400">
                      {item.date_found
                        ? new Date(item.date_found).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" },
                          )
                        : "---"}
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg border ${
                          item.status?.toLowerCase() === "found"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                        }`}
                      >
                        {item.status || "FOUND"}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <ActionButton
                          icon={<Eye size={16} />}
                          onClick={() => handleOpenDetails(item.id)}
                          title="Inspect"
                        />
                        <ActionButton
                          icon={<Edit size={16} />}
                          onClick={() =>
                            navigate(`/update-item/${item.id}`, {
                              state: { item },
                            })
                          }
                          title="Modify"
                        />
                        <button
                          onClick={() => openDeleteConfirmation(item)}
                          disabled={item.status?.toLowerCase() === "claimed"}
                          className={`p-2.5 rounded-xl border transition-all ${
                            item.status?.toLowerCase() === "claimed"
                              ? "opacity-20 cursor-not-allowed border-slate-700"
                              : "border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white"
                          }`}
                        >
                          {item.status?.toLowerCase() === "claimed" ? (
                            <Lock size={16} />
                          ) : (
                            <Trash2 size={16} />
                          )}
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

      {/* Confirmation Modal */}
      {showConfirmModal && selectedItem && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center z-[110] p-4">
          <div className="bg-[#0b1120] rounded-[2.5rem] border border-red-500/20 max-w-md w-full p-10 shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mb-6">
                <AlertTriangle size={32} className="text-red-500" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3">
                Purge Record?
              </h3>
              <p className="text-slate-400 mb-8 text-sm font-medium leading-relaxed">
                You are about to permanently delete{" "}
                <span className="text-white font-bold">
                  {selectedItem.item_type}
                </span>
                . This operation is irreversible.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-5 py-4 bg-slate-900 text-slate-400 text-xs font-black uppercase tracking-widest rounded-2xl hover:text-white transition-all"
              >
                Abort
              </button>
              <button
                onClick={() => handleDeleteItem(selectedItem.id)}
                className="flex-1 px-5 py-4 bg-red-500 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-red-600 transition-all"
              >
                Confirm Purge
              </button>
            </div>
          </div>
        </div>
      )}

      <ItemDetailsModal
        itemId={selectedItemId}
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetails}
      />
    </PageShell>
  );
};

// --- Helper Components ---

const StatPill = ({ label, value, color }) => (
  <div
    className={`px-5 py-4 bg-slate-900/40 border ${
      color === "emerald"
        ? "border-emerald-500/20"
        : color === "teal"
          ? "border-teal-500/20"
          : "border-slate-800"
    } rounded-2xl min-w-[130px]`}
  >
    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">
      {label}
    </p>
    <p
      className={`text-2xl font-black ${
        color === "emerald"
          ? "text-emerald-400"
          : color === "teal"
            ? "text-teal-400"
            : "text-white"
      }`}
    >
      {value}
    </p>
  </div>
);

const ActionButton = ({ icon, onClick, title }) => (
  <button
    onClick={onClick}
    title={title}
    className="p-2.5 bg-slate-900 border border-slate-700 text-slate-400 hover:text-emerald-400 hover:border-emerald-400 transition-all rounded-xl"
  >
    {icon}
  </button>
);

export default ManageItemsPage;
