import { useState, useEffect } from "react";
import { CheckSquare, Clock, X, Search, Filter } from "lucide-react";

export function AllClaimsPage({
  authToken,
  user,
  userRole,
  onLogout,
  onSignInClick,
  onRegisterClick,
}) {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    // Placeholder for fetching claims from API
    // In a real implementation, you would call an API endpoint
    setLoading(true);
    setTimeout(() => {
      // Mock data for demonstration
      setClaims([
        {
          id: 1,
          itemName: "iPhone 14 Pro",
          claimedBy: "Ahmed Hassan",
          claimerEmail: "user1@example.com",
          reportedBy: "Fatima Khan",
          status: "PENDING",
          matchPercentage: 85,
          createdAt: "2025-01-20",
          description: "Black iPhone 14 Pro with space gray color",
        },
        {
          id: 2,
          itemName: "Blue Backpack",
          claimedBy: "Karim Ali",
          claimerEmail: "user2@example.com",
          reportedBy: "Ayesha Rahman",
          status: "APPROVED",
          matchPercentage: 92,
          createdAt: "2025-01-18",
          description: "Nike blue backpack with laptop compartment",
        },
        {
          id: 3,
          itemName: "Watch",
          claimedBy: "Mariam Khan",
          claimerEmail: "user3@example.com",
          reportedBy: "Fatima Khan",
          status: "REJECTED",
          matchPercentage: 40,
          createdAt: "2025-01-17",
          description: "Silver wrist watch, not matching description",
        },
        {
          id: 4,
          itemName: "Wallet",
          claimedBy: "Sara Ahmed",
          claimerEmail: "user4@example.com",
          reportedBy: "Ayesha Rahman",
          status: "PENDING",
          matchPercentage: 78,
          createdAt: "2025-01-19",
          description: "Brown leather wallet with card holders",
        },
        {
          id: 5,
          itemName: "AirPods Pro",
          claimedBy: "Hassan Reza",
          claimerEmail: "user5@example.com",
          reportedBy: "Fatima Khan",
          status: "APPROVED",
          matchPercentage: 95,
          createdAt: "2025-01-16",
          description: "White AirPods Pro in original case",
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const filteredClaims = claims.filter((claim) => {
    const matchesSearch =
      claim.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.claimedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.claimerEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || claim.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return {
          bg: "bg-yellow-500/20",
          border: "border-yellow-500/30",
          text: "text-yellow-300",
          icon: Clock,
        };
      case "APPROVED":
        return {
          bg: "bg-green-500/20",
          border: "border-green-500/30",
          text: "text-green-300",
          icon: CheckSquare,
        };
      case "REJECTED":
        return {
          bg: "bg-red-500/20",
          border: "border-red-500/30",
          text: "text-red-300",
          icon: X,
        };
      default:
        return {
          bg: "bg-gray-500/20",
          border: "border-gray-500/30",
          text: "text-gray-300",
          icon: Clock,
        };
    }
  };

  const getMatchColor = (percentage) => {
    if (percentage >= 85) return "text-green-300";
    if (percentage >= 70) return "text-yellow-300";
    return "text-red-300";
  };

  const stats = {
    total: claims.length,
    pending: claims.filter((c) => c.status === "PENDING").length,
    approved: claims.filter((c) => c.status === "APPROVED").length,
    rejected: claims.filter((c) => c.status === "REJECTED").length,
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
      <div className="max-w-7xl mx-auto pt-20 px-6 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">All Claims</h1>
          <p className="text-gray-400 text-lg">
            Monitor and manage all item claims across the system
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Total Claims</p>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-yellow-300 text-sm mb-1">Pending</p>
            <p className="text-3xl font-bold text-yellow-200">
              {stats.pending}
            </p>
          </div>
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <p className="text-green-300 text-sm mb-1">Approved</p>
            <p className="text-3xl font-bold text-green-200">
              {stats.approved}
            </p>
          </div>
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-300 text-sm mb-1">Rejected</p>
            <p className="text-3xl font-bold text-red-200">{stats.rejected}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Search Claims
              </label>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search by item name or claimant..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-900/50 border border-slate-600/50 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                />
              </div>
            </div>

            {/* Filter by Status */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Filter by Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-600/50 text-white focus:outline-none focus:border-blue-500/50"
              >
                <option value="all">All Claims</option>
                <option value="PENDING">Pending Review</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Claims List */}
        <div className="space-y-4">
          {loading ? (
            <div className="p-12 text-center bg-slate-800/50 border border-slate-700/50 rounded-xl">
              <p className="text-gray-400">Loading claims...</p>
            </div>
          ) : filteredClaims.length === 0 ? (
            <div className="p-12 text-center bg-slate-800/50 border border-slate-700/50 rounded-xl">
              <p className="text-gray-400">
                No claims found matching your criteria
              </p>
            </div>
          ) : (
            filteredClaims.map((claim) => {
              const statusInfo = getStatusColor(claim.status);
              const StatusIcon = statusInfo.icon;

              return (
                <div
                  key={claim.id}
                  className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/50 transition"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    {/* Item Name */}
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Item Name</p>
                      <p className="text-white font-semibold">
                        {claim.itemName}
                      </p>
                    </div>

                    {/* Claimed By */}
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Claimed By</p>
                      <div>
                        <p className="text-white font-semibold">
                          {claim.claimedBy}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {claim.claimerEmail}
                        </p>
                      </div>
                    </div>

                    {/* Match Percentage */}
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Match %</p>
                      <p
                        className={`text-2xl font-bold ${getMatchColor(
                          claim.matchPercentage
                        )}`}
                      >
                        {claim.matchPercentage}%
                      </p>
                    </div>

                    {/* Status */}
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Status</p>
                      <div
                        className={`flex items-center gap-2 w-fit px-3 py-1.5 rounded-full ${statusInfo.bg} ${statusInfo.border} border`}
                      >
                        <StatusIcon size={16} className={statusInfo.text} />
                        <span
                          className={`text-xs font-semibold ${statusInfo.text}`}
                        >
                          {claim.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description and Additional Info */}
                  <div className="border-t border-slate-700/50 pt-4">
                    <p className="text-gray-400 text-sm mb-2">
                      <strong>Description:</strong> {claim.description}
                    </p>
                    <p className="text-gray-500 text-xs">
                      <strong>Reported By:</strong> {claim.reportedBy} |
                      <strong className="ml-3">Date:</strong> {claim.createdAt}
                    </p>
                  </div>

                  {/* Action Buttons (for PENDING claims) */}
                  {claim.status === "PENDING" && (
                    <div className="border-t border-slate-700/50 mt-4 pt-4 flex gap-3">
                      <button className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition">
                        Approve Claim
                      </button>
                      <button className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition">
                        Reject Claim
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
