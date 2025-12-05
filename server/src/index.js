import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { usersTable } from "./models/user.model.js";

const db = drizzle(process.env.DATABASE_URL);

export { db, usersTable };
