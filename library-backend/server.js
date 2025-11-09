import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";

// Routes
import bookRoutes from "./routes/bookRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";
import borrowRoutes from "./routes/borrowRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";
import returnRoutes from "./routes/returnRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import utilRoutes from "./routes/utilRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Root
app.get("/", (req, res) => {
  res.send("📚 Library Management System API is running...");
});

// Route mounts
app.use("/api/books", bookRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/borrow", borrowRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/returns", returnRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/utils", utilRoutes); // ✅ Utility routes

// 404 fallback
app.use((req, res) => res.status(404).json({ error: "Route not found" }));

// Server start
app.listen(PORT, async () => {
  try {
    await pool.query("SELECT 1");
    console.log(`✅ Server running on port ${PORT}`);
  } catch (err) {
    console.error("❌ Database connection failed:", err);
  }
});
