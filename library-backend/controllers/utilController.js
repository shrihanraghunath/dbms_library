import pool from "../config/db.js";

// -------------------- 🔹 SQL FUNCTIONS --------------------
export const calculateFine = async (req, res) => {
  try {
    const { dueDate } = req.params;
    const [rows] = await pool.query("SELECT fn_calculate_fine(?) AS Fine", [dueDate]);
    res.json(rows[0]);
  } catch (err) {
    console.error("Error calculating fine:", err);
    res.status(500).json({ error: "Database error calculating fine" });
  }
};

export const booksBorrowed = async (req, res) => {
  try {
    const { memberId } = req.params;
    const [rows] = await pool.query("SELECT fn_books_borrowed(?) AS Books_Borrowed", [memberId]);
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching borrowed books:", err);
    res.status(500).json({ error: "Database error fetching borrowed books" });
  }
};

export const totalOverdueDays = async (req, res) => {
  try {
    const { memberId } = req.params;
    const [rows] = await pool.query("SELECT fn_total_overdue_days(?) AS Total_Overdue_Days", [memberId]);
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching overdue days:", err);
    res.status(500).json({ error: "Database error fetching overdue days" });
  }
};

export const mostReservedBook = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT fn_most_reserved_book() AS Most_Reserved_Book");
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching most reserved book:", err);
    res.status(500).json({ error: "Database error fetching most reserved book" });
  }
};

export const canBorrow = async (req, res) => {
  try {
    const { memberId } = req.params;
    const [rows] = await pool.query("SELECT fn_can_borrow(?) AS Can_Borrow", [memberId]);
    res.json(rows[0]);
  } catch (err) {
    console.error("Error checking borrowing status:", err);
    res.status(500).json({ error: "Database error checking borrowing status" });
  }
};

// -------------------- 🔹 STORED PROCEDURES --------------------
export const borrowBook = async (req, res) => {
  try {
    const { member_id, book_id, staff_id } = req.body;
    await pool.query("CALL sp_borrow_book(?, ?, ?)", [member_id, book_id, staff_id]);
    res.json({ message: "Book borrowed successfully" });
  } catch (err) {
    console.error("Error borrowing book:", err);
    res.status(500).json({ error: "Database error borrowing book" });
  }
};

export const returnBook = async (req, res) => {
  try {
    const { transaction_id, fine } = req.body;
    await pool.query("CALL sp_return_book(?, ?)", [transaction_id, fine]);
    res.json({ message: "Book returned successfully" });
  } catch (err) {
    console.error("Error returning book:", err);
    res.status(500).json({ error: "Database error returning book" });
  }
};

export const extendDueDate = async (req, res) => {
  try {
    const { transaction_id, extra_days } = req.body;
    await pool.query("CALL sp_extend_due_date(?, ?)", [transaction_id, extra_days]);
    res.json({ message: "Due date extended successfully" });
  } catch (err) {
    console.error("Error extending due date:", err);
    res.status(500).json({ error: "Database error extending due date" });
  }
};

export const overdueBooks = async (req, res) => {
  try {
    const { memberId } = req.params;
    const [rows] = await pool.query("CALL sp_member_overdue_books(?)", [memberId]);
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching overdue books:", err);
    res.status(500).json({ error: "Database error fetching overdue books" });
  }
};

export const promoteMember = async (req, res) => {
  try {
    const { member_id } = req.body;
    await pool.query("CALL sp_promote_member(?)", [member_id]);
    res.json({ message: "Member promotion successful" });
  } catch (err) {
    console.error("Error promoting member:", err);
    res.status(500).json({ error: "Database error promoting member" });
  }
};
