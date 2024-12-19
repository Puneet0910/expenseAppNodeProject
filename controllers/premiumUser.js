const User = require("../models/userModel"); // Adjust the path if needed
const Expense = require("../models/expenseModel"); // Assuming expenses are tracked in this model

exports.getLeaderboard = async (req, res) => {
  try {
    // Aggregate expenses per user to calculate totalExpense
    const leaderboard = await User.findAll({
      attributes: ["id", "name"],
      include: [
        {
          model: Expense,
          attributes: ["amount"],
        },
      ],
    });

    // Calculate total expenses for each user
    const leaderboardData = leaderboard.map((user) => {
      const totalExpense = user.expenses.reduce((sum, expense) => sum + expense.amount, 0);
      return {
        id: user.id,
        name: user.name,
        totalExpense,
      };
    });

    // Sort by totalExpense in descending order
    leaderboardData.sort((a, b) => b.totalExpense - a.totalExpense);

    res.status(200).json({ leaderboard: leaderboardData });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ message: "Failed to fetch leaderboard", error });
  }
};

