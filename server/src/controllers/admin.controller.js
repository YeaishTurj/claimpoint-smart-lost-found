import bcrypt from "bcryptjs";
import { db } from "../index.js";
import { usersTable } from "../models/index.js";
import "dotenv/config";
import { eq, or, and, ne } from "drizzle-orm";

export const addStaff = async (req, res) => {
  const { email, full_name, phone } = req.body;

  // Validate required fields
  if (!email || !full_name) {
    return res.status(400).json({
      message: "Email and full name are required",
    });
  }

  const password = process.env.STAFF_DEFAULT_PASSWORD;

  if (!password) {
    return res.status(500).json({
      message: "Staff default password not configured in environment",
    });
  }

  try {
    // Check if staff already exists
    const [existingStaff] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (existingStaff) {
      return res.status(400).json({
        message: "A user with this email already exists",
      });
    }

    // Hash default password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new staff object
    const newStaff = {
      email,
      password: hashedPassword,
      full_name,
      phone: phone || null,
      role: "STAFF",
      email_verified: true, // Staff accounts are pre-verified
      is_active: true,
    };

    // Insert staff into database
    const [createdStaff] = await db
      .insert(usersTable)
      .values(newStaff)
      .returning({
        id: usersTable.id,
        email: usersTable.email,
        full_name: usersTable.full_name,
        phone: usersTable.phone,
        role: usersTable.role,
        created_at: usersTable.created_at,
      });

    res.status(201).json({
      message: "Staff added successfully",
      staff: createdStaff,
    });
  } catch (error) {
    console.error("Error adding staff:", error);
    res.status(500).json({
      message: "Internal server error while adding staff",
    });
  }
};

export const getStaffById = async (req, res) => {
  try {
    const { staffId } = req.params;
    const [staff] = await db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        full_name: usersTable.full_name,
        phone: usersTable.phone,
        email_verified: usersTable.email_verified,
        is_active: usersTable.is_active,
        created_at: usersTable.created_at,
      })
      .from(usersTable)
      .where(and(eq(usersTable.id, staffId), eq(usersTable.role, "STAFF")));

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res.status(200).json({ staff });
  } catch (error) {
    console.error("Error fetching staff by ID:", error);
    res.status(500).json({
      message: "Internal server error while fetching staff",
    });
  }
};

export const updateStaff = async (req, res) => {
  try {
    const { staffId } = req.params;
    const { full_name, phone } = req.body;
    console.log(staffId);
    // Find staff first
    const [staff] = await db
      .select()
      .from(usersTable)
      .where(and(eq(usersTable.id, staffId), eq(usersTable.role, "STAFF")));

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    // Update staff details
    await db
      .update(usersTable)
      .set({
        full_name: full_name || staff.full_name,
        phone: phone || staff.phone,
        updated_at: new Date(),
      })
      .where(eq(usersTable.id, staffId));

    res.status(200).json({
      message: "Staff updated successfully",
    });
  } catch (error) {
    console.error("Error updating staff:", error);
    res.status(500).json({
      message: "Internal server error while updating staff",
    });
  }
};

export const getAllStaffs = async (req, res) => {
  try {
    const staff = await db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        full_name: usersTable.full_name,
        email_verified: usersTable.email_verified,
        is_active: usersTable.is_active,
        created_at: usersTable.created_at,
      })
      .from(usersTable)
      .where(eq(usersTable.role, "STAFF"))
      .orderBy(usersTable.created_at);

    res.status(200).json({ staff });
  } catch (error) {
    console.error("Error fetching staff:", error);
    res.status(500).json({
      message: "Internal server error while fetching staff",
    });
  }
};

export const deactivateUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find user first
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent deactivating ADMIN users
    if (user.role === "ADMIN") {
      return res.status(403).json({
        message: "Cannot deactivate admin accounts",
      });
    }

    // Prevent deactivating yourself
    if (user.id === req.user.id) {
      return res.status(400).json({
        message: "Cannot deactivate your own account",
      });
    }

    // Check if already inactive
    if (!user.is_active) {
      return res.status(400).json({
        message: "User is already deactivated",
      });
    }

    // Deactivate user
    await db
      .update(usersTable)
      .set({
        is_active: false,
        updated_at: new Date(),
      })
      .where(eq(usersTable.id, userId));

    res.status(200).json({
      message: "User deactivated successfully",
    });
  } catch (error) {
    console.error("Error deactivating user:", error);
    res.status(500).json({
      message: "Internal server error while deactivating user",
    });
  }
};

export const activateUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find user first
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already active
    if (user.is_active) {
      return res.status(400).json({
        message: "User is already active",
      });
    }

    // Activate user
    await db
      .update(usersTable)
      .set({
        is_active: true,
        updated_at: new Date(),
      })
      .where(eq(usersTable.id, userId));

    res.status(200).json({
      message: "User activated successfully",
    });
  } catch (error) {
    console.error("Error activating user:", error);
    res.status(500).json({
      message: "Internal server error while activating user",
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        full_name: usersTable.full_name,
        email_verified: usersTable.email_verified,
        is_active: usersTable.is_active,
        created_at: usersTable.created_at,
      })
      .from(usersTable)
      .where(eq(usersTable.role, "USER"))
      .orderBy(usersTable.created_at);

    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching general users:", error);
    res.status(500).json({
      message: "Internal server error while fetching users",
    });
  }
};
