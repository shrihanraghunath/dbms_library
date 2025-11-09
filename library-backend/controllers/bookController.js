import pool from "../config/db.js";

// ✅ Get all books
export const getAllBooks = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM book");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching books:", err);
    res.status(500).json({ error: "Failed to fetch books" });
  }
};

// ✅ Add a book
export const addBook = async (req, res) => {
  try {
    const {
      title,
      isbn,
      genre,
      edition,
      total_copies,
      available_copies,
      publisher_id,
    } = req.body;

    const sql = `
      INSERT INTO book 
      (Title, ISBN, Genre, Edition, Total_Copies, Available_Copies, Publisher_ID)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await pool.query(sql, [
      title,
      isbn,
      genre,
      edition,
      total_copies,
      available_copies,
      publisher_id,
    ]);

    res.json({ message: "Book added successfully" });
  } catch (err) {
    console.error("Error adding book:", err);
    res.status(500).json({ error: "Failed to add book" });
  }
};

// ✅ Delete a book
export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM book WHERE Book_ID = ?", [id]);
    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    console.error("Error deleting book:", err);
    res.status(500).json({ error: "Failed to delete book" });
  }
};
