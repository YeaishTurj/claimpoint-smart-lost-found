import { db } from "../index.js";
import {
  foundItemsTable,
  claimsTable,
  usersTable,
  lostReportsTable,
  itemMatchesTable,
} from "../models/index.js";
import { sendClaimStatusEmail } from "../../services/email.js";
import { generateClaimStatusTemplate } from "../utils/emailTemplates.js";
import { runAutoMatch } from "../../services/autoMatchService.js";
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

    // 1. Validation
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

    // 2. Insert into DB
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

    // 3. TRIGGER AUTO-MATCHING
    // We run this after the item is saved.
    // The AI will scan lostReportsTable for similar items.
    const potentialMatches = await runAutoMatch(newFoundItem);

    console.log(
      `✅ Item added. AI found ${potentialMatches.length} suggested matches.`
    );

    // 4. Response
    res.status(201).json({
      message: "Found item added and cross-checked with lost reports",
      foundItem: pickPublicFields(newFoundItem),
      match_count: potentialMatches.length,
      suggested_matches: potentialMatches, // Returns array of { reportId, score }
    });
  } catch (error) {
    console.error("Error adding found item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const approveAiMatch = async (req, res) => {
  const { matchId } = req.params; // ID from item_matches table

  try {
    // 1. Get the match details + User email
    const [matchData] = await db
      .select({
        match: itemMatchesTable,
        user: usersTable,
        reportId: lostReportsTable.id,
      })
      .from(itemMatchesTable)
      .innerJoin(
        lostReportsTable,
        eq(itemMatchesTable.lost_report_id, lostReportsTable.id)
      )
      .innerJoin(usersTable, eq(lostReportsTable.user_id, usersTable.id))
      .where(eq(itemMatchesTable.id, matchId));

    if (!matchData)
      return res.status(404).json({ message: "Match suggestion not found" });

    await db.transaction(async (tx) => {
      // 2. Update Match Status
      await tx
        .update(itemMatchesTable)
        .set({ status: "APPROVED" })
        .where(eq(itemMatchesTable.id, matchId));

      // 3. Update Lost Report Status to 'MATCHED'
      await tx
        .update(lostReportsTable)
        .set({ status: "MATCHED" })
        .where(eq(lostReportsTable.id, matchData.reportId));
    });

    // 4. Send Email to User
    await sendClaimStatusEmail(
      matchData.user.email,
      "Great News: We found a match for your lost item!",
      `Hi ${matchData.user.full_name}, our staff has verified a match for your report. Please visit the office to collect it.`
    );

    res
      .status(200)
      .json({ success: true, message: "Match approved and user notified." });
  } catch (error) {
    res.status(500).json({ message: "Approval failed" });
  }
};

export const markAsCollected = async (req, res) => {
  const { matchId } = req.params;

  try {
    const [matchData] = await db
      .select()
      .from(itemMatchesTable)
      .where(eq(itemMatchesTable.id, matchId));

    await db.transaction(async (tx) => {
      // Update Report to RESOLVED
      await tx
        .update(lostReportsTable)
        .set({ status: "RESOLVED" })
        .where(eq(lostReportsTable.id, matchData.lost_report_id));

      // Update Found Item to RETURNED
      await tx
        .update(foundItemsTable)
        .set({ status: "RETURNED" })
        .where(eq(foundItemsTable.id, matchData.found_item_id));
    });

    res.status(200).json({ message: "Item successfully returned to owner." });
  } catch (error) {
    res.status(500).json({ message: "Error resolving match" });
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

    // 5. TRIGGER AUTO-MATCHING (similar to addFoundItem)
    const potentialMatches = await runAutoMatch(updatedItem);

    console.log(
      `✅ Item updated. AI found ${potentialMatches.length} suggested matches.`
    );

    // 6. Respond with masked data
    return res.status(200).json({
      message: "Item updated successfully",
      foundItem: pickPublicFields(updatedItem),
      match_count: potentialMatches.length,
      suggested_matches: potentialMatches, // Returns array of { reportId, score }
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

    // 3. Send Email Notification to the User about Claim Status Update
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, claim.user_id));

    if (user) {
      const emailBody = generateClaimStatusTemplate(
        user.full_name,
        status,
        claimId
      );

      await sendClaimStatusEmail(
        user.email,
        `Your Claim #${claimId} Status Update`,
        emailBody
      );
    }

    // 4. Respond to Staff Client

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

// Get all matches (for staff dashboard)
export const getAllMatches = async (req, res) => {
  try {
    const staff_id = req.user?.id;
    if (!staff_id) return res.status(401).json({ message: "Unauthorized" });

    // Get all matches where the found_item was created by this staff member
    const matches = await db
      .select({
        match_id: itemMatchesTable.id,
        match_score: itemMatchesTable.match_score,
        match_status: itemMatchesTable.status,
        match_created_at: itemMatchesTable.created_at,
        // Lost report info
        report_id: lostReportsTable.id,
        report_item_type: lostReportsTable.item_type,
        report_location: lostReportsTable.location_lost,
        report_date: lostReportsTable.date_lost,
        report_user_id: lostReportsTable.user_id,
        report_status: lostReportsTable.status,
        report_details: lostReportsTable.report_details,
        // Found item info
        found_item_id: foundItemsTable.id,
        found_item_type: foundItemsTable.item_type,
        found_item_location: foundItemsTable.location_found,
        found_item_date: foundItemsTable.date_found,
        found_public_details: foundItemsTable.public_details,
        found_hidden_details: foundItemsTable.hidden_details,
      })
      .from(itemMatchesTable)
      .innerJoin(
        lostReportsTable,
        eq(itemMatchesTable.lost_report_id, lostReportsTable.id)
      )
      .innerJoin(
        foundItemsTable,
        eq(itemMatchesTable.found_item_id, foundItemsTable.id)
      )
      .where(eq(foundItemsTable.staff_id, staff_id))
      .orderBy(desc(itemMatchesTable.created_at));

    return res.status(200).json({
      success: true,
      count: matches.length,
      matches,
    });
  } catch (error) {
    console.error("Error fetching matches:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Approve a match
export const approveMatch = async (req, res) => {
  try {
    const staff_id = req.user?.id;
    const { matchId } = req.params;

    if (!staff_id) return res.status(401).json({ message: "Unauthorized" });

    // 1. Get the match
    const [match] = await db
      .select()
      .from(itemMatchesTable)
      .where(eq(itemMatchesTable.id, matchId));

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    // 2. Verify staff owns the found item
    const [foundItem] = await db
      .select()
      .from(foundItemsTable)
      .where(eq(foundItemsTable.id, match.found_item_id));

    if (foundItem.staff_id !== staff_id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // 3. Get the lost report and user
    const [lostReport] = await db
      .select()
      .from(lostReportsTable)
      .where(eq(lostReportsTable.id, match.lost_report_id));

    const [reportUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, lostReport.user_id));

    // 4. Update match status to APPROVED
    await db
      .update(itemMatchesTable)
      .set({ status: "APPROVED" })
      .where(eq(itemMatchesTable.id, matchId));

    // 5. Update report status to MATCHED
    await db
      .update(lostReportsTable)
      .set({ status: "MATCHED" })
      .where(eq(lostReportsTable.id, match.lost_report_id));

    // 6. Send email to user
    if (reportUser?.email) {
      try {
        await sendClaimStatusEmail(
          reportUser.email,
          reportUser.full_name,
          "MATCHED",
          {
            itemType: foundItem.item_type,
            matchPercentage: match.match_score,
            location: foundItem.location_found,
          }
        );
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
        // Don't fail the request if email fails
      }
    }

    return res.status(200).json({
      success: true,
      message: "Match approved successfully. User notified.",
      match: {
        id: match.id,
        status: "APPROVED",
      },
    });
  } catch (error) {
    console.error("Error approving match:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Reject a match
export const rejectMatch = async (req, res) => {
  try {
    const staff_id = req.user?.id;
    const { matchId } = req.params;

    if (!staff_id) return res.status(401).json({ message: "Unauthorized" });

    // 1. Get the match
    const [match] = await db
      .select()
      .from(itemMatchesTable)
      .where(eq(itemMatchesTable.id, matchId));

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    // 2. Verify staff owns the found item
    const [foundItem] = await db
      .select()
      .from(foundItemsTable)
      .where(eq(foundItemsTable.id, match.found_item_id));

    if (foundItem.staff_id !== staff_id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // 3. Update match status to REJECTED
    await db
      .update(itemMatchesTable)
      .set({ status: "REJECTED" })
      .where(eq(itemMatchesTable.id, matchId));

    return res.status(200).json({
      success: true,
      message: "Match rejected successfully.",
      match: {
        id: match.id,
        status: "REJECTED",
      },
    });
  } catch (error) {
    console.error("Error rejecting match:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Mark a matched item as collected (for resolved status)
export const markItemCollected = async (req, res) => {
  try {
    const staff_id = req.user?.id;
    const { matchId } = req.params;

    if (!staff_id) return res.status(401).json({ message: "Unauthorized" });

    // 1. Get the match
    const [match] = await db
      .select()
      .from(itemMatchesTable)
      .where(eq(itemMatchesTable.id, matchId));

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    // 2. Verify staff owns the found item and match is approved
    const [foundItem] = await db
      .select()
      .from(foundItemsTable)
      .where(eq(foundItemsTable.id, match.found_item_id));

    if (foundItem.staff_id !== staff_id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (match.status !== "APPROVED") {
      return res
        .status(400)
        .json({ message: "Only approved matches can be marked as collected" });
    }

    // 3. Update report status to RESOLVED
    await db
      .update(lostReportsTable)
      .set({ status: "RESOLVED" })
      .where(eq(lostReportsTable.id, match.lost_report_id));

    // 4. Update found item status to RETURNED
    await db
      .update(foundItemsTable)
      .set({ status: "RETURNED" })
      .where(eq(foundItemsTable.id, match.found_item_id));

    // 5. Get user to send confirmation email
    const [lostReport] = await db
      .select()
      .from(lostReportsTable)
      .where(eq(lostReportsTable.id, match.lost_report_id));

    const [reportUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, lostReport.user_id));

    if (reportUser?.email) {
      try {
        await sendClaimStatusEmail(
          reportUser.email,
          reportUser.full_name,
          "RESOLVED",
          {
            itemType: foundItem.item_type,
            message: "Your item has been marked as collected.",
          }
        );
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Item marked as collected. Report resolved.",
      report: {
        id: lostReport.id,
        status: "RESOLVED",
      },
    });
  } catch (error) {
    console.error("Error marking item collected:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
