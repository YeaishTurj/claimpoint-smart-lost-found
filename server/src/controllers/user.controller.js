import {
  db,
  lostReportsTable,
  claimsTable,
  foundItemsTable,
} from "../index.js";
import { eq, desc } from "drizzle-orm";

// Ensure details are stored as JSON objects (handle stringified payloads too)
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
    if (!user_id) return res.status(401).json({ message: "Unauthorized" });

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
        status: "open",
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

export const getUserLostReports = async (req, res) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) return res.status(401).json({ message: "Unauthorized" });

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

export const getUserLostReportDetails = async (req, res) => {
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

export const updateUserLostReport = async (req, res) => {
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

export const deleteUserLostReport = async (req, res) => {
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

export const userClaimItem = async (req, res) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) return res.status(401).json({ message: "Unauthorized" });

    const claimedItemId = req.params.id;
    if (!claimedItemId || typeof claimedItemId !== "string") {
      return res.status(400).json({ message: "Invalid item ID" });
    }

    const { claim_details, image_urls } = req.body;
    const claimDetailsObj = coerceToObject(claim_details);
    if (!claimDetailsObj) {
      return res.status(400).json({ message: "Invalid claim details format" });
    }

    // Ensure image_urls is an array
    const imageUrlsArr = Array.isArray(image_urls) ? image_urls : [];

    const [newClaim] = await db
      .insert(claimsTable)
      .values({
        user_id,
        found_item_id: claimedItemId,
        claim_details: claimDetailsObj,
        image_urls: imageUrlsArr,
        match_percentage: 0,
        status: "pending",
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning();

    res
      .status(201)
      .json({ message: "Item claim submitted successfully", claim: newClaim });
  } catch (error) {
    console.error("Error submitting item claim:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllClaimsByUser = async (req, res) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) return res.status(401).json({ message: "Unauthorized" });

    const claims = await db
      .select()
      .from(claimsTable)
      .where(eq(claimsTable.user_id, user_id))
      .leftJoin(
        foundItemsTable,
        eq(claimsTable.found_item_id, foundItemsTable.id)
      )
      .orderBy(desc(claimsTable.created_at));

    // Format claims for frontend

    const defaultImage = "https://via.placeholder.com/80x80?text=No+Image";
    const formattedClaims = claims.map((row) => ({
      id: row.claims.id,
      item_type: row.found_items?.item_type || `Claim #${row.claims.id}`,
      displayImage: row.found_items?.image_urls?.[0] || defaultImage,
      image_urls: row.claims.image_urls,
      status: row.claims.status,
      match_percentage: row.claims.match_percentage,
    }));

    res.status(200).json({ claims: formattedClaims });
  } catch (error) {
    console.error("Error fetching user claims:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserClaimDetails = async (req, res) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) return res.status(401).json({ message: "Unauthorized" });

    const claimId = req.params.id;
    if (!claimId || typeof claimId !== "string") {
      return res.status(400).json({ message: "Invalid claim ID" });
    }

    const claim = await db
      .select()
      .from(claimsTable)
      .where(eq(claimsTable.id, claimId), eq(claimsTable.user_id, user_id))
      .limit(1)
      .then((rows) => rows[0]);

    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    res.status(200).json({ claim });
  } catch (error) {
    console.error("Error fetching claim details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUserClaim = async (req, res) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) return res.status(401).json({ message: "Unauthorized" });

    const claimId = req.params.id;
    if (!claimId || typeof claimId !== "string") {
      return res.status(400).json({ message: "Invalid claim ID" });
    }

    const existingClaim = await db
      .select()
      .from(claimsTable)
      .where(eq(claimsTable.id, claimId), eq(claimsTable.user_id, user_id))
      .limit(1)
      .then((rows) => rows[0]);

    if (!existingClaim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    await db
      .delete(claimsTable)
      .where(eq(claimsTable.id, claimId), eq(claimsTable.user_id, user_id));

    res.status(200).json({ message: "Claim deleted successfully" });
  } catch (error) {
    console.error("Error deleting claim:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUserClaim = async (req, res) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) return res.status(401).json({ message: "Unauthorized" });

    const claimId = req.params.id;
    if (!claimId || typeof claimId !== "string") {
      return res.status(400).json({ message: "Invalid claim ID" });
    }

    const { claim_details, image_urls } = req.body;

    const existingClaim = await db
      .select()
      .from(claimsTable)
      .where(eq(claimsTable.id, claimId), eq(claimsTable.user_id, user_id))
      .limit(1)
      .then((rows) => rows[0]);

    if (!existingClaim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    const updatedFields = {};

    if (claim_details) {
      const claimDetailsObj = coerceToObject(claim_details);
      if (!claimDetailsObj) {
        return res
          .status(400)
          .json({ message: "Invalid claim details format" });
      }
      updatedFields.claim_details = claimDetailsObj;
    }

    if (image_urls) {
      updatedFields.image_urls = Array.isArray(image_urls) ? image_urls : [];
    }

    updatedFields.updated_at = new Date();

    const [updatedClaim] = await db
      .update(claimsTable)
      .set(updatedFields)
      .where(eq(claimsTable.id, claimId), eq(claimsTable.user_id, user_id))
      .returning();

    res.status(200).json({
      message: "Claim updated successfully",
      claim: updatedClaim,
    });
  } catch (error) {
    console.error("Error updating claim:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
