import DailyEntry from "../models/DailyEntry.js";

export const cleanOldEntries = async () => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const docs = await DailyEntry.find();

    for (const doc of docs) {
      // 🔥 filter entries inside array
      doc.entries = doc.entries.filter(
        (e) => new Date(e.date) >= sixMonthsAgo
      );

      // If no entries left → delete doc
      if (doc.entries.length === 0) {
        await doc.deleteOne();
      } else {
        await doc.save();
      }
    }

    console.log("✅ Old DB entries cleaned");
  } catch (error) {
    console.error("❌ DB Cleanup Error:", error.message);
  }
};