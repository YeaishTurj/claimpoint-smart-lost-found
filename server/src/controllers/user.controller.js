import { db, lostReportsTable } from "../index.js";
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

export const ReportLostItem = async (req, res) => {
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

export const GetUserLostReports = async (req, res) => {
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
