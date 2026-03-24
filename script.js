const form = document.getElementById("appointmentForm");

form.addEventListener("submit", async function(e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const department = document.getElementById("department").value;
    const symptoms = document.getElementById("symptoms").value.trim();

    // 🔹 Debug: log form data
    console.log("Submitting appointment:", { name, email, phone, department, symptoms });

    try {
        const response = await fetch("/appointment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, phone, department, symptoms })
        });

        // 🔹 Debug: log raw response
        console.log("Response status:", response.status);

        const data = await response.json();

        if (response.ok) {
            alert(data.message || "Appointment booked successfully!");
            form.reset();
        } else {
            alert(data.message || "Failed to submit form");
        }

        // 🔹 Debug: log response data
        console.log("Response data:", data);

    } catch (error) {
        console.error("Fetch error:", error);
        alert("Server error. Try again later.");
    }
});