import express from "express";

import { authenticate } from "../middlewares/auth.js";
import { createDailyEntry, createFamily, deleteFamily, getFamilies, getMonthlyHistory, getSettings, getStats, loginAdmin, registerAdmin, updateFamily, updateSettings } from "../controllers/admin.js";

const router = express.Router();
router.post("/register",registerAdmin)
router.post("/login", loginAdmin);

router.post("/family", authenticate, createFamily);
router.get("/families", authenticate, getFamilies);

router.post("/entry", authenticate, createDailyEntry);

router.get("/history", authenticate, getMonthlyHistory);

router.get("/stats", authenticate, getStats);

router.get("/settings", authenticate, getSettings);
router.put("/settings", authenticate, updateSettings);
router.put("/family/:id",authenticate,updateFamily)
router.delete("/family/:id",authenticate,deleteFamily)

export default router;