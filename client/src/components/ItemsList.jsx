import { MapPin, Calendar, AlertCircle, Eye } from "lucide-react";
import { useState } from "react";
import { ItemDetailsCard } from "./ItemDetailsCard";
import { ClaimItemModal } from "./ClaimItemModal";

export function ItemsList({ items, loading, userRole, authToken }) {
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [showDetailsCard, setShowDetailsCard] = useState(false);
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [claimingItemId, setClaimingItemId] = useState(null);
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimError, setClaimError] = useState(null);
  if (loading) {
    return (
      <section id="items" className="space-y-4">
        <h2 className="text-3xl font-bold text-white mb-6">Found Items</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-lg border border-white/10 bg-white/5 p-4 animate-pulse"
            >
              <div className="h-40 bg-white/10 rounded-lg mb-4"></div>
              <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-white/10 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!items || items.length === 0) {
    return (
      <section id="items" className="space-y-4">
        <h2 className="text-3xl font-bold text-white mb-6">Found Items</h2>
        <div className="flex items-center gap-3 rounded-lg border border-yellow-500/40 bg-yellow-500/10 p-4">
          <AlertCircle className="text-yellow-400" size={24} />
          <div>
            <p className="font-semibold text-yellow-300">No items found</p>
            <p className="text-sm text-yellow-200">
              There are currently no found items in the system.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="items" className="space-y-4">
      <h2 className="text-3xl font-bold text-white mb-6">
        Found Items ({items.length})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 overflow-hidden transition group cursor-pointer"
          >
            {/* Item Image */}
            {item.image_urls && item.image_urls.length > 0 ? (
              <div className="relative h-40 overflow-hidden bg-gradient-to-br from-slate-700 to-slate-900">
                <img
                  src={item.image_urls[0]}
                  alt={item.item_type}
                  className="w-full h-full object-cover group-hover:scale-110 transition"
                />
                <div className="absolute top-2 right-2">
                  <span className="px-3 py-1 rounded-full bg-blue-500/90 text-white text-xs font-semibold">
                    {item.status || "Available"}
                  </span>
                </div>
              </div>
            ) : (
              <div className="h-40 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">📦</div>
                  <p className="text-sm text-gray-400">No image</p>
                </div>
              </div>
            )}

            {/* Item Details */}
            <div className="p-4 space-y-3">
              {/* Item Type */}
              <h3 className="text-lg font-bold text-white line-clamp-2">
                {item.item_type}
              </h3>

              {/* Location */}
              {item.location_found && (
                <div className="flex items-start gap-2">
                  <MapPin
                    size={16}
                    className="text-blue-400 mt-1 flex-shrink-0"
                  />
                  <p className="text-sm text-gray-300 line-clamp-2">
                    {item.location_found}
                  </p>
                </div>
              )}

              {/* Date Found */}
              {item.date_found && (
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-purple-400" />
                  <p className="text-sm text-gray-300">
                    {new Date(item.date_found).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              )}

              {/* Public Details */}
              {item.public_details && (
                <div className="text-sm text-gray-400 space-y-1">
                  {typeof item.public_details === "string" ? (
                    <p className="line-clamp-2">{item.public_details}</p>
                  ) : (
                    <>
                      {item.public_details.summary && (
                        <p className="line-clamp-2">
                          {item.public_details.summary}
                        </p>
                      )}
                      {item.public_details.found_spot && (
                        <p className="text-xs text-gray-500">
                          Found: {item.public_details.found_spot}
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    setSelectedItemId(item.id);
                    setShowDetailsCard(true);
                  }}
                  className="flex-1 px-4 py-2 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-300 hover:bg-purple-500/30 font-semibold transition flex items-center justify-center gap-2"
                >
                  <Eye size={16} />
                  Details
                </button>
                {(!userRole || userRole === "USER") && (
                  <button
                    className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition"
                    onClick={() => {
                      setClaimingItemId(item.id);
                      setShowClaimForm(true);
                      setClaimError(null);
                    }}
                  >
                    Claim
                  </button>
                )}
                {/* Claim Item Modal */}
                {showClaimForm && claimingItemId && (
                  <ClaimItemModal
                    itemId={claimingItemId}
                    authToken={authToken}
                    onClose={() => {
                      setShowClaimForm(false);
                      setClaimingItemId(null);
                      setClaimError(null);
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showDetailsCard && selectedItemId && (
        <ItemDetailsCard
          itemId={selectedItemId}
          type="found"
          authToken={authToken}
          onClose={() => {
            setShowDetailsCard(false);
            setSelectedItemId(null);
          }}
        />
      )}
    </section>
  );
}
