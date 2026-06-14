import express from "express";
import { authenticate } from "../middlewares/auth.js";
import { generateInvoice, getInvoicesByFamily, updateInvoiceStatus } from "../controllers/invoice.js";

const router = express.Router();

router.post("/generate", authenticate, generateInvoice);
router.put("/status/:invoiceId",authenticate, updateInvoiceStatus);
router.get("/:familyId",authenticate, getInvoicesByFamily);


export default router;