require("dotenv").config();
const Sib = require("sib-api-v3-sdk");
const uuid = require("uuid");
const bcrypt = require("bcrypt");

const User = require("../models/userModel");
const ForgotPassword = require("../models/forgotPassword");

// Forgot Password Request
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error("User doesn't exist");
    }

    // Generate a unique reset token
    const id = uuid.v4();

    // Create a ForgotPassword record
    await ForgotPassword.create({
      id,
      userId: user.id,
      active: true,
    });

    // Configure Sendinblue client
    const client = Sib.ApiClient.instance;
    const apiKey = client.authentications["api-key"];
    apiKey.apiKey = process.env.EMAIL_API;

    const emailApi = new Sib.TransactionalEmailsApi();

    // Construct the email
    const resetLink = `http://13.200.222.79/password/reset-Password/${id}`;
    const message = {
      sender: { email: "nainwalpuneet@gmail.com", name: "Expense Tracker" },
      to: [{ email }],
      subject: "Forgot Password",
      htmlContent: `<p>Hello,</p><p>Click the link below to reset your password:</p><a href="${resetLink}">Reset Password</a>`,
    };

    // Send the email
    await emailApi.sendTransacEmail(message);

    res.status(200).json({
      message: "Link to reset password sent to your email.",
      success: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message, success: false });
  }
};

// Reset Password
exports.resetPassword = async (req, res, next) => {
  const id = req.params.id;

  try {
    const forgotPasswordRequest = await ForgotPassword.findOne({
      where: { id },
    });

    if (!forgotPasswordRequest || !forgotPasswordRequest.active) {
      return res.status(404).json({ message: "Invalid or expired token." });
    }

    // Mark the token as used
    await forgotPasswordRequest.update({ active: false });

    res.status(200).send(`
      <html>
        <script> 
          function formSubmitted(e) {
            e.preventDefault();
            console.log('Form submitted');
          }
        </script>
        <form action="/password/update-Password/${id}" method="POST">
          <label for="newpassword">Enter New Password:</label>
          <input name="newpassword" type="password" required />
          <button type="submit">Reset Password</button>
        </form>
      </html>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong." });
  }
};

// Update Password
// Update Password
exports.updatePassword = async (req, res, next) => {
  try {
    const { newpassword } = req.body; // Extract new password
    const { id } = req.params; // Extract ID from URL params

    console.log("ID passed to updatePassword:", id);
    console.log("New password received:", newpassword); // Log to check if the password is coming in

    // Check if the newpassword is defined and not empty
    if (!newpassword || !id) {
      return res
        .status(400)
        .json({ message: "New password and ID are required." });
    }

    // Find the reset request
    const resetPasswordRequest = await ForgotPassword.findOne({
      where: { id },
    });
    if (!resetPasswordRequest) {
      return res.status(404).json({ message: "Invalid reset request." });
    }

    // Find the associated user
    const user = await User.findOne({
      where: { id: resetPasswordRequest.userId },
    });
    if (!user) {
      return res.status(404).json({ message: "User does not exist." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newpassword, 10);

    // Update the user's password
    await user.update({ password: hashedPassword });

    // Send a success response with alert and redirect
    res.status(200).send(`
        <html>
          <head>
            <script>
              alert("Password updated successfully.");
              window.location.href = "/index.html";  // Redirect to login page
            </script>
          </head>
          <body>
            <!-- The page will be redirected after the alert -->
          </body>
        </html>
      `);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Something went wrong.", error: err.message });
  }
};
