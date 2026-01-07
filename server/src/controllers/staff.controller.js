import { db } from "../index.js";
import {
  foundItemsTable,
  claimsTable,
  usersTable,
  lostReportsTable,
} from "../models/index.js";
import { desc, eq } from "drizzle-orm";

const pickPublicFields = (item) => {
  const {
    id,
    item_type,
    date_found,
    location_found,
    public_details,
    image_urls,
    status,
    created_at,
    updated_at,
  } = item;
  return {
    id,
    item_type,
    date_found,
    location_found,
    public_details,
    image_urls,
    status,
    created_at,
    updated_at,
  };
};

const coerceToObject = (value) => {
  if (value && typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === "object" && !Array.isArray(parsed)
        ? parsed
        : null;
    } catch (err) {
      return null;
    }
  }

  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value;
  }

  return null;
};

export const addFoundItem = async (req, res) => {
  try {
    const staff_id = req.user?.id;
    if (!staff_id) return res.status(401).json({ message: "Unauthorized" });

    const {
      item_type,
      date_found,
      location_found,
      hidden_details,
      public_details,
      image_urls,
    } = req.body;

    // --- Validation ---
    if (
      !item_type ||
      !date_found ||
      !location_found ||
      !hidden_details ||
      !public_details
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const hiddenDetailsObj = coerceToObject(hidden_details);
    const publicDetailsObj = coerceToObject(public_details);

    if (!hiddenDetailsObj || !publicDetailsObj) {
      return res.status(400).json({
        message: "hidden_details and public_details must be JSON objects",
      });
    }

    const foundDate = new Date(date_found);
    if (isNaN(foundDate)) {
      return res.status(400).json({ message: "Invalid date_found" });
    }

    // --- Insert into DB ---
    const [newFoundItem] = await db
      .insert(foundItemsTable)
      .values({
        item_type,
        staff_id,
        date_found: foundDate,
        location_found,
        hidden_details: hiddenDetailsObj,
        public_details: publicDetailsObj,
        image_urls: image_urls || [],
      })
      .returning();

    // --- Send only public fields in response ---
    res.status(201).json({ foundItem: pickPublicFields(newFoundItem) });
  } catch (error) {
    console.error("Error adding found item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateFoundItem = async (req, res) => {
  const { itemId } = req.params;
  const staff_id = req.user?.id; // The staff member performing the update

  try {
    const {
      item_type,
      date_found,
      location_found,
      hidden_details,
      public_details,
      image_urls,
      status, // e.g., 'AVAILABLE', 'REJECTED', 'CLAIMED'
    } = req.body;

    // 1. Check if the item exists
    const [existingItem] = await db
      .select()
      .from(foundItemsTable)
      .where(eq(foundItemsTable.id, itemId));

    if (!existingItem) {
      return res.status(404).json({ message: "Found item not found" });
    }

    // 2. Business Logic: Prevent modification of items already 'CLAIMED'
    if (existingItem.status === "CLAIMED") {
      return res.status(400).json({
        message: "Cannot update an item that has already been claimed.",
      });
    }

    // 3. Prepare Update Object (Handling Coercion)
    const updateData = {
      updated_at: new Date(),
    };

    if (item_type) updateData.item_type = item_type;
    if (location_found) updateData.location_found = location_found;
    if (image_urls) updateData.image_urls = image_urls;
    if (status) updateData.status = status;

    if (date_found) {
      const parsedDate = new Date(date_found);
      if (!isNaN(parsedDate)) updateData.date_found = parsedDate;
    }

    if (hidden_details) {
      const obj = coerceToObject(hidden_details);
      if (obj) updateData.hidden_details = obj;
    }

    if (public_details) {
      const obj = coerceToObject(public_details);
      if (obj) updateData.public_details = obj;
    }

    // 4. Update in DB
    const [updatedItem] = await db
      .update(foundItemsTable)
      .set(updateData)
      .where(eq(foundItemsTable.id, itemId))
      .returning();

    // 5. Respond with masked data
    return res.status(200).json({
      message: "Item updated successfully",
      foundItem: pickPublicFields(updatedItem),
    });
  } catch (error) {
    console.error("Error updating found item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteFoundItem = async (req, res) => {
  const { itemId } = req.params;

  try {
    // Check if the item exists
    const [existingItem] = await db
      .select()
      .from(foundItemsTable)
      .where(eq(foundItemsTable.id, itemId));

    if (!existingItem) {
      return res.status(404).json({ message: "Found item not found" });
    }

    // Delete the item
    await db.delete(foundItemsTable).where(eq(foundItemsTable.id, itemId));

    return res.status(200).json({ message: "Found item deleted successfully" });
  } catch (error) {
    console.error("Error deleting found item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllClaims = async (req, res) => {
  try {
    // 1. Join Claims with Users (for email) and Found Items (for item type)
    const allClaims = await db
      .select({
        claim_id: claimsTable.id,
        status: claimsTable.status,
        match_percentage: claimsTable.match_percentage,
        created_at: claimsTable.created_at,
        // User Info
        claimant_email: usersTable.email,
        claimant_name: usersTable.full_name,
        // Item Info
        item_type: foundItemsTable.item_type,
        found_item_id: foundItemsTable.id,
      })
      .from(claimsTable)
      .innerJoin(usersTable, eq(claimsTable.user_id, usersTable.id))
      .innerJoin(
        foundItemsTable,
        eq(claimsTable.found_item_id, foundItemsTable.id)
      )
      .orderBy(desc(claimsTable.match_percentage)); // Put highest matches at the top!

    // 2. Return the list formatted for the Staff Table
    return res.status(200).json({
      success: true,
      count: allClaims.length,
      claims: allClaims.map((row) => ({
        id: row.claim_id,
        product_type: row.item_type,
        match_percentage: `${row.match_percentage}%`,
        user_email: row.claimant_email,
        status: row.status,
        date_submitted: row.created_at,
        found_item_id: row.found_item_id,
      })),
    });
  } catch (error) {
    console.error("Error fetching claims for staff:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getClaimDetails = async (req, res) => {
  try {
    const { claimId } = req.params;

    // 1. Fetch Claim joined with User and Found Item details
    const [claimDetails] = await db
      .select({
        claim: claimsTable,
        user: {
          name: usersTable.full_name,
          email: usersTable.email,
          phone: usersTable.phone,
        },
        found_item: foundItemsTable,
      })
      .from(claimsTable)
      .innerJoin(usersTable, eq(claimsTable.user_id, usersTable.id))
      .innerJoin(
        foundItemsTable,
        eq(claimsTable.found_item_id, foundItemsTable.id)
      )
      .where(eq(claimsTable.id, claimId));

    if (!claimDetails) {
      return res.status(404).json({ message: "Claim not found" });
    }

    // 2. Structured response for Staff UI
    return res.status(200).json({
      success: true,
      data: claimDetails,
    });
  } catch (error) {
    console.error("Error fetching claim details for staff:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateClaimStatus = async (req, res) => {
  const { claimId } = req.params;
  const { status } = req.body; // e.g., "APPROVED", "REJECTED", "COLLECTED"

  try {
    // 1. Fetch the claim to get the associated item ID
    const [claim] = await db
      .select()
      .from(claimsTable)
      .where(eq(claimsTable.id, claimId));

    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    // 2. Start a Database Transaction
    await db.transaction(async (tx) => {
      // A. Update the Claim Status
      await tx
        .update(claimsTable)
        .set({
          status,
          // You could add a staff_notes column to your schema for comments
          updated_at: new Date(),
        })
        .where(eq(claimsTable.id, claimId));

      // B. Business Logic: Sync Found Item Status
      if (status === "COLLECTED") {
        // When the item is physically picked up
        await tx
          .update(foundItemsTable)
          .set({
            status: "RETURNED",
            updated_at: new Date(),
          })
          .where(eq(foundItemsTable.id, claim.found_item_id));
      }
    });

    return res.status(200).json({
      success: true,
      message: `Claim successfully updated to ${status}`,
    });
  } catch (error) {
    console.error("Error updating claim status:", error);
    res
      .status(500)
      .json({ message: "Internal server error during transaction" });
  }
};

export const getAllReports = async (req, res) => {
  try {
    const staffId = req.user?.id;
    if (!staffId) return res.status(401).json({ message: "Unauthorized" });

    // 1. Fetch all reports joined with user info
    // REMOVED the [] destructuring so we get the full array
    const reports = await db
      .select({
        id: lostReportsTable.id,
        item_type: lostReportsTable.item_type,
        location_lost: lostReportsTable.location_lost,
        date_lost: lostReportsTable.date_lost,
        status: lostReportsTable.status,
        created_at: lostReportsTable.created_at,
        user_email: usersTable.email,
        user_name: usersTable.full_name,
      })
      .from(lostReportsTable)
      .innerJoin(usersTable, eq(lostReportsTable.user_id, usersTable.id))
      .orderBy(desc(lostReportsTable.created_at));

    return res.status(200).json({
      success: true,
      count: reports.length,
      reports: reports, // Return the whole array
    });
  } catch (error) {
    console.error("Error fetching lost reports:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getReportDetails = async (req, res) => {
  try {
    const reportId = req.params.reportId;
    console.log(reportId);

    // 2. Join with usersTable so Staff knows WHO to contact
    const [report] = await db
      .select({
        report: lostReportsTable,
        user: {
          name: usersTable.full_name,
          email: usersTable.email,
          phone: usersTable.phone, // Useful for staff to call the user
        },
      })
      .from(lostReportsTable)
      .leftJoin(usersTable, eq(lostReportsTable.user_id, usersTable.id))
      .where(eq(lostReportsTable.id, reportId));

    if (!report) {
      return res.status(404).json({ message: "Lost report not found" });
    }

    // 3. Structured response for Staff UI
    return res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error("Error fetching lost report details for staff:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
