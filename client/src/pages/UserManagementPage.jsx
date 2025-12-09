import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Users, Search, Mail, Phone, Shield } from "lucide-react";

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

  useEffect(() => {
    // Placeholder for fetching users from API
    // In a real implementation, you would call an API endpoint
    setLoading(true);
    setTimeout(() => {
      // Mock data for demonstration
      setUsers([
        {
          id: 1,
          email: "user1@example.com",
          full_name: "Ahmed Hassan",
          phone: "+880 1701 234567",
          role: "USER",
          email_verified: true,
          created_at: "2025-01-15",
        },
        {
          id: 2,
          email: "staff1@example.com",
          full_name: "Fatima Khan",
          phone: "+880 1612 345678",
          role: "STAFF",
          email_verified: true,
          created_at: "2025-01-10",
        },
        {
          id: 3,
          email: "user2@example.com",
          full_name: "Karim Ali",
          phone: "+880 1702 456789",
          role: "USER",
          email_verified: true,
          created_at: "2025-01-20",
        },
        {
          id: 4,
          email: "staff2@example.com",
          full_name: "Ayesha Rahman",
          phone: "+880 1723 567890",
          role: "STAFF",
          email_verified: true,
          created_at: "2025-01-05",
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery);

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Phone
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-900/30 transition">
                      <td className="px-6 py-4 text-white font-medium">
                        {u.full_name}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Mail size={16} className="text-gray-500" />
                          <span className="text-gray-300">{u.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Phone size={16} className="text-gray-500" />
                          <span className="text-gray-300">{u.phone}</span>
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
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {u.created_at}
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
