import React, { useEffect, useState } from "react";
import axios from "axios";

const BorrowList = () => {
  const [borrows, setBorrows] = useState([]);

  useEffect(() => {
    const fetchBorrows = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/borrow");
        setBorrows(res.data);
      } catch (err) {
        console.error("Error fetching borrow records:", err);
      }
    };
    fetchBorrows();
  }, []);

  return (
    <div>
      <h2>📚 Current Borrow Records</h2>
      <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead style={{ backgroundColor: "#eaeaea" }}>
          <tr>
            <th>ID</th>
            <th>Member</th>
            <th>Book</th>
            <th>Issue Date</th>
            <th>Due Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {borrows.length > 0 ? (
            borrows.map((b) => (
              <tr key={b.transaction_id}>
                <td>{b.transaction_id}</td>
                <td>{b.member_name}</td>
                <td>{b.book_title}</td>
                <td>{new Date(b.issue_date).toLocaleDateString()}</td>
                <td>{new Date(b.due_date).toLocaleDateString()}</td>
                <td>{b.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No borrowed books currently.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BorrowList;
