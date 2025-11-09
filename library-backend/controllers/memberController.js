import pool from "../config/db.js";

// ✅ Get all members
export const getAllMembers = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Member");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Add a new member
export const addMember = async (req, res) => {
  try {
    const {
      first_name,
      second_name,
      last_name,
      email,
      phone,
      membership_type,
    } = req.body;

    if (!first_name || !email || !phone) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const sql = `
      INSERT INTO Member (First_Name, Second_Name, Last_Name, Email, Phone, Membership_Type, Date_of_Join)
      VALUES (?, ?, ?, ?, ?, ?, CURDATE())
    `;
    const [result] = await pool.query(sql, [
      first_name,
      second_name || null,
      last_name || null,
      email,
      phone,
      membership_type || "Regular",
    ]);

    // Fetch the inserted member
    const [member] = await pool.query(
      "SELECT * FROM Member WHERE Member_ID = ?",
      [result.insertId]
    );

    res.json({
      message: "Member added successfully",
      member: member[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ Delete member
export const deleteMember = async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM Member WHERE Member_ID = ?", [
      req.params.id,
    ]);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Member not found" });
    res.json({ message: "Member deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
