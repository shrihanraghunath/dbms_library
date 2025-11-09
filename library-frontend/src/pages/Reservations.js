import React, { useState, useEffect } from "react";
import axios from "axios";

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [memberId, setMemberId] = useState("");
  const [bookId, setBookId] = useState("");
  const [staffId, setStaffId] = useState("");
  const [message, setMessage] = useState("");

  // 🔹 Fetch all reservations from backend
  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/reservations");
      setReservations(response.data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      setMessage("❌ Failed to fetch reservations");
    }
  };

  // 🔹 Add new reservation
  const handleAddReservation = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/api/reservations", {
        member_id: memberId,
        book_id: bookId,
        staff_id: staffId,
      });
      setMessage("✅ Reservation added successfully!");
      fetchReservations();
      setMemberId("");
      setBookId("");
      setStaffId("");
    } catch (error) {
      console.error("Error adding reservation:", error);
      setMessage("❌ Failed to add reservation");
    }
  };

  // 🔹 Cancel reservation
  const cancelReservation = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/reservations/${id}`);
      setMessage("⚠️ Reservation cancelled");
      fetchReservations();
    } catch (error) {
      console.error("Error cancelling reservation:", error);
      setMessage("❌ Failed to cancel reservation");
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Poppins" }}>
      <h2>📅 Manage Reservations</h2>

      <form onSubmit={handleAddReservation} style={{ marginBottom: "25px" }}>
        <div>
          <label>Member ID: </label>
          <input
            type="number"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Book ID: </label>
          <input
            type="number"
            value={bookId}
            onChange={(e) => setBookId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Staff ID: </label>
          <input
            type="number"
            value={staffId}
            onChange={(e) => setStaffId(e.target.value)}
            required
          />
        </div>
        <button type="submit">➕ Add Reservation</button>
      </form>

      {message && <p>{message}</p>}

      <h3>📋 Current Reservations</h3>
      <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead style={{ backgroundColor: "#f0f0f0" }}>
          <tr>
            <th>ID</th>
            <th>Member</th>
            <th>Book</th>
            <th>Staff</th>
            <th>Date</th>
            <th>Status</th>
            <th>Cancel</th>
          </tr>
        </thead>
        <tbody>
          {reservations.length > 0 ? (
            reservations.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.member_name}</td>
                <td>{r.book_title}</td>
                <td>{r.staff_name}</td>
                <td>{r.reservation_date}</td>
                <td>{r.status}</td>
                <td>
                  <button
                    onClick={() => cancelReservation(r.id)}
                    style={{ backgroundColor: "#ff4d4d", color: "white", border: "none", cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No reservations found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Reservations;
