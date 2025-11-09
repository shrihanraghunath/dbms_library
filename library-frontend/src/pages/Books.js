import React, { useEffect, useState } from "react";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    title: "",
    isbn: "",
    genre: "",
    edition: "",
    total_copies: "",
    available_copies: "",
    publisher_id: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

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

  // 🔹 Add a new book
  const handleAddBook = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await fetch("http://localhost:4000/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBook),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Book added successfully!");
        setNewBook({
          title: "",
          isbn: "",
          genre: "",
          edition: "",
          total_copies: "",
          available_copies: "",
          publisher_id: "",
        });
        fetchBooks();
      } else {
        setError(data.error || "Error adding book");
      }
    } catch (err) {
      setError("Server error while adding book");
      console.error(err);
    }
  };

  // 🔹 Delete a book
  const handleDelete = async (bookId) => {
    try {
      const res = await fetch(`http://localhost:4000/api/books/${bookId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setMessage("🗑️ Book deleted successfully");
        fetchBooks();
      } else {
        setError("Failed to delete book");
      }
    } catch (err) {
      console.error(err);
      setError("Server error while deleting book");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📚 Book Management</h2>

      {/* ➕ Add Book Form */}
      <form onSubmit={handleAddBook} style={{ marginBottom: "2rem" }}>
        <h3>Add New Book</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px", maxWidth: "700px" }}>
          <input
            type="text"
            placeholder="Title"
            value={newBook.title}
            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="ISBN"
            value={newBook.isbn}
            onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Genre"
            value={newBook.genre}
            onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
          />
          <input
            type="text"
            placeholder="Edition"
            value={newBook.edition}
            onChange={(e) => setNewBook({ ...newBook, edition: e.target.value })}
          />
          <input
            type="number"
            placeholder="Total Copies"
            value={newBook.total_copies}
            onChange={(e) => setNewBook({ ...newBook, total_copies: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Available Copies"
            value={newBook.available_copies}
            onChange={(e) => setNewBook({ ...newBook, available_copies: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Publisher ID"
            value={newBook.publisher_id}
            onChange={(e) => setNewBook({ ...newBook, publisher_id: e.target.value })}
            required
          />
        </div>

        <button type="submit" style={{ marginTop: "10px" }}>
          Add Book
        </button>
      </form>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* 📋 Book List */}
      <h3>Existing Books</h3>
      {books.length > 0 ? (
        <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "90%" }}>
          <thead>
            <tr style={{ background: "#eee" }}>
              <th>ID</th>
              <th>Title</th>
              <th>Genre</th>
              <th>Edition</th>
              <th>Available</th>
              <th>Total</th>
              <th>Publisher</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.Book_ID}>
                <td>{book.Book_ID}</td>
                <td>{book.Title}</td>
                <td>{book.Genre}</td>
                <td>{book.Edition}</td>
                <td>{book.Available_Copies}</td>
                <td>{book.Total_Copies}</td>
                <td>{book.Publisher_ID}</td>
                <td>
                  <button
                    style={{ background: "red", color: "white", border: "none", padding: "5px" }}
                    onClick={() => handleDelete(book.Book_ID)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No books found.</p>
      )}
    </div>
  );
};

export default BookList;
