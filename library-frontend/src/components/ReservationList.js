import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function ReservationList() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const res = await api.get("/reservations");
      setReservations(res.data);
    } catch (err) {
      console.error("Error fetching reservations:", err);
    }
  };

  return (
    <div>
      <h2>📅 Book Reservations</h2>
      <table border="1" cellPadding="10" style={{ width: "100%", marginTop: "20px" }}>
        <thead style={{ background: "#f0f0f0" }}>
          <tr>
            <th>ID</th>
            <th>Member</th>
            <th>Book</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((r) => (
            <tr key={r.Reservation_ID}>
              <td>{r.Reservation_ID}</td>
              <td>{r.Member_ID}</td>
              <td>{r.Book_ID}</td>
              <td>{new Date(r.Reservation_Date).toLocaleDateString()}</td>
              <td>{r.Status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
