import React, { useState } from "react";
import api from "../api/api";

export default function UtilPage() {
  const [inputs, setInputs] = useState({
    memberId: "",
    bookId: "",
    transactionId: "",
    staffId: "",
    dueDate: "",
    fine: "",
    extraDays: "",
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleAction = async (endpoint, method = "get", data = {}) => {
    try {
      const res =
        method === "get"
          ? await api.get(`/utils/${endpoint}`)
          : await api.post(`/utils/${endpoint}`, data);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setResult({ error: "Failed to fetch" });
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 flex items-center">
        <span role="img" aria-label="utilities" className="mr-2">
          🧮
        </span>
        Utilities & Procedures
      </h2>

      {/* Input Fields */}
      <div className="grid grid-cols-5 gap-3 mb-8">
        <input
          type="text"
          name="memberId"
          value={inputs.memberId}
          onChange={handleChange}
          placeholder="Member ID"
          className="border rounded-lg p-2"
        />
        <input
          type="text"
          name="bookId"
          value={inputs.bookId}
          onChange={handleChange}
          placeholder="Book ID"
          className="border rounded-lg p-2"
        />
        <input
          type="text"
          name="transactionId"
          value={inputs.transactionId}
          onChange={handleChange}
          placeholder="Transaction ID"
          className="border rounded-lg p-2"
        />
        <input
          type="text"
          name="staffId"
          value={inputs.staffId}
          onChange={handleChange}
          placeholder="Staff ID"
          className="border rounded-lg p-2"
        />
        <input
          type="date"
          name="dueDate"
          value={inputs.dueDate}
          onChange={handleChange}
          className="border rounded-lg p-2"
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-5 mb-10">
        {/* Function Buttons */}
        <button
          className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 shadow-sm transition-all"
          onClick={() => handleAction(`fn_calculate_fine/${inputs.dueDate}`)}
        >
          💰 Calculate Fine
        </button>

        <button
          className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 shadow-sm transition-all"
          onClick={() => handleAction(`fn_books_borrowed/${inputs.memberId}`)}
        >
          📚 Books Borrowed
        </button>

        <button
          className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 shadow-sm transition-all"
          onClick={() =>
            handleAction(`fn_total_overdue_days/${inputs.memberId}`)
          }
        >
          ⏳ Total Overdue Days
        </button>

        <button
          className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 shadow-sm transition-all"
          onClick={() => handleAction(`fn_most_reserved_book`)}
        >
          🏆 Most Reserved Book
        </button>

        <button
          className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 shadow-sm transition-all"
          onClick={() => handleAction(`fn_can_borrow/${inputs.memberId}`)}
        >
          ✅ Can Borrow More?
        </button>

        {/* Procedure Buttons */}
        <button
          className="bg-purple-500 text-white px-6 py-3 rounded-xl hover:bg-purple-600 shadow-sm transition-all"
          onClick={() =>
            handleAction(`sp_member_overdue_books/${inputs.memberId}`)
          }
        >
          🔍 View Overdue Books
        </button>

        <button
          className="bg-teal-500 text-white px-6 py-3 rounded-xl hover:bg-teal-600 shadow-sm transition-all"
          onClick={() =>
            handleAction("sp_promote_member", "post", {
              member_id: inputs.memberId,
            })
          }
        >
          🌟 Promote Member
        </button>

        {/* New - Extend Due Date */}
        <button
          className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 shadow-sm transition-all"
          onClick={() =>
            handleAction("sp_extend_due_date", "post", {
              transaction_id: inputs.transactionId,
              extra_days: inputs.extraDays,
            })
          }
        >
          🗓️ Extend Due Date
        </button>

        
      </div>

      {/* Additional Inputs for new features */}
      <div className="flex gap-3 mb-8">
        <input
          type="text"
          name="extraDays"
          value={inputs.extraDays}
          onChange={handleChange}
          placeholder="Extra Days"
          className="border rounded-lg p-2 w-40"
        />
        <input
          type="text"
          name="fine"
          value={inputs.fine}
          onChange={handleChange}
          placeholder="Fine Amount"
          className="border rounded-lg p-2 w-40"
        />
      </div>

      {/* Result Box */}
      <div className="bg-white rounded-xl p-6 shadow-md border">
        <h3 className="text-xl font-semibold mb-3 flex items-center">
          <span role="img" aria-label="result" className="mr-2">
            📊
          </span>
          Result
        </h3>
        <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-sm leading-6">
          {result ? JSON.stringify(result, null, 2) : "No action yet"}
        </pre>
      </div>
    </div>
  );
}
