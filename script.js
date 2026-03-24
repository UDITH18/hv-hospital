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

    const response = await fetch("http://localhost:3000/appointment", {

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

    const data = await response.json();

    alert(data.message);

    form.reset();

});