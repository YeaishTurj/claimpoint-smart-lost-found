import {
  pgTable,
  uuid,
  pgEnum,
  timestamp,
  text,
  json,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { usersTable } from "./user.model.js";

// Found item workflow
export const foundItemStatusEnum = pgEnum("found_item_status", [
  "found",
  "claimed",
  "returned",
]);

// Claim workflow
export const claimStatusEnum = pgEnum("claim_status", [
  "pending",
  "approved",
  "rejected",
  "collected",
]);

// Lost report workflow
export const lostReportStatusEnum = pgEnum("lost_report_status", [
  "open",
  "matched",
  "resolved",
]);

export const foundItemsTable = pgTable("found_items", {
  id: uuid("id").primaryKey().defaultRandom(),

  item_type: text("item_type").notNull(),

  staff_id: uuid("staff_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "set null" }),

  date_found: timestamp("date_found", { withTimezone: true }).notNull(),
  location_found: text("location_found").notNull(),

  full_details: json("full_details").notNull(), // backend-only details
  public_details: json("public_details").notNull(), // safe public info

  image_urls: json("image_urls"), // array of URLs

  status: foundItemStatusEnum("status").notNull().default("found"),

  created_at: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),

  updated_at: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const claimsTable = pgTable("claims", {
  id: uuid("id").primaryKey().defaultRandom(),

  found_item_id: uuid("found_item_id")
    .notNull()
    .references(() => foundItemsTable.id, { onDelete: "cascade" }),

  user_id: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "set null" }),

  claim_details: json("claim_details").notNull(), // what user claims

  image_urls: json("image_urls"), // array of URLs provided by user

  match_percentage: integer("match_percentage").default(0),

  status: claimStatusEnum("status").notNull().default("pending"),

  created_at: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),

  updated_at: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const lostReportsTable = pgTable("lost_reports", {
  id: uuid("id").primaryKey().defaultRandom(),

  user_id: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),

  item_type: text("item_type").notNull(),

  report_details: json("report_details").notNull(), // user description
  date_lost: timestamp("date_lost", { withTimezone: true }).notNull(),
  location_lost: text("location_lost").notNull(),
  image_urls: json("image_urls"), // array of URLs
  status: lostReportStatusEnum("status").notNull().default("open"),

  created_at: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),

  updated_at: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const foundItemsRelations = relations(
  foundItemsTable,
  ({ one, many }) => ({
    staff: one(usersTable, {
      fields: [foundItemsTable.staff_id],
      references: [usersTable.id],
    }),
    claims: many(claimsTable),
  })
);

export const claimsRelations = relations(claimsTable, ({ one }) => ({
  foundItem: one(foundItemsTable, {
    fields: [claimsTable.found_item_id],
    references: [foundItemsTable.id],
  }),
  user: one(usersTable, {
    fields: [claimsTable.user_id],
    references: [usersTable.id],
  }),
}));

export const lostReportsRelations = relations(lostReportsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [lostReportsTable.user_id],
    references: [usersTable.id],
  }),
}));
