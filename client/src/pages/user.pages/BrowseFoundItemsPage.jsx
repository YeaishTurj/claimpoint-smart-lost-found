import { ItemsList } from "../../components/ItemsList";
import { useState, useEffect } from "react";
import api from "../../services/api";

export function BrowseFoundItemsPage({ authToken, userRole }) {
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
      <div className="max-w-7xl mx-auto pt-20 px-6">
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
