import pool from "../config/db.js";

export const getTransactions = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        t.Transaction_ID,
        m.Member_ID,
        CONCAT(m.First_Name, ' ', m.Last_Name) AS member_name,
        b.Book_ID,
        b.Title AS book_title,
        t.Issue_Date,
        t.Due_Date,
        t.Return_Date,
        t.Fine
      FROM \`Transaction\` t
      JOIN Borrow br ON t.Transaction_ID = br.Transaction_ID
      JOIN Member m ON br.Member_ID = m.Member_ID
      JOIN Book b ON br.Book_ID = b.Book_ID
      ORDER BY t.Issue_Date DESC;
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};
