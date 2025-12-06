import bcrypt from "bcryptjs";
import { db, usersTable } from "../index.js";
import "dotenv/config";
import { eq } from "drizzle-orm";

export const addStaff = async (req, res) => {
  const { email, full_name, phone } = req.body;

  const password = process.env.STAFF_DEFAULT_PASSWORD;

  try {
    // Check if staff already exists
    const [existingStaff] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    if (existingStaff) {
      return res.status(400).json({ message: "Staff already exists" });
    }

    // Hash default password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new staff object
    const newStaff = {
      email,
      password: hashedPassword,
      full_name,
      phone,
      role: "STAFF",
      email_verified: true,
    };

    // Insert staff into database
    await db.insert(usersTable).values(newStaff);

    res.status(201).json({
      message: "Staff added successfully",
      staff: { email, full_name, phone },
    });
  } catch (error) {
    console.error("Error adding staff:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
