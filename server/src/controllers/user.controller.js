import { db } from "../index.js";
import { eq, desc, and } from "drizzle-orm";
import {
  lostReportsTable,
  claimsTable,
  foundItemsTable,
} from "../models/index.js";

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

export const reportLostItem = async (req, res) => {
  try {
    const user_id = req.user?.id;
    if (!user_id)
      return res.status(401).json({ message: "Your are not logged in" });

    const { item_type, report_details, date_lost, location_lost, image_urls } =
      req.body;

    // Insert new lost report
    if (!item_type || !report_details || !date_lost || !location_lost) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const reportDetailsObj = coerceToObject(report_details);
    if (!reportDetailsObj) {
      return res.status(400).json({ message: "Invalid report details format" });
    }

    // Parse date_lost ISO string to Date object
    const parsedDate = new Date(date_lost);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "Invalid date_lost format" });
    }

    // Ensure image_urls is an array
    const imageUrls = Array.isArray(image_urls) ? image_urls : [];

    const [newReport] = await db
      .insert(lostReportsTable)
      .values({
        user_id,
        item_type,
        report_details: reportDetailsObj,
        date_lost: parsedDate,
        location_lost,
        image_urls: imageUrls,
        status: "OPEN",
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning();

    res
      .status(201)
      .json({ message: "Lost item reported successfully", report: newReport });
  } catch (error) {
    console.error("Error reporting lost item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyReports = async (req, res) => {
  try {
    const user_id = req.user?.id;
    if (!user_id)
      return res.status(401).json({ message: "You are not logged in" });

    const lostReports = await db
      .select()
      .from(lostReportsTable)
      .where(eq(lostReportsTable.user_id, user_id))
      .orderBy(desc(lostReportsTable.created_at));

    res.status(200).json({ lostReports });
  } catch (error) {
    console.error("Error fetching user lost reports:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyReportDetails = async (req, res) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) return res.status(401).json({ message: "Unauthorized" });

    const reportId = req.params.id;
    if (!reportId || typeof reportId !== "string") {
      return res.status(400).json({ message: "Invalid report ID" });
    }

    const lostReport = await db
      .select()
      .from(lostReportsTable)
      .where(
        eq(lostReportsTable.id, reportId),
        eq(lostReportsTable.user_id, user_id)
      )
      .limit(1)
      .then((rows) => rows[0]);

    if (!lostReport) {
      return res.status(404).json({ message: "Lost report not found" });
    }

    res.status(200).json({ lostReport });
  } catch (error) {
    console.error("Error fetching lost report details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateMyReport = async (req, res) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) return res.status(401).json({ message: "Unauthorized" });

    const reportId = req.params.id;
    if (!reportId || typeof reportId !== "string") {
      return res.status(400).json({ message: "Invalid report ID" });
    }

    const { item_type, report_details, date_lost, location_lost, image_urls } =
      req.body;

    const existingReport = await db
      .select()
      .from(lostReportsTable)
      .where(
        eq(lostReportsTable.id, reportId),
        eq(lostReportsTable.user_id, user_id)
      )
      .limit(1)
      .then((rows) => rows[0]);

    if (!existingReport) {
      return res.status(404).json({ message: "Lost report not found" });
    }

    if (existingReport.status !== "OPEN") {
      return res.status(400).json({
        message: "Cannot edit a report that is already resolved or matched.",
      });
    }

    const updatedFields = {};

    if (item_type) updatedFields.item_type = item_type;

    if (report_details) {
      const reportDetailsObj = coerceToObject(report_details);
      if (!reportDetailsObj) {
        return res
          .status(400)
          .json({ message: "Invalid report details format" });
      }
      updatedFields.report_details = reportDetailsObj;
    }

    if (date_lost) {
      const parsedDate = new Date(date_lost);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ message: "Invalid date_lost format" });
      }
      updatedFields.date_lost = parsedDate;
    }

    if (location_lost) updatedFields.location_lost = location_lost;

    if (image_urls) {
      updatedFields.image_urls = Array.isArray(image_urls) ? image_urls : [];
    }

    updatedFields.updated_at = new Date();

    const [updatedReport] = await db
      .update(lostReportsTable)
      .set(updatedFields)
      .where(
        eq(lostReportsTable.id, reportId),
        eq(lostReportsTable.user_id, user_id)
      )
      .returning();

    res.status(200).json({
      message: "Lost report updated successfully",
      report: updatedReport,
    });
  } catch (error) {
    console.error("Error updating lost report:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteMyReport = async (req, res) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) return res.status(401).json({ message: "Unauthorized" });

    const reportId = req.params.id;
    if (!reportId || typeof reportId !== "string") {
      return res.status(400).json({ message: "Invalid report ID" });
    }

    const existingReport = await db
      .select()
      .from(lostReportsTable)
      .where(
        eq(lostReportsTable.id, reportId),
        eq(lostReportsTable.user_id, user_id)
      )
      .limit(1)
      .then((rows) => rows[0]);

    if (!existingReport) {
      return res.status(404).json({ message: "Lost report not found" });
    }

    await db
      .delete(lostReportsTable)
      .where(
        eq(lostReportsTable.id, reportId),
        eq(lostReportsTable.user_id, user_id)
      );

    res.status(200).json({ message: "Lost report deleted successfully" });
  } catch (error) {
    console.error("Error deleting lost report:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const myClaimSubmit = async (req, res) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) return res.status(401).json({ message: "Unauthorized" });
    const claimedItemId = req.params.id;
    const { user_provided_proof, image_urls } = req.body; // user_provided_proof is their explanation

    // 1. Fetch the item to get its public details
    const [item] = await db
      .select()
      .from(foundItemsTable)
      .where(eq(foundItemsTable.id, claimedItemId));

    if (!item) return res.status(404).json({ message: "Item not found" });
    if (item.status !== "FOUND")
      return res.status(400).json({ message: "Item is unavailable" });

    // 2. Prevent Duplicate Claims
    const [existingClaim] = await db
      .select()
      .from(claimsTable)
      .where(
        and(
          eq(claimsTable.found_item_id, claimedItemId),
          eq(claimsTable.user_id, user_id)
        )
      );

    if (existingClaim)
      return res.status(400).json({ message: "Already claimed" });

    // 3. Construct the claim_details object
    // We combine what the user said with a snapshot of the public info
    const claimDetailsObj = {
      user_proof: user_provided_proof,
      item_snapshot: item.public_details, // Captures the public details at time of claim
    };

    // 4. Insert
    const [newClaim] = await db
      .insert(claimsTable)
      .values({
        user_id,
        found_item_id: claimedItemId,
        claim_details: claimDetailsObj, // Now contains both sets of info
        image_urls: Array.isArray(image_urls) ? image_urls : [],
        status: "PENDING",
      })
      .returning();

    return res
      .status(201)
      .json({ message: "Claim submitted", claim: newClaim });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyClaims = async (req, res) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) return res.status(401).json({ message: "Unauthorized" });

    // 1. Fetch claims with a join, but select ONLY safe columns from foundItemsTable
    const claims = await db
      .select({
        claim_id: claimsTable.id,
        status: claimsTable.status,
        match_percentage: claimsTable.match_percentage,
        created_at: claimsTable.created_at,
        // Only public info from the item
        item_type: foundItemsTable.item_type,
        item_images: foundItemsTable.image_urls,
        item_location: foundItemsTable.location_found,
      })
      .from(claimsTable)
      .leftJoin(
        foundItemsTable,
        eq(claimsTable.found_item_id, foundItemsTable.id)
      )
      .where(eq(claimsTable.user_id, user_id))
      .orderBy(desc(claimsTable.created_at));

    // 2. Format the data for a clean Frontend experience
    const defaultImage = "https://via.placeholder.com/150?text=No+Image";

    const formattedClaims = claims.map((row) => ({
      id: row.claim_id,
      item_name: row.item_type || "Unknown Item",
      location: row.item_location || "N/A",
      // Use the first image from the found item as the thumbnail
      thumbnail:
        Array.isArray(row.item_images) && row.item_images.length > 0
          ? row.item_images[0]
          : defaultImage,
      status: row.status,
      match_score: row.match_percentage,
      date_submitted: row.created_at,
    }));

    return res.status(200).json({
      success: true,
      count: formattedClaims.length,
      claims: formattedClaims,
    });
  } catch (error) {
    console.error("Error fetching user claims:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyClaimDetails = async (req, res) => {
  try {
    const user_id = req.user?.id;
    const claimId = req.params.id;

    // 1. Fetch claim joined with limited public item data
    const [result] = await db
      .select({
        // All claim fields
        claim: claimsTable,
        // Only public item fields
        item_type: foundItemsTable.item_type,
        location_found: foundItemsTable.location_found,
        date_found: foundItemsTable.date_found,
        public_details: foundItemsTable.public_details,
        item_images: foundItemsTable.image_urls,
      })
      .from(claimsTable)
      .leftJoin(
        foundItemsTable,
        eq(claimsTable.found_item_id, foundItemsTable.id)
      )
      .where(
        and(eq(claimsTable.id, claimId), eq(claimsTable.user_id, user_id))
      );

    if (!result) {
      return res.status(404).json({ message: "Claim not found" });
    }

    // 2. Return a structured response
    // We group item info together so the frontend can easily display it
    return res.status(200).json({
      success: true,
      claim: {
        ...result.claim,
        item_info: {
          type: result.item_type,
          location: result.location_found,
          date: result.date_found,
          public_details: result.public_details,
          images: result.item_images,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching claim details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteMyClaim = async (req, res) => {
  try {
    const user_id = req.user?.id;
    const claimId = req.params.id;

    // 1. Fetch the claim and verify ownership
    const [existingClaim] = await db
      .select()
      .from(claimsTable)
      .where(
        and(eq(claimsTable.id, claimId), eq(claimsTable.user_id, user_id))
      );

    if (!existingClaim) {
      return res
        .status(404)
        .json({ message: "Claim not found or unauthorized" });
    }

    // 2. CRITICAL: Only allow deletion if the status is PENDING
    // This protects the "audit trail" once a staff member has made a decision
    if (existingClaim.status !== "PENDING") {
      return res.status(400).json({
        message: `You cannot delete a claim that has already been ${existingClaim.status.toLowerCase()}.`,
      });
    }

    // 3. Perform the deletion
    await db.delete(claimsTable).where(eq(claimsTable.id, claimId));

    return res.status(200).json({
      message: "Claim cancelled successfully.",
    });
  } catch (error) {
    console.error("Error deleting claim:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
