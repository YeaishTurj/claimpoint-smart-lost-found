import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { usersTable } from "./models/user.model.js";
import {
  foundItemsTable,
  claimsTable,
  lostReportsTable,
} from "./models/item.model.js";

const db = drizzle(process.env.DATABASE_URL);

export { db, usersTable, foundItemsTable, claimsTable, lostReportsTable };
