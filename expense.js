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
        expenseDetails, {
          headers: {
            Authorization:token,
          }
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
        "http://localhost:3000/expense/getExpenses",{
          headers: {
            Authorization:token,
          }
        }
      );
      const expenseList = document.getElementById("expense-list");
      expenseList.innerHTML = ""; 
  
      response.data.expenses.forEach((expense) => {

        const listItem = document.createElement("li");
        listItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
  
        
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
  
  document.addEventListener("DOMContentLoaded", () => {
    displayExpenses();
    if(!token){
      alert("Please Login");
      location.href = "login.html";
    } 
  });
  
  function logout() {
    localStorage.removeItem("token");
    location.href = "login.html";
  };