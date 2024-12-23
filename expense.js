const token = localStorage.getItem("token");
async function addExpense(event) {
  event.preventDefault();
  const amount = document.getElementById("amount").value;
  const description = document.getElementById("description").value;
  const category = document.getElementById("category").value;
  const expenseDetails = { amount, description, category };

  try {
    const response = await axios.post(
      "http://localhost:3000/expense/addExpense",
      expenseDetails,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    alert(response.data.message);
    displayExpenses();
  } catch (error) {
    console.log(error);
    alert(error.response.data.message);
  }
}

async function displayExpenses() {
  try {
    const response = await axios.get(
      "http://localhost:3000/expense/getExpenses",
      {
        headers: {
          Authorization: token,
        },
      }
    );
    const expenseList = document.getElementById("expense-list");
    expenseList.innerHTML = "";

    response.data.expenses.forEach((expense) => {
      const listItem = document.createElement("li");
      listItem.classList.add(
        "list-group-item",
        "d-flex",
        "justify-content-between",
        "align-items-center"
      );

      listItem.innerHTML = `
          <span><strong>Amount:</strong> ${expense.amount} <br> <strong>Description:</strong> ${expense.description} <br> <strong>Category:</strong> ${expense.category}</span>
        `;

      // Create the delete button
      const deleteButton = document.createElement("button");
      deleteButton.classList.add("btn", "btn-danger", "btn-sm");
      deleteButton.textContent = "Delete";

      // Delete button functionality
      deleteButton.addEventListener("click", async () => {
        try {
          await axios.delete(
            `http://localhost:3000/expense/deleteExpense/${expense.id}`
          );
          listItem.remove();
        } catch (error) {
          console.log(error);
        }
      });

      listItem.appendChild(deleteButton);

      expenseList.appendChild(listItem);
    });
  } catch (error) {
    console.log(error);
  }
}

function logout() {
  localStorage.removeItem("token");
  location.href = "login.html";
}

document.getElementById("pay-btn").addEventListener("click", async () => {
  try {
    const response = await axios.post(
      "http://localhost:3000/payment/create-order",
      {}, // No payload required here
      {
        headers: { Authorization: token },
      }
    );

    const { orderId, amount, currency } = response.data;

    const options = {
      key: "rzp_test_068eIzOsOm5Jr3", // Replace with Razorpay Key ID
      amount,
      currency,
      name: "Expense Tracker Premium",
      description: "Upgrade to premium",
      order_id: orderId,
      handler: async function (paymentResponse) {
        try {
          await axios.post(
            "http://localhost:3000/payment/verify-payment",
            {
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
            },
            {
              headers: { Authorization: token },
            }
          );
          alert("Payment Successful! You are now a premium user.");
          location.reload(); // Refresh the page to update the UI
        } catch (error) {
          console.log(error);
          alert("Payment verification failed.");
        }
      },
      theme: {
        color: "#F37254",
      },
    };

    const rzp = new Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error(error);
    alert("Failed to initiate payment. Please try again.");
  }
});

document.getElementById("leaderboard-btn").addEventListener("click", async () => {
  try {
    const response = await axios.get("http://localhost:3000/leaderboard", {
      headers: { Authorization: token },
    });

    const leaderboardData = response.data.leaderboard;

    const leaderboardContainer = document.createElement("div");
    leaderboardContainer.classList.add("container", "mt-4");
    leaderboardContainer.innerHTML = `
      <h3 class="text-center">Leaderboard</h3>
      <ul class="list-group">
        ${leaderboardData
          .map(
            (user) =>
              `<li class="list-group-item d-flex justify-content-between align-items-center">
                <span>${user.name}</span>
                <span>${user.totalExpense}</span>
              </li>`
          )
          .join("")}
      </ul>
    `;

    document.body.appendChild(leaderboardContainer);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    alert("Failed to load leaderboard. Please try again.");
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  try {
    if (!token) {
      alert("Please Login");
      location.href = "login.html";
      return;
    }

    // Fetch user details
    const response = await axios.get("http://localhost:3000/user/getUserDetails", {
      headers: { Authorization: token },
    });

    const isPremium = response.data.isPremium;

    if (isPremium) {
      // Show Premium User badge/message
      const premiumBadge = document.createElement("div");
      premiumBadge.classList.add("alert", "alert-success", "text-center");
      premiumBadge.textContent = "🌟 You are a Premium User! 🌟";
      document.body.insertBefore(premiumBadge, document.body.firstChild);

      // Show Leaderboard button and hide Pay button
      document.getElementById("leaderboard-btn").style.display = "inline-block";
      document.getElementById("pay-btn").style.display = "none";
      document.getElementById("download-pdf-btn").style.display = "inline-block";
      document.getElementById("download-excel-btn").style.display = "inline-block";
    }

    // Load expenses
    displayExpenses();
  } catch (error) {
    console.error("Error loading user details:", error);
    alert("Failed to load user details. Please try again.");
  }
});

document.getElementById("download-pdf-btn").addEventListener("click", async () => {
  try {
    const response = await axios.get("http://localhost:3000/report/download-pdf", {
      headers: { Authorization: token },
      responseType: "blob", // Ensure the response is treated as a file
    });

    // Create a Blob URL for the file
    const blob = new Blob([response.data], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "ExpensesReport.pdf";
    link.click();
  } catch (error) {
    console.error("Error downloading PDF:", error);
    alert("Failed to download PDF. Please try again.");
  }
});

document.getElementById("download-excel-btn").addEventListener("click", async () => {
  try {
    const response = await axios.get("http://localhost:3000/report/download-excel", {
      headers: { Authorization: token },
      responseType: "blob", // Ensure the response is treated as a file
    });

    // Create a Blob URL for the file
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "ExpensesReport.xlsx";
    link.click();
  } catch (error) {
    console.error("Error downloading Excel:", error);
    alert("Failed to download Excel. Please try again.");
  }
});
