async function addExpense(event) {
  event.preventDefault();
  const amount = document.getElementById("amount").value;
  const description = document.getElementById("description").value;
  const category = document.getElementById("category").value;
  const expenseDetails = { amount, description, category };

  try {
    const response = await axios.post(
      "http://localhost:3000/expense/addExpense",
      expenseDetails
    );
    alert(response.data.message);
  } catch (error) {
    console.log(error);
    alert(error.response.data.message);
  }
}

async function displayExpenses() {
  try {
    const response = await axios.get(
      "http://localhost:3000/expense/getExpenses"
    );
    const expenseList = document.getElementById("expense-list");
    expenseList.innerHTML = "";
    response.data.expenses.forEach((expense) => {
      const listItem = document.createElement("li");
      listItem.textContent = `Amount: ${expense.amount}, Description: ${expense.description}, Category: ${expense.category}`;
      expenseList.appendChild(listItem);
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
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
    });
  } catch (error) {
    console.log(error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  displayExpenses();
});
