import React, { useState } from "react";
import axios from "axios";

const UtilPage = () => {
  const [memberId, setMemberId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [fine, setFine] = useState("");
  const [extraDays, setExtraDays] = useState("");
  const [result, setResult] = useState("");

  const api = "http://localhost:4000/api/utils";

  // 🔹 GET (for functions)
  const callFunction = async (endpoint) => {
    try {
      const { data } = await axios.get(`${api}/${endpoint}`);
      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setResult(`❌ Error: ${err.response?.data?.error || err.message}`);
    }
  };

  // 🔹 POST (for procedures)
  const callProcedure = async (endpoint, params = {}) => {
    try {
      const { data } = await axios.post(`${api}/${endpoint}`, params);
      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setResult(`❌ Error: ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial, sans-serif" }}>
      <h2>🧩 Utilities Dashboard</h2>
      <p>Test all library functions and procedures easily from here.</p>

      {/* ===================== FUNCTIONS ===================== */}
      <div style={{ marginTop: "30px" }}>
        <h3>📘 Library Functions</h3>

        {/* Fine Calculation */}
        <div style={{ margin: "10px 0" }}>
          <label>📅 Due Date: </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            style={{ marginRight: "10px" }}
          />
          <button onClick={() => callFunction(`fn_calculate_fine/${dueDate}`)}>
            Calculate Fine
          </button>
        </div>

        {/* Member-based functions */}
        <div style={{ margin: "10px 0" }}>
          <label>🧑 Member ID: </label>
          <input
            type="number"
            placeholder="Enter Member ID"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            style={{ marginRight: "10px" }}
          />
          <button onClick={() => callFunction(`fn_books_borrowed/${memberId}`)}>
            View Books Borrowed
          </button>
          <button onClick={() => callFunction(`fn_total_overdue_days/${memberId}`)} style={{ marginLeft: "10px" }}>
            View Total Overdue Days
          </button>
          <button onClick={() => callFunction(`fn_can_borrow/${memberId}`)} style={{ marginLeft: "10px" }}>
            Check Borrow Eligibility
          </button>
        </div>

        {/* Most reserved book */}
        <div style={{ margin: "10px 0" }}>
          <button onClick={() => callFunction("fn_most_reserved_book")}>
            Show Most Reserved Book
          </button>
        </div>
      </div>

      {/* ===================== PROCEDURES ===================== */}
      <div style={{ marginTop: "40px" }}>
        <h3>⚙️ Library Procedures</h3>

        {/* Return Book */}
        <div style={{ margin: "10px 0" }}>
          <label>🔁 Transaction ID: </label>
          <input
            type="number"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            style={{ marginRight: "10px" }}
          />
          <label>💰 Fine: </label>
          <input
            type="number"
            placeholder="Enter Fine Amount"
            value={fine}
            onChange={(e) => setFine(e.target.value)}
            style={{ marginRight: "10px" }}
          />
          <button
            onClick={() => callProcedure("sp_return_book", { transaction_id: transactionId, fine })}
          >
            Return Book
          </button>
        </div>

        {/* Extend Due Date */}
        <div style={{ margin: "10px 0" }}>
          <label>📅 Transaction ID: </label>
          <input
            type="number"
            placeholder="Enter Transaction ID"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            style={{ marginRight: "10px" }}
          />
          <label>➕ Extra Days: </label>
          <input
            type="number"
            placeholder="Enter Extra Days"
            value={extraDays}
            onChange={(e) => setExtraDays(e.target.value)}
            style={{ marginRight: "10px" }}
          />
          <button
            onClick={() => callProcedure("sp_extend_due_date", { transaction_id: transactionId, extra_days: extraDays })}
          >
            Extend Due Date
          </button>
        </div>

        {/* Promote Member */}
        <div style={{ margin: "10px 0" }}>
          <label>⭐ Member ID: </label>
          <input
            type="number"
            placeholder="Enter Member ID"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            style={{ marginRight: "10px" }}
          />
          <button onClick={() => callProcedure("sp_promote_member", { member_id: memberId })}>
            Promote Member
          </button>
        </div>
      </div>

      {/* ===================== OUTPUT ===================== */}
      <div style={{ marginTop: "40px" }}>
        <h3>🧾 Output</h3>
        <pre
          style={{
            background: "#f4f4f4",
            padding: "15px",
            borderRadius: "8px",
            fontSize: "14px",
            minHeight: "100px",
          }}
        >
          {result || "Results will appear here..."}
        </pre>
      </div>
    </div>
  );
};

export default UtilPage;
