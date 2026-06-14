import mongoose from "mongoose";

const dailyEntrySchema = new mongoose.Schema({
  family: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Family",
    required: true,
  },

  entries: [
    {
      date: Date,
      milkType: String,
      litres: Number,
      pricePerLitre: Number,
      total: Number,
    },
  ],
}, { timestamps: true });


export default mongoose.model("DailyEntry", dailyEntrySchema);