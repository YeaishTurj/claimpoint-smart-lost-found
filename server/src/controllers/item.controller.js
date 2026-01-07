import { db } from "../index.js";
import { foundItemsTable, lostReportsTable } from "../models/index.js";
import { desc } from "drizzle-orm";
import { eq } from "drizzle-orm";

export const getAllFoundItems = async (req, res) => {
  try {
    const userRole = req.user?.role;
    const isPrivileged = userRole === "STAFF" || userRole === "ADMIN";

    let items;

    if (isPrivileged) {
      // 1. Staff/Admin: Fetch everything (Full access)
      items = await db
        .select()
        .from(foundItemsTable)
        .orderBy(desc(foundItemsTable.created_at));
    } else {
      // 2. Public/User: Fetch ONLY public columns and ONLY 'AVAILABLE' items
      // This is faster and more secure because hidden_details never leaves the DB
      items = await db
        .select({
          id: foundItemsTable.id,
          item_type: foundItemsTable.item_type,
          date_found: foundItemsTable.date_found,
          location_found: foundItemsTable.location_found,
          public_details: foundItemsTable.public_details,
          image_urls: foundItemsTable.image_urls,
          status: foundItemsTable.status,
          created_at: foundItemsTable.created_at,
        })
        .from(foundItemsTable)
        .where(eq(foundItemsTable.status, "FOUND")) // Filter in DB
        .orderBy(desc(foundItemsTable.created_at));
    }

    return res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    console.error("Error fetching found items:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getFoundItemById = async (req, res) => {
  const { id } = req.params;
  const userRole = req.user?.role;
  const isPrivileged = userRole === "STAFF" || userRole === "ADMIN";

  try {
    let foundItem;

    if (isPrivileged) {
      // 1. Staff/Admin: Get the full row (including hidden_details)
      [foundItem] = await db
        .select()
        .from(foundItemsTable)
        .where(eq(foundItemsTable.id, id));
    } else {
      // 2. Public/User: Get ONLY public columns
      // Note: We also usually want to hide items that aren't 'AVAILABLE' from the public
      [foundItem] = await db
        .select({
          id: foundItemsTable.id,
          item_type: foundItemsTable.item_type,
          date_found: foundItemsTable.date_found,
          location_found: foundItemsTable.location_found,
          public_details: foundItemsTable.public_details,
          image_urls: foundItemsTable.image_urls,
          status: foundItemsTable.status,
          created_at: foundItemsTable.created_at,
        })
        .from(foundItemsTable)
        .where(eq(foundItemsTable.id, id));

      // Security Check: If a public user tries to guess the ID of a 'CLAIMED' item,
      // we might want to return 404 or a "restricted" message.
      if (foundItem && foundItem.status !== "FOUND") {
        return res.status(403).json({
          message: "This item is no longer available for public view.",
        });
      }
    }

    if (!foundItem) {
      return res.status(404).json({ message: "Found item not found" });
    }

    return res.status(200).json({ success: true, data: foundItem });
  } catch (error) {
    console.error("Error fetching found item by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
