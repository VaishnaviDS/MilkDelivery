import cloudinary from "./cloudinary.js";

export const cleanOldInvoices = async () => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const result = await cloudinary.search
      .expression("folder:invoices")
      .max_results(100)
      .execute();

    for (const file of result.resources) {
      const createdAt = new Date(file.created_at);

      if (createdAt < sixMonthsAgo) {
        await cloudinary.uploader.destroy(file.public_id, {
          resource_type: "image",
        });

        console.log("🗑 Deleted:", file.public_id);
      }
    }

    console.log("✅ Cloudinary cleanup done");
  } catch (error) {
    console.error("❌ Cloudinary Cleanup Error:", error.message);
  }
};