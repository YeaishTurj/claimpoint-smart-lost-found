import cron from "node-cron";
import { db } from "../index.js";
import { usersPendingTable } from "../models/index.js";
import { lt } from "drizzle-orm";

export const initCronJobs = () => {
  // Runs every hour
  cron.schedule("0 * * * *", async () => {
    try {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      await db
        .delete(usersPendingTable)
        .where(lt(usersPendingTable.created_at, twentyFourHoursAgo));

      console.log("Successfully cleaned up old pending users");
    } catch (err) {
      console.error("Cleanup Cron Failed:", err);
    }
  });

  console.log("Cron Jobs Initialized 🚀");
};
