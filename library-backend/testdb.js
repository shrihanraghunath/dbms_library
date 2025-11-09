import pool from "./db/pool.js";

async function testConnection() {
  try {
    const [rows] = await pool.query("SELECT NOW() AS time");
    console.log("✅ Database connected successfully!");
    console.log("🕒 Current MySQL time:", rows[0].time);
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  } finally {
    process.exit();
  }
}

testConnection();

