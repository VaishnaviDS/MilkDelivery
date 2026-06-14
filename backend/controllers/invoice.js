// import PDFDocument from "pdfkit";
// import streamifier from "streamifier";
// import cloudinary from "../utils/cloudinary.js";
// import DailyEntry from "../models/DailyEntry.js";
// import Family from "../models/Family.js";

// export const generateInvoice = async (req, res) => {
//   try {
//     const { familyId, invoiceIndex = 0 } = req.body;

//     // 🔹 Get all entries sorted
//     const entries = await DailyEntry.find({ family: familyId }).sort({
//       date: 1,
//     });

//     if (!entries.length) {
//       return res.status(404).json({ message: "No entries found" });
//     }

//     // 🔥 Pagination logic (30 per invoice)
//     const start = invoiceIndex * 30;
//     const end = start + 30;

//     const limitedEntries = entries.slice(start, end);

//     if (!limitedEntries.length) {
//       return res.status(404).json({
//         message: "No entries for this invoice index",
//       });
//     }

//     const startDate = limitedEntries[0].date;
//     const endDate = limitedEntries[limitedEntries.length - 1].date;

//     const family = await Family.findById(familyId);

//     if (!family) {
//       return res.status(404).json({ message: "Family not found" });
//     }

//     const totalAmount = limitedEntries.reduce((sum, e) => sum + e.total, 0);

//     const totalInvoices = Math.ceil(entries.length / 30);

//     const doc = new PDFDocument({ size: "A4", margin: 50 });

//     let buffers = [];
//     doc.on("data", buffers.push.bind(buffers));

//     doc.on("end", async () => {
//       const pdfBuffer = Buffer.concat(buffers);

//       const result = await new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//           {
//             folder: "invoices",
//             public_id: `invoice_${familyId}_${invoiceIndex}`, // 🔥 unique per invoice
//             resource_type: "raw",
//             format: "pdf",
//             overwrite: true,
//           },
//           (error, result) => {
//             if (error) reject(error);
//             else resolve(result);
//           }
//         );

//         streamifier.createReadStream(pdfBuffer).pipe(stream);
//       });

//       res.json({
//         message: "Invoice generated",
//         url: result.secure_url,
//         totalInvoices,
//         currentInvoice: invoiceIndex + 1,
//       });
//     });

//     // =========================
//     // 🔥 HEADER
//     // =========================

//     doc.fontSize(10).text("YOUR LOGO", 50, 40);

//     doc
//       .fontSize(10)
//       .text(`NO. ${invoiceIndex + 1}`, 400, 40, { align: "right" });

//     doc.moveDown(1);

//     doc
//       .fontSize(28)
//       .font("Helvetica-Bold")
//       .text("INVOICE", 50);

//     doc.moveDown(0.5);

//     doc.fontSize(11).font("Helvetica");
//     doc.text(`Date: ${new Date().toDateString()}`);
//     doc.text(
//       `Period: ${startDate.toDateString()} - ${endDate.toDateString()}`
//     );

//     doc.moveDown(0.8);

//     // =========================
//     // 🔥 BILLING SECTION
//     // =========================

//     const leftX = 50;
//     const rightX = 320;
//     const startY = doc.y;

//     // LEFT
//     doc.font("Helvetica-Bold").text("Billed to:", leftX, startY);

//     doc.font("Helvetica");
//     doc.text(family.name, leftX, doc.y + 3, { width: 200 });
//     doc.text(family.address, { width: 200 });
//     doc.text(`Phone: ${family.phone}`, { width: 200 });

//     const leftEndY = doc.y;

//     // RIGHT
//     doc.font("Helvetica-Bold").text("From:", rightX, startY);

//     doc.font("Helvetica");
//     doc.text("Milk Dairy", rightX, startY + 15, { width: 200 });
//     doc.text("Your Address Here", { width: 200 });
//     doc.text("your@email.com", { width: 200 });

//     const rightEndY = doc.y;

//     // 🔥 FIX spacing
//     doc.y = Math.max(leftEndY, rightEndY) + 10;

//     // =========================
//     // 🔥 TABLE HEADER
//     // =========================

//     const tableTop = doc.y;

//     doc
//       .rect(50, tableTop, 500, 25)
//       .fill("#eeeeee")
//       .stroke();

//     doc.fillColor("black").font("Helvetica-Bold").fontSize(10);

//     doc.text("Date", 60, tableTop + 7);
//     doc.text("Type", 160, tableTop + 7);
//     doc.text("Litres", 260, tableTop + 7);
//     doc.text("Price", 340, tableTop + 7);
//     doc.text("Amount", 430, tableTop + 7);

//     let y = tableTop + 30;

//     // =========================
//     // 🔥 TABLE ROWS
//     // =========================

//     doc.font("Helvetica").fontSize(9);

//     limitedEntries.forEach((e) => {
//       doc.text(new Date(e.date).toLocaleDateString(), 60, y);
//       doc.text(e.milkType, 160, y);

//       doc.text(e.litres.toString(), 260, y, {
//         width: 50,
//         align: "right",
//       });

//       doc.text(`₹${e.pricePerLitre}`, 340, y, {
//         width: 60,
//         align: "right",
//       });

//       doc.text(`₹${e.total}`, 430, y, {
//         width: 70,
//         align: "right",
//       });

//       y += 18;

//       // 🔥 Prevent overflow → new page
//       if (y > 700) {
//         doc.addPage();
//         y = 50;
//       }
//     });

//     // =========================
//     // 🔥 TOTAL
//     // =========================

//     doc.moveTo(50, y).lineTo(550, y).stroke();

//     y += 10;

//     doc.font("Helvetica-Bold").fontSize(12);
//     doc.text("Total:", 350, y);
//     doc.text(`₹${totalAmount}`, 430, y);

//     y += 40;

//     // =========================
//     // 🔥 FOOTER
//     // =========================

//     doc.fontSize(10).font("Helvetica");

//     doc.text("Payment method: Cash", 50, y);
//     doc.text("Note: Thank you for choosing us!", 50, y + 20);

//     doc.end();
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
import PDFDocument from "pdfkit";
import streamifier from "streamifier";
import cloudinary from "../utils/cloudinary.js";

import DailyEntry from "../models/DailyEntry.js";
import Family from "../models/Family.js";
import Invoice from "../models/Invoice.js";

export const generateInvoice = async (req, res) => {
  try {
    const { familyId } = req.body;

    const PAGE_SIZE = 31;

    const docs = await DailyEntry.find({
      family: familyId,
    });

    let allEntries = [];

    docs.forEach((doc) => {
      allEntries = allEntries.concat(doc.entries);
    });

    if (!allEntries.length) {
      return res.status(404).json({
        message: "No entries found",
      });
    }

    // sort by date
    allEntries.sort(
      (a, b) =>
        new Date(a.date) - new Date(b.date)
    );

    // group by date
// group by date
const groupedMap = {};

allEntries.forEach((e) => {
  const key = new Date(e.date)
    .toISOString()
    .split("T")[0];

  if (!groupedMap[key]) {
    groupedMap[key] = {
      date: new Date(e.date),
      milkType: [], // store milk types
      litres: 0,
      total: 0,
    };
  }

  // avoid duplicate milk types
  if (
    e.milkType &&
    !groupedMap[key].milkType.includes(e.milkType)
  ) {
    groupedMap[key].milkType.push(e.milkType);
  }

  groupedMap[key].litres += e.litres;
  groupedMap[key].total += e.total;
});

const groupedEntries = Object.values(groupedMap);

    // determine current invoice automatically
    const invoiceIndex = Math.floor(
      (groupedEntries.length - 1) /
        PAGE_SIZE
    );

    const start =
      invoiceIndex * PAGE_SIZE;

    const end = start + PAGE_SIZE;

    const limitedEntries =
      groupedEntries.slice(start, end);

    if (!limitedEntries.length) {
      return res.status(404).json({
        message:
          "No entries for this invoice",
      });
    }

    const startDate =
      limitedEntries[0].date;

    const endDate =
      limitedEntries[
        limitedEntries.length - 1
      ].date;

    const totalAmount =
      limitedEntries.reduce(
        (sum, e) => sum + e.total,
        0
      );

    const totalLitres =
      limitedEntries.reduce(
        (sum, e) => sum + e.litres,
        0
      );

    const family =
      await Family.findById(familyId);

    if (!family) {
      return res.status(404).json({
        message: "Family not found",
      });
    }

    // PDF
    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
    });

    const buffers = [];

    doc.on("data", (chunk) => {
      buffers.push(chunk);
    });

    doc.on("end", async () => {
      try {
        const pdfBuffer =
          Buffer.concat(buffers);

        const result =
          await new Promise(
            (resolve, reject) => {
              const stream =
                cloudinary.uploader.upload_stream(
                  {
                    folder: "invoices",
                    public_id: `invoice_${familyId}_${invoiceIndex}`,
                    resource_type:
                      "auto",
                    format: "pdf",
                    overwrite: true,
                  },
                  (
                    error,
                    result
                  ) => {
                    if (error)
                      reject(error);
                    else
                      resolve(result);
                  }
                );

              streamifier
                .createReadStream(
                  pdfBuffer
                )
                .pipe(stream);
            }
          );

        const invoiceNumber = `INV-${familyId}-${invoiceIndex}`;

        const invoice =
          await Invoice.findOneAndUpdate(
            {
              family: familyId,
              invoiceIndex,
            },
            {
              family: familyId,
              invoiceNumber,
              invoiceIndex,
              startDate,
              endDate,
              totalAmount,
              totalLitres,
              entries:
                limitedEntries,
              pdfUrl:
                result.secure_url,
            },
            {
              upsert: true,
              returnDocument: "after"
            }
          );

        return res.json({
          invoice,
          url: result.secure_url,
        });
      } catch (err) {
        return res.status(500).json({
          message: err.message,
        });
      }
    });

    // HEADER
   doc.fontSize(10).text("YOUR LOGO", 50, 40);

    doc
      .fontSize(10)
      .text(`NO. ${invoiceIndex + 1}`, 400, 40, { align: "right" });

    doc.moveDown(1);

    doc
      .fontSize(28)
      .font("Helvetica-Bold")
      .text("INVOICE", 50);

    doc.moveDown(0.5);

    doc.fontSize(11).font("Helvetica");
    doc.text(`Date: ${new Date().toDateString()}`);
    doc.text(
      `Period: ${startDate.toDateString()} - ${endDate.toDateString()}`
    );

    doc.moveDown(0.8);

    // =========================
    // 🔥 BILLING SECTION
    // =========================

    const leftX = 50;
    const rightX = 320;
    const startY = doc.y;

    // LEFT
    doc.font("Helvetica-Bold").text("Billed to:", leftX, startY);

    doc.font("Helvetica");
    doc.text(family.name, leftX, doc.y + 3, { width: 200 });
    doc.text(family.address, { width: 200 });
    doc.text(`Phone: ${family.phone}`, { width: 200 });

    const leftEndY = doc.y;

    // RIGHT
    doc.font("Helvetica-Bold").text("From:", rightX, startY);

    doc.font("Helvetica");
    doc.text("Milk Dairy", rightX, startY + 15, { width: 200 });
    doc.text("Your Address Here", { width: 200 });
    doc.text("your@email.com", { width: 200 });

    const rightEndY = doc.y;

    // 🔥 FIX spacing
    doc.y = Math.max(leftEndY, rightEndY) + 10;

    // =========================
    // 🔥 TABLE HEADER
    // =========================

    // =========================
// TABLE HEADER
// =========================

const tableTop = doc.y;

doc
  .rect(50, tableTop, 500, 25)
  .fill("#eeeeee")
  .stroke();

doc
  .fillColor("black")
  .font("Helvetica-Bold")
  .fontSize(10);

doc.text("Date", 60, tableTop + 7);
doc.text("Type", 170, tableTop + 7);
doc.text("Litres", 310, tableTop + 7);
doc.text("Amount", 420, tableTop + 7);

let y = tableTop + 30;

    // =========================
// TABLE ROWS
// =========================

doc.font("Helvetica").fontSize(9);

limitedEntries.forEach((e) => {
  doc.text(
    new Date(e.date).toLocaleDateString(),
    60,
    y
  );

  // Display one or multiple milk types
  doc.text(
    Array.isArray(e.milkType)
      ? e.milkType.join(", ")
      : e.milkType || "-",
    170,
    y,
    {
      width: 100,
    }
  );

  doc.text(
    e.litres.toFixed(2),
    310,
    y,
    {
      width: 60,
      align: "right",
    }
  );

  doc.text(
    `₹${e.total.toFixed(2)}`,
    420,
    y,
    {
      width: 80,
      align: "right",
    }
  );

  y += 18;

  // Prevent overflow
  if (y > 700) {
    doc.addPage();
    y = 50;

    // Draw header again on the new page
    doc
      .rect(50, y, 500, 25)
      .fill("#eeeeee")
      .stroke();

    doc
      .fillColor("black")
      .font("Helvetica-Bold")
      .fontSize(10);

    doc.text("Date", 60, y + 7);
    doc.text("Type", 170, y + 7);
    doc.text("Litres", 310, y + 7);
    doc.text("Amount", 420, y + 7);

    y += 30;

    doc.font("Helvetica").fontSize(9);
  }
});

    // =========================
// TOTAL
// =========================

doc.moveTo(50, y).lineTo(550, y).stroke();

y += 10;

doc.font("Helvetica-Bold").fontSize(12);
doc.text("Total:", 350, y);
doc.text(`₹${totalAmount.toFixed(2)}`, 430, y);

y += 40;

// =========================
// FOOTER
// =========================

doc.fontSize(10).font("Helvetica");

doc.text("Payment method: Cash", 50, y);
doc.text("Note: Thank you for choosing us!", 50, y + 20);

    doc.end();
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateInvoiceStatus = async (req, res) => {
  try {
    const { invoiceId } = req.params;

    const invoice = await Invoice.findById(invoiceId);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    invoice.status = "Paid";
    invoice.paidAt = new Date();

    await invoice.save();

    res.json({ message: "Invoice marked as Paid", invoice });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getInvoicesByFamily = async (req, res) => {
  try {
    const { familyId } = req.params;

    const invoices = await Invoice.find({ family: familyId })
      .sort({ invoiceIndex: 1 });

    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};