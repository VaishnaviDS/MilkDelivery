import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  cowPrice: {
    type: Number,
    default: 50,
  },
  buffaloPrice: {
    type: Number,
    default: 60,
  },
});

export default mongoose.model("Settings", settingsSchema);