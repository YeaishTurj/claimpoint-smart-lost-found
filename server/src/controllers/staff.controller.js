import { db, foundItemsTable } from "../index.js";
import { desc, eq } from "drizzle-orm";

// Helper: pick only public fields
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

export const addFoundItem = async (req, res) => {
  try {
    const staff_id = req.user?.id;
    if (!staff_id) return res.status(401).json({ message: "Unauthorized" });

    const {
      item_type,
      date_found,
      location_found,
      full_details,
      public_details,
      image_urls,
    } = req.body;

    // --- Validation ---
    if (
      !item_type ||
      !date_found ||
      !location_found ||
      !full_details ||
      !public_details
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const fullDetailsObj = coerceToObject(full_details);
    const publicDetailsObj = coerceToObject(public_details);

    if (!fullDetailsObj || !publicDetailsObj) {
      return res.status(400).json({
        message: "full_details and public_details must be JSON objects",
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
        full_details: fullDetailsObj,
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

export const getUserLostReports = async (req, res) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) return res.status(401).json({ message: "Unauthorized" });

    const lostReports = await db
      .select()
      .from(lostReportsTable)
      .orderBy(desc(lostReportsTable.created_at));

    res.status(200).json({ lostReports });
  } catch (error) {
    console.error("Error fetching lost reports:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
