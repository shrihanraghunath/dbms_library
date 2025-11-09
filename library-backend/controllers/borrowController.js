import pool from "../config/db.js";

// ✅ Fetch all borrowed books with member, book, and transaction details
export const getBorrowedBooks = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        br.Borrow_ID AS transaction_id,
        m.Member_ID,
        CONCAT(m.First_Name, ' ', COALESCE(m.Last_Name, '')) AS member_name,
        b.Book_ID,
        b.Title AS book_title,
        t.Issue_Date AS issue_date,
        t.Due_Date AS due_date,
        t.Return_Date AS return_date,
        IF(t.Return_Date IS NULL, 'Not Returned', 'Returned') AS status
      FROM Borrow br
      JOIN Member m ON br.Member_ID = m.Member_ID
      JOIN Book b ON br.Book_ID = b.Book_ID
      JOIN \`Transaction\` t ON br.Transaction_ID = t.Transaction_ID
      ORDER BY t.Issue_Date DESC;
    `);

    res.json(rows);
  } catch (err) {
    console.error("Error fetching borrow transactions:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Borrow a book (uses stored procedure)
export const borrowBook = async (req, res) => {
  try {
    const { member_id, book_id, staff_id } = req.body;

    if (!member_id || !book_id || !staff_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const [result] = await pool.query("CALL sp_borrow_book(?, ?, ?)", [
      member_id,
      book_id,
      staff_id,
    ]);

    res.json({ message: "Book borrowed successfully", result });
  } catch (err) {
    console.error("Error borrowing book:", err);
    res.status(500).json({ error: err.message });
  }
};
