// script.js
const form = document.getElementById("appointmentForm");

form.addEventListener("submit", async function(e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const department = document.getElementById("department").value;
    const symptoms = document.getElementById("symptoms").value.trim();

    if (!name || !email || !phone || !department) {
        alert("Please fill all required fields");
        return;
    }

    try {
        const response = await fetch("/appointment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, phone, department, symptoms })
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message || "Appointment booked successfully!");
            form.reset();
        } else {
            alert(data.message || "Failed to submit form. Try again.");
        }
    } catch (error) {
        console.error("Fetch error:", error);
        alert("Server error. Please try later.");
    }
});