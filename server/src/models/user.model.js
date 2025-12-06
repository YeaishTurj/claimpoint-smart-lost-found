import {
  pgTable,
  varchar,
  uuid,
  pgEnum,
  boolean,
  timestamp,
  text,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["ADMIN", "STAFF", "USER"]);

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),

  email: varchar("email", { length: 255 }).notNull().unique(),

  password: text("password").notNull(),

  full_name: varchar("full_name", { length: 255 }).notNull(),

  phone: varchar("phone", { length: 20 }),

  role: userRoleEnum("role").notNull().default("USER"),

  is_active: boolean("is_active").notNull().default(true),

  email_verified: boolean("email_verified").notNull().default(false),

  otp_verification_code: varchar("otp_verification_code", { length: 10 }),

  otp_expires_at: timestamp("otp_expires_at", { withTimezone: true }),

  created_at: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),

  updated_at: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
