import React, { useEffect, useState } from "react";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [totalCopies, setTotalCopies] = useState(1);
  const [availableCopies, setAvailableCopies] = useState(1);

  // 🔹 Fetch all books
  const fetchBooks = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/books");
      const data = await res.json();
      setBooks(data);
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // 🔹 Add new book
  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:4000/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          genre,
          total_copies: totalCopies,
          available_copies: availableCopies,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        alert("✅ Book added successfully!");
        fetchBooks();
        setTitle("");
        setGenre("");
        setTotalCopies(1);
        setAvailableCopies(1);
      } else {
        alert("⚠️ Error adding book: " + data.error);
      }
    } catch (err) {
      console.error("Error adding book:", err);
      alert("Failed to add book.");
    }
  };

  // 🔹 Delete book
  const handleDeleteBook = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      const res = await fetch(`http://localhost:4000/api/books/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok) {
        alert("🗑️ Book deleted successfully!");
        fetchBooks();
      } else {
        alert("⚠️ " + data.error);
      }
    } catch (err) {
      console.error("Error deleting book:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📚 Manage Books</h2>

      {/* Add new book form */}
      <form onSubmit={handleAddBook} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Book Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Total Copies"
          value={totalCopies}
          onChange={(e) => setTotalCopies(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Available Copies"
          value={availableCopies}
          onChange={(e) => setAvailableCopies(e.target.value)}
          required
        />
        <button type="submit">Add Book</button>
      </form>

      {/* Book list */}
      <h3>📖 Current Books</h3>
      {books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Genre</th>
              <th>Total Copies</th>
              <th>Available Copies</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.book_id}>
                <td>{book.book_id}</td>
                <td>{book.title}</td>
                <td>{book.genre}</td>
                <td>{book.total_copies}</td>
                <td>{book.available_copies}</td>
                <td>
                  <button onClick={() => handleDeleteBook(book.book_id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BookList;
