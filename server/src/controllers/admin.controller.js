import bcrypt from "bcryptjs";
import { db, usersTable } from "../index.js";
import "dotenv/config";
import { eq, or } from "drizzle-orm";

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

export const getAllUsers = async (req, res) => {
  try {
    const users = await db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        full_name: usersTable.full_name,
        phone: usersTable.phone,
        role: usersTable.role,
        email_verified: usersTable.email_verified,
        is_active: usersTable.is_active,
        created_at: usersTable.created_at,
      })
      .from(usersTable)
      .where(or(eq(usersTable.role, "USER"), eq(usersTable.role, "STAFF")));

    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deactivateUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await db
      .update(usersTable)
      .set({ is_active: false })
      .where(eq(usersTable.id, userId));

    if (result.count === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deactivated successfully" });
  } catch (error) {
    console.error("Error deactivating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const activateUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await db
      .update(usersTable)
      .set({ is_active: true })
      .where(eq(usersTable.id, userId));

    if (result.count === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User activated successfully" });
  } catch (error) {
    console.error("Error activating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
