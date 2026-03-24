function scrollToAppointment() {
    document.getElementById("appointment").scrollIntoView({
        behavior: "smooth"
    });
}

const form = document.getElementById("appointmentForm");

form.addEventListener("submit", async function(e) {

    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const department = document.getElementById("department").value;
    const symptoms = document.getElementById("symptoms").value;

    try {
        const response = await fetch("/appointment", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name,
                email,
                phone,
                department,
                symptoms
            })

        });

        if (response.ok) {
            const data = await response.json();
            alert(data.message || "Appointment booked successfully");
            form.reset();
        } else {
            alert("Failed to submit form");
        }

    } catch (error) {
        console.error(error);
        alert("Server error. Try again later.");
    }

});