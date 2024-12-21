async function sendResetLink(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    console.log(email);
    
    try {
        const response = await axios.post("http://localhost:3000/password/forgot-password", { email });
        alert("Password reset link has been sent to your email!");
    } catch (error) {
        if (error.response) {
            alert(error.response.data.message);
        } else {
            console.error(error);
            alert("An unexpected error occurred. Please try again.");
        }
    }
}