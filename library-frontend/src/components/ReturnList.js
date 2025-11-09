import React, { useEffect, useState } from "react";
import axios from "axios";

const ReturnList = () => {
  const [returns, setReturns] = useState([]);
  const [transactionId, setTransactionId] = useState("");
  const [fine, setFine] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/returns");
      setReturns(res.data);
    } catch (err) {
      console.error("Error fetching return data:", err);
    }
  };

  const handleReturn = async () => {
    try {
      await axios.post("http://localhost:4000/api/returns", {
        transaction_id: transactionId,
        fine: fine || 0,
      });
      setMessage("✅ Book returned successfully!");
      fetchReturns();
    } catch (err) {
      console.error(err);
      setMessage("❌ Error returning book.");
    }
  };

  // 🔹 Fine calculation call
 const handleFineCalc = async (dueDate) => {
  try {
    const formattedDate = dueDate.split("T")[0];
    const res = await fetch(`http://localhost:4000/api/returns/fine/${formattedDate}`);
    const data = await res.json();

    if (data.fine !== undefined) {
      alert(`Fine for due date ${formattedDate}: ₹${data.fine}`);
    } else {
      alert("No fine or invalid response");
    }
  } catch (err) {
    alert("Error calculating fine");
    console.error(err);
  }
};

  return (
    <div className="container mt-4">
      <h2>📘 Return Books</h2>
      <div>
        <input
          type="text"
          placeholder="Transaction ID"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
        />
        <input
          type="number"
          placeholder="Fine Amount (₹)"
          value={fine}
          onChange={(e) => setFine(e.target.value)}
        />
        <button onClick={handleReturn}>Return Book</button>
      </div>
      <p>{message}</p>

      <h3>📦 Return Records</h3>
      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Member</th>
            <th>Book</th>
            <th>Issue Date</th>
            <th>Due Date</th>
            <th>Return Date</th>
            <th>Status</th>
            <th>Fine</th>
          </tr>
        </thead>
        <tbody>
          {returns.length > 0 ? (
            returns.map((r) => (
              <tr key={r.transaction_id}>
                <td>{r.transaction_id}</td>
                <td>{r.member_name}</td>
                <td>{r.book_title}</td>
                <td>{new Date(r.issue_date).toLocaleDateString()}</td>
                <td>{new Date(r.due_date).toLocaleDateString()}</td>
                <td>
                  {r.return_date
                    ? new Date(r.return_date).toLocaleDateString()
                    : "—"}
                </td>
                <td>{r.status}</td>
                <td>
                  <button onClick={() => handleFineCalc(r.due_date)}>
                    💰 Calculate Fine
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" align="center">
                No transactions yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReturnList;
