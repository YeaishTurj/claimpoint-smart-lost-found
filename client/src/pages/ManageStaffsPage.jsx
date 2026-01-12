import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Shield,
  Mail,
  Phone,
  Calendar,
  Loader,
  UserCheck,
  UserX,
  Edit,
  AlertTriangle,
  Filter,
  User,
  X,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { api } from "../lib/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useAuth } from "../context/auth.context";

const ManageStaffsPage = () => {
  const navigate = useNavigate();
  const [staff, setStaff] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/admin/staffs");
      setStaff(response.data.staff || []);
    } catch (error) {
      console.error("Failed to fetch staff:", error);
      toast.error("Access Denied: Could not retrieve staff registry", {
        theme: "dark",
      });
      setStaff([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (staffId, currentStatus) => {
    if (currentStatus) {
      const staffMember = staff.find((s) => s.id === staffId);
      setSelectedStaff({
        id: staffId,
        name: staffMember?.full_name || "this staff member",
      });
      setShowConfirmModal(true);
      return;
    }
    await performStatusToggle(staffId, currentStatus);
  };

  const performStatusToggle = async (staffId, currentStatus) => {
    try {
      const endpoint = currentStatus
        ? `/admin/users/${staffId}/deactivate`
        : `/admin/users/${staffId}/activate`;
      await api.patch(endpoint);
      toast.success(
        `Staff authorization ${!currentStatus ? "activated" : "revoked"}`,
        { theme: "dark" }
      );
      fetchStaff();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed", {
        theme: "dark",
      });
    }
  };

  const handleConfirmDeactivate = async () => {
    if (selectedStaff) {
      await performStatusToggle(selectedStaff.id, true);
      setShowConfirmModal(false);
      setSelectedStaff(null);
    }
  };

  const handleCancelDeactivate = () => {
    setShowConfirmModal(false);
    setSelectedStaff(null);
  };

  const filteredStaff = staff.filter((member) => {
    const matchesSearch =
      member.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const activeCount = staff.filter((s) => s.is_active).length;

  // Check authentication and show restriction message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] px-4">
        <div className="bg-slate-900/40 backdrop-blur-2xl rounded-3xl p-10 border border-slate-800 max-w-md w-full text-center shadow-2xl">
          <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <Shield size={40} className="text-emerald-500" />
          </div>
          <h2 className="text-2xl font-black text-white mb-3">
            Security Restriction
          </h2>
          <p className="text-slate-400 mb-8 font-medium">
            Administrative privileges are required to manage staff members.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full px-6 py-4 bg-emerald-500 text-slate-950 font-black rounded-2xl hover:bg-emerald-400 transition-all uppercase tracking-widest text-xs"
          >
            Authenticate Identity
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
          <span className="hover:text-emerald-400 transition-colors">
            Admin
          </span>
          <ChevronRight size={12} />
          <span className="text-slate-300">Personnel Management</span>
        </div>

        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
              Staff <span className="text-emerald-400">Registry.</span>
            </h1>
            <p className="text-slate-400 font-medium max-w-xl">
              Monitor and adjust access levels for the core operational team.
              Ensure all active personnel are verified.
            </p>
          </div>

          <div className="flex gap-4">
            <StatPill label="Personnel" value={staff.length} color="slate" />
            <StatPill
              label="Active Nodes"
              value={activeCount}
              color="emerald"
            />
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-[#0b1120] rounded-4xl p-6 border border-slate-800 shadow-2xl mb-10 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search
              size={20}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="text"
              placeholder="Search by name or verified email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-12 py-4 bg-[#010409] border border-slate-800 rounded-2xl text-white font-medium focus:border-emerald-500 transition-all placeholder:text-slate-600"
            />
          </div>
          <div className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest bg-slate-900/50 px-6 py-4 rounded-2xl border border-slate-800">
            <Filter size={16} className="text-emerald-500" />
            <span>
              Matches: <b className="text-white ml-1">{filteredStaff.length}</b>
            </span>
          </div>
        </div>

        {/* Table Content */}
        {isLoading ? (
          <div className="py-24 flex flex-col items-center">
            <Loader className="animate-spin text-emerald-500 mb-4" size={40} />
            <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.2em]">
              Synchronizing Personnel Data...
            </p>
          </div>
        ) : filteredStaff.length === 0 ? (
          <div className="bg-[#0b1120] rounded-[2.5rem] p-20 border border-slate-800 text-center">
            <Users size={60} className="mx-auto text-slate-800 mb-6" />
            <h3 className="text-xl font-black text-white">
              No Personnel Identified
            </h3>
            <p className="text-slate-500 text-sm mt-2">
              The staff registry is currently unpopulated.
            </p>
          </div>
        ) : (
          <div className="bg-[#0b1120] rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-900/50 border-b border-slate-800">
                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Operator
                    </th>
                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Communication
                    </th>
                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      System Status
                    </th>
                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Verification
                    </th>
                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Action Hub
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {filteredStaff.map((member) => (
                    <tr
                      key={member.id}
                      className="hover:bg-slate-900/30 transition-colors group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 bg-slate-800 rounded-xl flex items-center justify-center text-emerald-400 font-black group-hover:scale-110 transition-transform">
                            {member.full_name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-white text-base">
                              {member.full_name}
                            </p>
                            <p className="text-[9px] font-mono text-slate-600 tracking-tighter uppercase">
                              UID: {member.id?.slice(0, 10)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                          <Mail size={12} className="text-emerald-500" />{" "}
                          {member.email}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div
                          className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${
                            member.is_active
                              ? "text-emerald-500"
                              : "text-red-500"
                          }`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              member.is_active
                                ? "bg-emerald-500 animate-pulse"
                                : "bg-red-500"
                            }`}
                          />
                          {member.is_active ? "Authorized" : "Suspended"}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span
                          className={`px-3 py-1 text-[9px] font-black uppercase tracking-tighter rounded-full border ${
                            member.email_verified
                              ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          }`}
                        >
                          {member.email_verified
                            ? "Identity Confirmed"
                            : "Awaiting Proof"}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              navigate(`/update-staff/${member.id}`)
                            }
                            className="p-2.5 bg-slate-900 border border-slate-700 text-slate-400 hover:text-emerald-400 hover:border-emerald-400 transition-all rounded-xl"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() =>
                              handleToggleStatus(member.id, member.is_active)
                            }
                            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl border transition-all ${
                              member.is_active
                                ? "border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white"
                                : "border-emerald-500/30 text-emerald-500 hover:bg-emerald-500 hover:text-slate-950"
                            }`}
                          >
                            {member.is_active ? "Suspend" : "Activate"}
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
        {showConfirmModal && (
          <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center z-50 p-4">
            <div className="bg-[#0b1120] rounded-[2.5rem] border border-red-500/20 shadow-2xl max-w-md w-full p-10">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mb-6">
                  <AlertTriangle size={32} className="text-red-500" />
                </div>
                <h3 className="text-2xl font-black text-white mb-3">
                  Suspend Staff Access?
                </h3>
                <p className="text-slate-400 mb-8 text-sm font-medium leading-relaxed">
                  You are about to revoke system access for{" "}
                  <span className="text-white font-bold">
                    {selectedStaff?.name}
                  </span>
                  . They will no longer be able to process claims or manage
                  inventory.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCancelDeactivate}
                  className="flex-1 px-5 py-4 bg-slate-900 text-slate-400 text-xs font-black uppercase tracking-widest rounded-2xl hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDeactivate}
                  className="flex-1 px-5 py-4 bg-red-500 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-red-600 transition-all"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StatPill = ({ label, value, color }) => (
  <div
    className={`px-6 py-4 bg-slate-900/40 border ${
      color === "emerald" ? "border-emerald-500/20" : "border-slate-800"
    } rounded-2xl min-w-[140px]`}
  >
    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
      {label}
    </p>
    <p
      className={`text-3xl font-black ${
        color === "emerald" ? "text-emerald-400" : "text-white"
      }`}
    >
      {value}
    </p>
  </div>
);

export default ManageStaffsPage;
