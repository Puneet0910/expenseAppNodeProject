async   function login(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const user = { email, password };

    try {
        const response = await axios.post("http://localhost:3000/user/login", user);
        console.log("Response:", response.data);
        alert("Login successful!");
        location.href = "expense.html";
    } catch (error) {
        if (error.response) {
            alert(error.response.data.message);
        } else {
            console.error(error);
            alert("An unexpected error occurred. Please try again.");
        }
    }
}