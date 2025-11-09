import pool from "../config/db.js";

// ✅ Get all reservations
export const getAllReservations = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        r.Reservation_ID AS id,
        CONCAT(m.First_Name, ' ', m.Last_Name) AS member_name,
        b.Title AS book_title,
        DATE_FORMAT(r.Reservation_Date, '%d-%m-%Y') AS reservation_date,
        r.Status AS status
      FROM Reservation r
      JOIN Member m ON r.Member_ID = m.Member_ID
      JOIN Book b ON r.Book_ID = b.Book_ID
      ORDER BY r.Reservation_Date DESC;
    `);

    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching reservations:", err);
    res.status(500).json({ error: "Database error fetching reservations" });
  }
};

// ✅ Add new reservation
export const addReservation = async (req, res) => {
  try {
    const { member_id, book_id } = req.body;
    console.log("🟢 Adding reservation:", { member_id, book_id });

    await pool.query("CALL sp_add_reservation(?, ?)", [member_id, book_id]);
    res.json({ message: "Reservation added successfully" });
  } catch (err) {
    console.error("❌ Error adding reservation:", err);
    res.status(500).json({ error: err.message || "Database error adding reservation" });
  }
};

// ✅ Cancel reservation
export const cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🟡 Cancelling reservation ID:", id);

    await pool.query("CALL sp_cancel_reservation(?)", [id]);
    res.json({ message: "Reservation cancelled successfully" });
  } catch (err) {
    console.error("❌ Error cancelling reservation:", err);
    res.status(500).json({ error: "Database error cancelling reservation" });
  }
};
