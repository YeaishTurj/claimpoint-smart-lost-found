import "dotenv/config";
import { db, usersTable } from "../src/index.js";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

const seedSuperAdmin = async () => {
  const email = process.env.SUPERADMIN_EMAIL;
  const password = process.env.SUPERADMIN_PASSWORD;

  try {
    // Check if superadmin already exists
    const [existingUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (existingUser) {
      console.log("Superadmin already exists.");
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create superadmin user object
    const superAdminUser = {
      email,
      password: hashedPassword,
      full_name: process.env.SUPERADMIN_FULLNAME || "Super Admin",
      phone: process.env.SUPERADMIN_PHONE || null,
      role: "SUPERADMIN",
      is_active: true,
      email_verified: true,
    };

    // Insert superadmin into database
    await db.insert(usersTable).values(superAdminUser);

    console.log("Superadmin seeded successfully.");
  } catch (error) {
    console.error("Error seeding superadmin:", error);
  }
};

seedSuperAdmin().then(() => process.exit());
