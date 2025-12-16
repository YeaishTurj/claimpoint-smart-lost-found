import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import {
  Users,
  Search,
  Mail,
  Phone,
  Shield,
  CheckCircle,
  XCircle,
  Power,
  PowerOff,
} from "lucide-react";

export function UserManagementPage({
  authToken,
  user,
  userRole,
  onLogout,
  onSignInClick,
  onRegisterClick,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deactivatingId, setDeactivatingId] = useState(null);
  const [activatingId, setActivatingId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/admin/get-all-users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data.users || []);
      } catch (error) {
        setUsers([]);
        // Optionally, show error to user
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [authToken]);

  const handleDeactivateUser = async (userId) => {
    if (!window.confirm("Are you sure you want to deactivate this user?")) {
      return;
    }

    setDeactivatingId(userId);
    try {
      const response = await fetch(`/api/admin/deactivate-user/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to deactivate user");
      }

      // Update the user's is_active status in the local state
      setUsers(
        users.map((u) => (u.id === userId ? { ...u, is_active: false } : u))
      );
    } catch (error) {
      console.error("Error deactivating user:", error);
      alert("Failed to deactivate user");
    } finally {
      setDeactivatingId(null);
    }
  };

  const handleActivateUser = async (userId) => {
    if (!window.confirm("Are you sure you want to activate this user?")) {
      return;
    }

    setActivatingId(userId);
    try {
      const response = await fetch(`/api/admin/activate-user/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to activate user");
      }

      // Update the user's is_active status in the local state
      setUsers(
        users.map((u) => (u.id === userId ? { ...u, is_active: true } : u))
      );
    } catch (error) {
      console.error("Error activating user:", error);
      alert("Failed to activate user");
    } finally {
      setActivatingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.phone && u.phone.includes(searchQuery));

    const matchesRole = filterRole === "all" || u.role === filterRole;

    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "STAFF":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "USER":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const navbarProps = {
    authToken,
    user,
    userRole,
    onLogout,
    onSignInClick,
    onRegisterClick,
  };

  return (
    <>
      <Navbar {...navbarProps} />
      <div className="max-w-7xl mx-auto pt-20 px-6 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            User Management
          </h1>
          <p className="text-gray-400 text-lg">
            View and manage all registered users in the system
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-white">{users.length}</p>
              </div>
              <Users className="text-blue-400" size={32} />
            </div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Regular Users</p>
                <p className="text-3xl font-bold text-white">
                  {users.filter((u) => u.role === "USER").length}
                </p>
              </div>
              <Users className="text-green-400" size={32} />
            </div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Staff Members</p>
                <p className="text-3xl font-bold text-white">
                  {users.filter((u) => u.role === "STAFF").length}
                </p>
              </div>
              <Shield className="text-blue-400" size={32} />
            </div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Users</p>
                <p className="text-3xl font-bold text-white">
                  {users.filter((u) => u.is_active).length}
                </p>
              </div>
              <CheckCircle className="text-emerald-400" size={32} />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Search Users
              </label>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search by email, name, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-900/50 border border-slate-600/50 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                />
              </div>
            </div>

            {/* Filter by Role */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Filter by Role
              </label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-600/50 text-white focus:outline-none focus:border-blue-500/50"
              >
                <option value="all">All Roles</option>
                <option value="USER">Regular Users</option>
                <option value="STAFF">Staff Members</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <p className="text-gray-400">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-400">
                No users found matching your criteria
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900/50 border-b border-slate-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Actions
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Verified
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-900/30 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          {!u.is_active ? (
                            <button
                              onClick={() => handleActivateUser(u.id)}
                              disabled={activatingId === u.id}
                              className="p-2 rounded-lg bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
                              title={
                                activatingId === u.id
                                  ? "Activating..."
                                  : "Activate User"
                              }
                            >
                              <PowerOff size={16} />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleDeactivateUser(u.id)}
                              disabled={deactivatingId === u.id}
                              className="p-2 rounded-lg bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
                              title={
                                deactivatingId === u.id
                                  ? "Deactivating..."
                                  : "Deactivate User"
                              }
                            >
                              <Power size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white font-medium">
                        {u.full_name}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Mail size={16} className="text-gray-500" />
                          <span className="text-gray-300 text-sm">
                            {u.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getRoleColor(
                            u.role
                          )}`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {u.is_active ? (
                            <>
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-green-300 text-sm">
                                Active
                              </span>
                            </>
                          ) : (
                            <>
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span className="text-red-300 text-sm">
                                Inactive
                              </span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {u.email_verified ? (
                            <>
                              <CheckCircle
                                size={16}
                                className="text-green-400"
                              />
                              <span className="text-green-300 text-sm">
                                Yes
                              </span>
                            </>
                          ) : (
                            <>
                              <XCircle size={16} className="text-red-400" />
                              <span className="text-red-300 text-sm">No</span>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-sm text-blue-200">
            <strong>Note:</strong> User management features like suspension,
            deletion, and role modification can be added based on your platform
            requirements.
          </p>
        </div>
      </div>
    </>
  );
}
