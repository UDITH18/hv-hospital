const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// 🔥 CONNECT TO MONGODB
mongoose.connect("mongodb+srv://admin:admin123@cluster0.dichurd.mongodb.net/hospitalDB?retryWrites=true&w=majority")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));


// 📦 SCHEMA
const appointmentSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    department: String,
    symptoms: String
});

// 📦 MODEL
const Appointment = mongoose.model("Appointment", appointmentSchema);


// ✅ ADD APPOINTMENT
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


// ✅ GET ALL APPOINTMENTS
app.get("/appointments", async (req, res) => {
    const data = await Appointment.find();
    res.json(data);
});


// ✅ DELETE APPOINTMENT
app.delete("/appointments/:id", async (req, res) => {

    await Appointment.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted successfully" });
});


// 🚀 START SERVER
app.listen(PORT, () => {
    console.log("Server running on http://localhost:3000");
});