import pool from "../config/db.js";

// ✅ Fetch all returned transactions
export const getReturns = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        t.Transaction_ID AS transaction_id,
        m.Member_ID,
        CONCAT(m.First_Name, ' ', m.Last_Name) AS member_name,
        b.Book_ID,
        b.Title AS book_title,
        t.Issue_Date AS issue_date,
        t.Due_Date AS due_date,
        t.Return_Date AS return_date,
        IF(t.Return_Date IS NULL, 'Not Returned', 'Returned') AS status
      FROM Transaction t
      JOIN Borrow br ON t.Transaction_ID = br.Transaction_ID
      JOIN Member m ON br.Member_ID = m.Member_ID
      JOIN Book b ON br.Book_ID = b.Book_ID
      ORDER BY t.Issue_Date DESC;
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching returns:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Return a book using stored procedure
export const returnBook = async (req, res) => {
  try {
    const { transaction_id, fine } = req.body;
    const [result] = await pool.query("CALL sp_return_book(?, ?)", [
      transaction_id,
      fine,
    ]);
    res.json({ message: "Book returned successfully", result });
  } catch (err) {
    console.error("Error returning book:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Calculate fine using SQL function fn_calculate_fine(p_due)
export const calculateFine = async (req, res) => {
  try {
    const { due_date } = req.params; // e.g. /api/returns/fine/2025-11-06
    const [result] = await pool.query("SELECT fn_calculate_fine(?) AS fine", [
      due_date,
    ]);
    res.json(result[0]);
  } catch (err) {
    console.error("Error calculating fine:", err);
    res.status(500).json({ error: err.message });
  }
};
