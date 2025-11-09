import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function MemberList() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await api.get("/members");
      setMembers(res.data);
    } catch (err) {
      console.error("Error fetching members:", err);
    }
  };

  return (
    <div>
      <h2>👥 Members List</h2>
      <table border="1" cellPadding="10" style={{ width: "100%", marginTop: "20px", borderCollapse: "collapse" }}>
        <thead style={{ background: "#f0f0f0" }}>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Type</th>
            <th>Date Joined</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.Member_ID}>
              <td>{m.Member_ID}</td>
              <td>{`${m.First_Name} ${m.Last_Name}`}</td>
              <td>{m.Email}</td>
              <td>{m.Phone}</td>
              <td>{m.Membership_Type}</td>
              <td>{new Date(m.Date_of_Join).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
