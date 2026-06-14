import cron from "node-cron";
import { cleanOldEntries } from "../utils/cleanupDb.js";
import { cleanOldInvoices } from "../utils/cleanupCloudinary.js";
import { cleanOldInvoicesdb } from "../utils/cleanupInvoices.js";

// 🕛 Runs every day at midnight
cron.schedule("0 0 * * *", async () => {
  console.log("🔄 Running cleanup job...");

  await cleanOldEntries();
  await cleanOldInvoices();
  await cleanOldInvoicesdb();
});