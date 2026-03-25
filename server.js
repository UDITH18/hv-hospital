// server.js
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // serve frontend files

// ------------------------
// MySQL Connection Pool
// ------------------------
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ------------------------
// Add Appointment
// ------------------------
app.post("/appointment", async (req, res) => {
    const { name, email, phone, department, symptoms } = req.body;

    if (!name || !email || !phone || !department) {
        return res.status(400).json({ message: "Please fill all required fields" });
    }

    try {
        const [result] = await pool.query(
            "INSERT INTO appointments (name, email, phone, department, symptoms) VALUES (?, ?, ?, ?, ?)",
            [name, email, phone, department, symptoms]
        );

        res.json({ message: "Appointment booked successfully!" });
    } catch (err) {
        console.error("MySQL insert error:", err);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
});

// ------------------------
// Get Appointments (for admin)
// ------------------------
app.get("/appointments", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM appointments ORDER BY id DESC");
        res.json(rows);
    } catch (err) {
        console.error("MySQL fetch error:", err);
        res.status(500).json({ message: "Server error. Cannot fetch appointments." });
    }
});

// ------------------------
// Delete Appointment
// ------------------------
app.delete("/appointments/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("DELETE FROM appointments WHERE id = ?", [id]);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        console.error("MySQL delete error:", err);
        res.status(500).json({ message: "Server error. Cannot delete appointment." });
    }
});

// ------------------------
// Start Server
// ------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});