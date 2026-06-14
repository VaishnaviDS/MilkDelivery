import User from "../models/User.js";
import Family from "../models/Family.js";
import DailyEntry from "../models/DailyEntry.js";
import Settings from "../models/Settings.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs'

// 🔑 Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 🔐 Hash password here
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// 🔐 LOGIN ADMIN
// =======================
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // 🔑 Compare password here
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// =======================
// 👨‍👩‍👧 CREATE FAMILY
// =======================
export const createFamily = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    const family = await Family.create({
      name,
      phone,
      address,
    });

    res.status(201).json(family);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// =======================
// 📋 GET ALL FAMILIES (SEARCH)
// =======================
export const getFamilies = async (req, res) => {
  try {
    const { search } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
      ];
    }

    const families = await Family.find(query).sort({ createdAt: -1 });

    res.json(families);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// =======================
// 🥛 CREATE DAILY ENTRY
// =======================


export const createDailyEntry = async (req, res) => {
  try {
    const { familyId, date, litres, milkType } = req.body;

    const settings = await Settings.findOne();

    const pricePerLitre =
      milkType === "cow"
        ? settings.cowPrice
        : settings.buffaloPrice;

    const total = litres * pricePerLitre;

    // 🔥 Find latest batch with < 30 entries
    let batch = await DailyEntry.findOne({
      family: familyId,
      "entries.29": { $exists: false }, // max 30
    }).sort({ createdAt: -1 });

    // If no batch OR full → create new
    if (!batch) {
      batch = await DailyEntry.create({
        family: familyId,
        entries: [],
      });
    }

    // Push new entry
    batch.entries.push({
      date,
      milkType,
      litres,
      pricePerLitre,
      total,
    });

    await batch.save();

    res.status(201).json(batch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// =======================
// 📅 GET MONTHLY HISTORY
// =======================
export const getMonthlyHistory = async (req, res) => {
  try {
    const { familyId, month } = req.query;

    // month format: YYYY-MM
    const start = new Date(`${month}-01`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    const entries = await DailyEntry.find({
      family: familyId,
      date: { $gte: start, $lt: end },
    }).sort({ date: 1 });

    const totalLitres = entries.reduce((sum, e) => sum + e.litres, 0);
    const totalAmount = entries.reduce((sum, e) => sum + e.total, 0);

    res.json({
      entries,
      totalLitres,
      totalAmount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// =======================
// 📊 DASHBOARD STATS
// =======================
export const getStats = async (req, res) => {
  try {
    // =========================
    // ✅ TOTAL FAMILIES
    // =========================
    const totalFamilies = await Family.countDocuments();

    // =========================
    // ✅ GET ALL DAILY ENTRY DOCS
    // =========================
    const dailyDocs = await DailyEntry.find();

    let totalRevenue = 0;
    let totalLitres = 0;
    let totalEntries = 0;

    // =========================
    // ✅ LOOP THROUGH NESTED ENTRIES
    // =========================
    dailyDocs.forEach((doc) => {
      doc.entries.forEach((entry) => {
        totalRevenue += Number(entry.total || 0);

        totalLitres += Number(entry.litres || 0);

        totalEntries++;
      });
    });

    // =========================
    // ✅ RECENT FAMILIES
    // =========================
    const recentFamilies = await Family.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // =========================
    // ✅ RECENT ENTRIES
    // =========================
    const recentEntries = await DailyEntry.find()
      .populate("family", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    // =========================
    // ✅ RESPONSE
    // =========================
    res.status(200).json({
      totalFamilies,
      totalRevenue,
      totalLitres,
      totalEntries,
      recentFamilies,
      recentEntries,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateFamily = async (req, res) => {
  try {
    const { id } = req.params;

const updated = await Family.findByIdAndUpdate(
  id,
  req.body,
  { returnDocument: "after" }
);

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteFamily = async (req, res) => {
  try {
    const { id } = req.params;

    await Family.findByIdAndDelete(id);

    res.json({ message: "Family deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    // 🔥 Ensure it always exists
    if (!settings) {
      settings = await Settings.create({});
    }

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// =======================
// ⚙️ UPDATE SETTINGS
// =======================
export const updateSettings = async (req, res) => {
  try {
    const { cowPrice, buffaloPrice } = req.body;

    let settings = await Settings.findOne();

    // 🔥 If not exists, create first
    if (!settings) {
      settings = await Settings.create({
        cowPrice,
        buffaloPrice,
      });
    } else {
      settings.cowPrice = cowPrice ?? settings.cowPrice;
      settings.buffaloPrice = buffaloPrice ?? settings.buffaloPrice;

      await settings.save();
    }

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};