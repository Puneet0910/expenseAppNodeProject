const token = localStorage.getItem("token");
async function addExpense(event) {
  event.preventDefault();
  const amount = document.getElementById("amount").value;
  const description = document.getElementById("description").value;
  const category = document.getElementById("category").value;
  const expenseDetails = { amount, description, category };

  try {
    const response = await axios.post(
      "http://65.1.221.190/expense/addExpense",
      expenseDetails,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    alert(response.data.message);
    displayExpenses();
    document.getElementById("expense-form").reset();
  } catch (error) {
    console.log(error);
    alert(error.response.data.message);
  }
}

let currentPage = 1;
const itemsPerPage = 5; // You can change this to 10 or any number of items per page

async function displayExpenses(page = 1) {
  try {
    const response = await axios.get(
      "http://65.1.221.190/expense/getExpenses",
      {
        headers: { Authorization: token },
        params: { page, limit: itemsPerPage }, // Send page and limit as query params
      }
    );

    const { expenses, totalPages, currentPage, totalExpenses } = response.data;

    const expenseList = document.getElementById("expense-list");
    expenseList.innerHTML = "";

    expenses.forEach((expense) => {
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
            `http://65.1.221.190/expense/deleteExpense/${expense.id}`
          );
          displayExpenses(currentPage); // Reload the expenses after deleting
        } catch (error) {
          console.log(error);
        }
      });

      listItem.appendChild(deleteButton);

      expenseList.appendChild(listItem);
    });

    // Pagination Controls
    const paginationContainer = document.getElementById("pagination-container");
    paginationContainer.innerHTML = ""; // Clear previous pagination

    if (currentPage > 1) {
      const prevButton = document.createElement("button");
      prevButton.classList.add("btn", "btn-primary", "btn-sm");
      prevButton.textContent = "Previous";
      prevButton.addEventListener("click", () =>
        displayExpenses(currentPage - 1)
      );
      paginationContainer.appendChild(prevButton);
    }

    if (currentPage < totalPages) {
      const nextButton = document.createElement("button");
      nextButton.classList.add("btn", "btn-primary", "btn-sm");
      nextButton.textContent = "Next";
      nextButton.addEventListener("click", () =>
        displayExpenses(currentPage + 1)
      );
      paginationContainer.appendChild(nextButton);
    }
  } catch (error) {
    console.log(error);
  }
}

function logout() {
  localStorage.removeItem("token");
  location.href = "index.html";
}

document.getElementById("pay-btn").addEventListener("click", async () => {
  try {
    const response = await axios.post(
      "http://65.1.221.190/payment/create-order",
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
            "http://65.1.221.190/payment/verify-payment",
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

document
  .getElementById("leaderboard-btn")
  .addEventListener("click", async () => {
    try {
      const response = await axios.get("http://65.1.221.190/leaderboard", {
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
      location.href = "index.html";
      return;
    }

    // Fetch user details
    const response = await axios.get(
      "http://65.1.221.190/user/getUserDetails",
      {
        headers: { Authorization: token },
      }
    );

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
      document.getElementById("download-file").style.display = "inline-block";
    }

    // Load expenses
    displayExpenses();
  } catch (error) {
    console.error("Error loading user details:", error);
    alert("Failed to load user details. Please try again.");
  }
});

function download() {
  const token = localStorage.getItem("token");
  axios
    .get("http://65.1.221.190/user/download", {
      headers: { Authorization: token },
    })
    .then((response) => {
      if (response.status === 200) {
        //the bcakend is essentially sending a download link
        //  which if we open in browser, the file would download
        var a = document.createElement("a");
        a.href = response.data.fileUrl;
        a.download = "myexpense.csv";
        a.click();
      } else {
        throw new Error(response.data.message);
      }
    })
    .catch((err) => {
      showError(err);
    });
}
function showError(err) {
  document.body.innerHTML += `<div style="color:red;"> ${err}</div>`;
}
