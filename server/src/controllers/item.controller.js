import { db, foundItemsTable, lostReportsTable } from "../index.js";
import { eq } from "drizzle-orm";

export const getAllFoundItems = async (req, res) => {
  try {
    const userRole = req.user?.role;
    const foundItems = await db.select().from(foundItemsTable);

    // Filter response based on user role
    if (!req.user || userRole === "USER") {
      // Public users see only public details
      const publicItems = foundItems.map((item) => ({
        id: item.id,
        item_type: item.item_type,
        date_found: item.date_found,
        location_found: item.location_found,
        public_details: item.public_details,
        image_urls: item.image_urls,
        status: item.status,
        created_at: item.created_at,
      }));
      return res.status(200).json(publicItems);
    }

    // STAFF and ADMIN see all details
    res.status(200).json(foundItems);
  } catch (error) {
    console.error("Error fetching found items:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getFoundItemById = async (req, res) => {
  const { id } = req.params;
  try {
    const userRole = req.user?.role;
    const [foundItem] = await db
      .select()
      .from(foundItemsTable)
      .where(eq(foundItemsTable.id, id));

    if (!foundItem) {
      return res.status(404).json({ error: "Found item not found" });
    }

    // Filter response based on user role
    if (!req.user || userRole === "USER") {
      // Public users see only public details
      const publicItem = {
        id: foundItem.id,
        item_type: foundItem.item_type,
        date_found: foundItem.date_found,
        location_found: foundItem.location_found,
        public_details: foundItem.public_details,
        image_urls: foundItem.image_urls,
        status: foundItem.status,
        created_at: foundItem.created_at,
      };
      return res.status(200).json(publicItem);
    }

    // STAFF and ADMIN see all details
    res.status(200).json(foundItem);
  } catch (error) {
    console.error("Error fetching found item by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getLostReportById = async (req, res) => {
  try {
    const { id } = req.params;
    try{
      const userRole = req.user?.role;
      if(!userRole){
        return res.status(401).json({ message: "Unauthorized" });
      }
      const [lostReports] = await db
        .select()
        .from(lostReportsTable)
        .where(eq(lostReportsTable.id, id));
  
      if (!lostReports) {
        return res.status(404).json({ message: "Lost report not found" });
      }
  
      // Filter response based on user role
      if (userRole === "USER") {
        // Regular users can only access their own reports
        if (lostReports.user_id !== req.user.id) {
          return res.status(403).json({ message: "Forbidden" });
        }
      }
  
      res.status(200).json(lostReports);
    }
    catch (error) {
      console.error("Error fetching lost report by ID:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } catch (error) {
    console.error("Error fetching lost report by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};