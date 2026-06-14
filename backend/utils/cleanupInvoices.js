import Invoice from "../models/Invoice.js";
import cloudinary from "./cloudinary.js";

export const cleanOldInvoicesdb = async () => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // 🔥 Find old invoices
    const oldInvoices = await Invoice.find({
      createdAt: { $lt: sixMonthsAgo },
    });

    for (const inv of oldInvoices) {
      // 🔥 Delete from Cloudinary (important)
      if (inv.pdfUrl) {
        const publicId = inv.pdfUrl
          .split("/")
          .slice(-2)
          .join("/")
          .replace(".pdf", "");

        await cloudinary.uploader.destroy(publicId, {
          resource_type: "raw",
        });
      }

      // 🔥 Delete from DB
      await inv.deleteOne();
    }

    console.log(`✅ Deleted ${oldInvoices.length} old invoices`);
  } catch (error) {
    console.error("❌ Invoice cleanup error:", error.message);
  }
};