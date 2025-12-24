import { ItemsList } from "../components/ItemsList";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import api from "../services/api";

export function BrowseFoundItemsPage({
  authToken,
  user,
  userRole,
  onLogout,
  onSignInClick,
  onRegisterClick,
  onRecordItemClick,
}) {
  const [foundItems, setFoundItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);

  useEffect(() => {
    fetchFoundItems();
  }, [authToken]);

  const fetchFoundItems = async () => {
    setItemsLoading(true);
    try {
      const items = await api.getAllFoundItems(authToken);
      setFoundItems(Array.isArray(items) ? items : []);
    } catch (error) {
      console.error("Failed to fetch found items:", error);
      setFoundItems([]);
    } finally {
      setItemsLoading(false);
    }
  };

  return (
    <>
      <Navbar
        authToken={authToken}
        user={user}
        userRole={userRole}
        onLogout={onLogout}
        onSignInClick={onSignInClick}
        onRegisterClick={onRegisterClick}
        onRecordItemClick={onRecordItemClick}
      />
      <div className="max-w-7xl mx-auto pt-20 px-6">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Found Items</h1>
          <p className="text-gray-400 text-lg">
            Browse all items that have been found and reported to the system.
          </p>
        </div>

        <ItemsList
          items={foundItems}
          loading={itemsLoading}
          userRole={userRole}
          authToken={authToken}
        />
      </div>
    </>
  );
}
