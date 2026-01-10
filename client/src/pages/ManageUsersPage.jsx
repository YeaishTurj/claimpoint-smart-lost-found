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
  AlertTriangle,
  Filter,
  User,
  X,
} from "lucide-react";
import { api } from "../lib/api";
import { toast } from "react-toastify";
import { useAuth } from "../context/auth.context";
import { useNavigate } from "react-router";

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4">
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] p-8 border border-slate-700/50 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <User size={40} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Access Required
          </h2>
          <p className="text-slate-300 mb-6">
            Please log in to access admin functionalities
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-500/20 transition-all"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/admin/users");
      setUsers(response.data.users || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to load users", {
        position: "top-center",
        autoClose: 2000,
      });
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    if (currentStatus) {
      const user = users.find((u) => u.id === userId);
      setSelectedUser({
        id: userId,
        name: user?.full_name || "this user",
      });
      setShowConfirmModal(true);
      return;
    }

    await performStatusToggle(userId, currentStatus);
  };

  const performStatusToggle = async (userId, currentStatus) => {
    try {
      const endpoint = currentStatus
        ? `/admin/users/${userId}/deactivate`
        : `/admin/users/${userId}/activate`;

      await api.patch(endpoint);

      toast.success(
        `User ${!currentStatus ? "activated" : "deactivated"} successfully`,
        {
          position: "top-center",
          autoClose: 2000,
        }
      );

      fetchUsers();
    } catch (error) {
      console.error("Failed to update user status:", error);
      toast.error(
        error.response?.data?.message || "Failed to update user status",
        {
          position: "top-center",
          autoClose: 2000,
        }
      );
    }
  };

  const handleConfirmDeactivate = async () => {
    if (selectedUser) {
      await performStatusToggle(selectedUser.id, true);
      setShowConfirmModal(false);
      setSelectedUser(null);
    }
  };

  const handleCancelDeactivate = () => {
    setShowConfirmModal(false);
    setSelectedUser(null);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const activeCount = users.filter((u) => u.is_active).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full backdrop-blur-sm">
              <Shield size={16} className="text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-300">
                Admin Dashboard
              </span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
                User Management
              </h1>
              <p className="text-lg text-slate-400 max-w-2xl">
                Oversee and manage all registered users, their roles, and
                account statuses
              </p>
            </div>

            {/* Stats Cards */}
            <div className="flex gap-4">
              <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-xl px-4 py-3 min-w-[120px]">
                <p className="text-xs text-slate-400 mb-1">Total Users</p>
                <p className="text-2xl font-bold text-white">{users.length}</p>
              </div>
              <div className="bg-slate-900/40 backdrop-blur-xl border border-emerald-500/20 rounded-xl px-4 py-3 min-w-[120px]">
                <p className="text-xs text-emerald-400 mb-1">Active</p>
                <p className="text-2xl font-bold text-emerald-300">
                  {activeCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-800/50 shadow-2xl mb-8">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
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

          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-slate-400" />
              <p className="text-slate-400">
                Showing{" "}
                <span className="font-semibold text-white">
                  {filteredUsers.length}
                </span>{" "}
                of {users.length} users
              </p>
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
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
                Loading users...
              </span>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredUsers.length === 0 && (
          <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl p-16 border border-slate-800/50 shadow-2xl text-center">
            <div className="w-20 h-20 bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users size={40} className="text-slate-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              No Users Found
            </h3>
            <p className="text-slate-400 text-lg max-w-md mx-auto">
              {searchTerm || roleFilter !== "all"
                ? "No users match your search criteria. Try adjusting your filters."
                : "No users have been registered in the system yet."}
            </p>
          </div>
        )}

        {/* Users Table */}
        {!isLoading && filteredUsers.length > 0 && (
          <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-slate-800/50 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800/40 border-b border-slate-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Joined Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/30">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-800/20 transition-colors"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <span className="text-white font-bold text-base">
                              {user.full_name?.charAt(0).toUpperCase() || "U"}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-white text-base">
                              {user.full_name || "Unknown"}
                            </p>
                            <p className="text-xs text-slate-500 font-mono">
                              ID: {user.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-slate-300">
                            <Mail
                              size={14}
                              className="text-emerald-400 flex-shrink-0"
                            />
                            <span className="truncate max-w-[200px]">
                              {user.email || "N/A"}
                            </span>
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-2 text-sm text-slate-300">
                              <Phone
                                size={14}
                                className="text-emerald-400 flex-shrink-0"
                              />
                              {user.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${
                            user.role === "ADMIN"
                              ? "bg-purple-500/15 text-purple-300 border border-purple-500/30"
                              : user.role === "STAFF"
                              ? "bg-blue-500/15 text-blue-300 border border-blue-500/30"
                              : "bg-slate-700/50 text-slate-300 border border-slate-600/50"
                          }`}
                        >
                          <Shield size={13} />
                          {user.role || "USER"}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${
                            user.is_active
                              ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                              : "bg-red-500/15 text-red-300 border border-red-500/30"
                          }`}
                        >
                          {user.is_active ? (
                            <UserCheck size={13} />
                          ) : (
                            <UserX size={13} />
                          )}
                          {user.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <Calendar size={14} className="text-emerald-400" />
                          {user.created_at
                            ? new Date(user.created_at).toLocaleDateString(
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
                        <button
                          onClick={() =>
                            handleToggleStatus(user.id, user.is_active)
                          }
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                            user.is_active
                              ? "bg-red-500/15 text-red-300 hover:bg-red-500/25 border border-red-500/30"
                              : "bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30"
                          }`}
                        >
                          {user.is_active ? "Deactivate" : "Activate"}
                        </button>
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
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 bg-red-500/15 border-2 border-red-500/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={28} className="text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">
                  Confirm Deactivation
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  Are you sure you want to deactivate{" "}
                  <span className="font-semibold text-white">
                    {selectedUser?.name}
                  </span>
                  ? This will immediately revoke their access to the system.
                </p>
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6">
              <p className="text-sm text-amber-200 flex items-start gap-2">
                <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
                <span>
                  This action can be reversed by activating the account again.
                </span>
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCancelDeactivate}
                className="flex-1 px-5 py-3 border-2 border-slate-700/50 text-slate-300 font-semibold rounded-xl hover:bg-slate-800/50 hover:border-slate-600 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeactivate}
                className="flex-1 px-5 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-800 hover:shadow-xl hover:shadow-red-500/30 transition-all"
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsersPage;
