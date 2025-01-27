async function login(event) {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const user = { email, password };

  try {
    const response = await axios.post("http://13.203.180.99/user/login", user);
    const token = response.data.token;
    localStorage.setItem("token", token);
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
function forgotPassword(event) {
  event.preventDefault();
  // Redirect user to the forgot password page
  window.location.href = "forgot.html";
}
