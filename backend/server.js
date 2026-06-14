import express from 'express'
import dotenv from 'dotenv';
import cors from 'cors'
import connectDB from './config/db.js';
import adminRoutes from "./routes/admin.js"
import histRoutes from "./routes/history.js"
import invoiceRoutes from "./routes/invoice.js"
import "./jobs/scheduler.js";
dotenv.config();
connectDB()
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/admin",adminRoutes)
app.use("/api/admin/history",histRoutes)
app.use("/api/admin/invoice",invoiceRoutes)

app.get('/', (req, res) => {
  res.send('Server running');
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running at port ${process.env.PORT}`);
});