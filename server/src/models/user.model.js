import {
  pgTable,
  varchar,
  uuid,
  pgEnum,
  boolean,
  timestamp,
  text,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "SUPERADMIN",
  "STAFF",
  "USER",
]);

export const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: text().notNull(),
  full_name: varchar({ length: 255 }).notNull(),
  phone: varchar({ length: 20 }),
  role: userRoleEnum().notNull().default("USER"),
  is_active: boolean().notNull().default(true),
  email_verified: boolean().notNull().default(false),
  otp_verification_code: varchar({ length: 10 }),
  otp_expires_at: timestamp(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});
