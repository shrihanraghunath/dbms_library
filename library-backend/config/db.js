import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Create connection pool (reusable connections)
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "library_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection immediately when the server starts
(async () => {
  try {
    const [rows] = await pool.query("SELECT NOW() AS currentTime");
    console.log("✅ Database connected successfully!");
    console.log("🕒 Current MySQL time:", rows[0].currentTime);
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
  }
})();

export default pool;
