const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // serve frontend files

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// ✅ Schema
const appointmentSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    department: String,
    symptoms: String
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

// ✅ Add Appointment
app.post("/appointment", async (req, res) => {
    const { name, email, phone, department, symptoms } = req.body;

    if (!name || !email || !phone || !department) {
        return res.json({ message: "Please fill all fields" });
    }

    const newAppointment = new Appointment({
        name,
        email,
        phone,
        department,
        symptoms
    });

    await newAppointment.save();

    res.json({ message: "Appointment stored successfully" });
});

// ✅ Get Appointments
app.get("/appointments", async (req, res) => {
    const data = await Appointment.find();
    res.json(data);
});

// ✅ Delete Appointment
app.delete("/appointments/:id", async (req, res) => {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
});

// ✅ Render Port Fix
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});