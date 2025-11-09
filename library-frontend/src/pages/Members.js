import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Members() {
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({
    first_name: "",
    second_name: "",
    last_name: "",
    email: "",
    phone: "",
    membership_type: "Regular",
  });

  // 🔹 Fetch members from backend
  const fetchMembers = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/members");
      setMembers(res.data);
    } catch (err) {
      console.error("Error fetching members:", err);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // 🔹 Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Add a new member
  const addMember = async () => {
    if (!form.first_name || !form.email || !form.phone) {
      alert("Please fill all required fields");
      return;
    }

    try {
      await axios.post("http://localhost:4000/api/members", form);
      alert("✅ Member added successfully!");
      setForm({
        first_name: "",
        second_name: "",
        last_name: "",
        email: "",
        phone: "",
        membership_type: "Regular",
      });
      fetchMembers(); // refresh list
    } catch (err) {
      console.error(err);
      alert("❌ Error adding member");
    }
  };

  // 🔹 Delete a member
  const deleteMember = async (id) => {
    if (!window.confirm("Delete this member?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/members/${id}`);
      alert("🗑️ Member deleted!");
      fetchMembers();
    } catch (err) {
      console.error(err);
      alert("❌ Error deleting member");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>👥 Members</h2>

      <h3>Add New Member</h3>
      <div style={{ marginBottom: "15px" }}>
        <input
          name="first_name"
          placeholder="First Name"
          value={form.first_name}
          onChange={handleChange}
          style={{ marginRight: "5px" }}
        />
        <input
          name="second_name"
          placeholder="Second Name"
          value={form.second_name}
          onChange={handleChange}
          style={{ marginRight: "5px" }}
        />
        <input
          name="last_name"
          placeholder="Last Name"
          value={form.last_name}
          onChange={handleChange}
          style={{ marginRight: "5px" }}
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          style={{ marginRight: "5px" }}
        />
        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          style={{ marginRight: "5px" }}
        />
        <select
          name="membership_type"
          value={form.membership_type}
          onChange={handleChange}
          style={{ marginRight: "5px" }}
        >
          <option value="Regular">Regular</option>
          <option value="Premium">Premium</option>
        </select>
        <button onClick={addMember}>Add Member</button>
      </div>

      <h3>Current Members</h3>
      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Type</th>
            <th>Date Joined</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {members.length > 0 ? (
            members.map((m) => (
              <tr key={m.Member_ID}>
                <td>{m.Member_ID}</td>
                <td>
                  {m.First_Name} {m.Second_Name ? m.Second_Name + " " : ""}
                  {m.Last_Name}
                </td>
                <td>{m.Email}</td>
                <td>{m.Phone}</td>
                <td>{m.Membership_Type}</td>
                <td>
                  {new Date(m.Date_of_Join).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td>
                  <button onClick={() => deleteMember(m.Member_ID)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" align="center">
                No members found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
