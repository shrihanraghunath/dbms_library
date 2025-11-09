import React, { useState } from "react";
import axios from "axios";
import BorrowList from "../components/BorrowList";

const Borrow = () => {
  const [memberId, setMemberId] = useState("");
  const [bookId, setBookId] = useState("");
  const [staffId, setStaffId] = useState("");

  const handleBorrow = async () => {
    if (!memberId || !bookId || !staffId) {
      alert("Please fill all fields!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:4000/api/borrow", {
        member_id: memberId,
        book_id: bookId,
        staff_id: staffId,
      });
      alert(res.data.message || "Book borrowed successfully!");
      window.location.reload();
    } catch (err) {
      console.error("Error borrowing book:", err);
      alert("Error borrowing book");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📘 Borrow Books</h2>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="number"
          placeholder="Member ID"
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          type="number"
          placeholder="Book ID"
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          type="number"
          placeholder="Staff ID"
          value={staffId}
          onChange={(e) => setStaffId(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <button onClick={handleBorrow} style={{ backgroundColor: "#007bff", color: "#fff", padding: "8px 16px", border: "none" }}>
          Borrow Book
        </button>
      </div>
      <BorrowList />
    </div>
  );
};

export default Borrow;
