const db = require("../config/db");

exports.addNurse = async (req, res) => {
  try {
    const {name, license_number, dob, age } = req.body;
    
    const [result] = await db.query(
      "INSERT INTO nurses (name, license_number, dob, age) VALUES (?, ?, ?, ?)",
      [name, license_number, dob, age]
    );
    res.status(201).json({ message: "Nurse added successfully", nurseId: result.insertId });
  } catch (err) {
    console.error("Error adding nurse: ", err);
    res.status(500).json({ error: "Failed to add nurse" });
  }
}

exports.getNurses = async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM nurses WHERE status = 1");
    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching nurses: ", err);
    res.status(500).json({ error: "Failed to fetch nurses" });
  }
}

exports.updateNurse = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, license_number, dob, age } = req.body;
    
    const updates = [];
    const values = [];
    
    if (name !== undefined) {
      updates.push("name = ?");
      values.push(name);
    }
    if (license_number !== undefined) {
      updates.push("license_number = ?");
      values.push(license_number);
    }
    if (dob !== undefined) {
        updates.push("dob = ?");
      values.push(dob);
    }
    if (age !== undefined) {
      updates.push("age = ?");
      values.push(age);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: "No fields provided to update" });
    }
    
    values.push(id);
    const query = `UPDATE nurses SET ${updates.join(", ")} WHERE id = ?`;
    
    await db.query(query, values);
    res.status(200).json({ message: "Nurse updated successfully" });
  } catch (err) {
    console.error("Error updating nurse: ", err);
    res.status(500).json({ error: "Failed to update nurse" });
  }
}

exports.deleteNurse = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("UPDATE nurses SET status = 0 WHERE id = ?", [id]);
    res.status(200).json({ message: "Nurse deleted successfully" });
  } catch (err) {
    console.error("Error deleting nurse: ", err);
    res.status(500).json({ error: "Failed to delete nurse" });
  }
}