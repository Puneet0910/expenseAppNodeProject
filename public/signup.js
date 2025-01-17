async function signup(event) {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const userData = { name, email, password };

  try {
    const response = await axios.post(
      "http://65.1.221.190/user/signup",
      userData
    );
    alert(response.data.message); // Success message from controller
    location.href = "index.html";
  } catch (error) {
    if (error.response) {
      // Handle specific status codes
      if (error.response.status === 409) {
        alert("Email already exists. Please use a different email.");
      } else {
        alert(error.response.data.message || "Something went wrong!");
      }
    } else {
      // Handle other errors (e.g., network issues)
      console.error(error);
      alert("An unexpected error occurred. Please try again.");
    }
  }
}
