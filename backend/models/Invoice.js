import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    family: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Family",
      required: true,
    },

    // 🔥 Invoice number (unique)
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },

    // 🔥 Invoice index (0,1,2...)
    invoiceIndex: {
      type: Number,
      required: true,
    },

    // 🔥 Date range
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },

    // 🔥 Aggregated data
    totalLitres: {
      type: Number,
      default: 0,
    },

    totalAmount: {
      type: Number,
      default: 0,
    },

    // 🔥 Store daily summary (already grouped)
    entries: [
      {
        date: Date,
        litres: Number,
        total: Number,
      },
    ],

    // 🔥 Cloudinary URL
    pdfUrl: {
      type: String,
    },

    // 🔥 Payment status
    status: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },

    paidAt: {
      type: Date,
    },
    cloudinaryPublicId: {
  type: String,
},
  },
  { timestamps: true }
);

export default mongoose.model("Invoice", invoiceSchema);