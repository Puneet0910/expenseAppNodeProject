async function sendResetLink(event) {
  event.preventDefault();
  const email = document.getElementById("email").value;
  console.log(email);

  try {
    const response = await axios.post(
      "http://43.205.15.199/password/forgot-password",
      { email }
    );
    alert("Password reset link has been sent to your email!");
    window.location.href = "/index.html";
  } catch (error) {
    if (error.response) {
      alert(error.response.data.message);
    } else {
      console.error(error);
      alert("An unexpected error occurred. Please try again.");
    }
  }
}
