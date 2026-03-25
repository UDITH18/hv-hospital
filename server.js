const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

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
// TEST DB CONNECTION
// ------------------------
(async () => {
    try {
        const conn = await pool.getConnection();
        console.log("✅ Connected to Railway MySQL");
        conn.release();
    } catch (err) {
        console.error("❌ DB Connection Failed:", err);
    }
})();

// ------------------------
// Create Table Automatically
// ------------------------
async function createTable() {
    try {
        await pool.query(`
        CREATE TABLE IF NOT EXISTS appointments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100),
            email VARCHAR(100),
            phone VARCHAR(20),
            department VARCHAR(100),
            symptoms TEXT
        )
        `);
        console.log("✅ Appointments table ready");
    } catch (err) {
        console.error("❌ Table creation error:", err);
    }
}
createTable();

// ------------------------
// Add Appointment
// ------------------------
app.post("/appointment", async (req, res) => {

    console.log("📩 Incoming data:", req.body); // DEBUG

    const { name, email, phone, department, symptoms } = req.body;

    if (!name || !email || !phone || !department) {
        return res.status(400).json({
            message: "Please fill all required fields"
        });
    }

    try {

        const [result] = await pool.query(
            "INSERT INTO appointments (name, email, phone, department, symptoms) VALUES (?, ?, ?, ?, ?)",
            [
                name,
                email,
                String(phone),   // 👈 ensure string
                department,
                symptoms || ""
            ]
        );

        console.log("✅ Insert success:", result);

        res.json({
            message: "✅ Appointment booked successfully!"
        });

    } catch (err) {

        console.error("❌ FULL ERROR:", err);

        res.status(500).json({
            message: err.message   // 👈 SHOW REAL ERROR
        });
    }
});

// ------------------------
// Get All Appointments
// ------------------------
app.get("/appointments", async (req, res) => {

    try {

        const [rows] = await pool.query(
            "SELECT * FROM appointments ORDER BY id DESC"
        );

        res.json(rows);

    } catch (err) {

        console.error("❌ MySQL fetch error:", err);

        res.status(500).json({
            message: err.message
        });
    }
});

// ------------------------
// Delete Appointment
// ------------------------
app.delete("/appointments/:id", async (req, res) => {

    const { id } = req.params;

    try {

        await pool.query(
            "DELETE FROM appointments WHERE id = ?",
            [id]
        );

        res.json({
            message: "✅ Deleted successfully"
        });

    } catch (err) {

        console.error("❌ MySQL delete error:", err);

        res.status(500).json({
            message: err.message
        });
    }
});

// ------------------------
// Start Server
// ------------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("🚀 Server running on port " + PORT);
});