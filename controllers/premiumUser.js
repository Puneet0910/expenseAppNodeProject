const User = require("../models/userModel"); // Adjust the path if needed
const Expense = require("../models/expenseModel"); // Assuming expenses are tracked in this model
const Sequelize = require('sequelize');
exports.getLeaderboard = async (req, res) => {
  try {
    // Use Sequelize aggregate functions to join users and their expenses and calculate total expense in one query
    const leaderboard = await User.findAll({
      attributes: [
        "id",
        "name",
        [Sequelize.fn("SUM", Sequelize.col("expenses.amount")), "totalExpense"]
      ],
      include: [
        {
          model: Expense,
          attributes: [] // Don't need to return expense amount here as we are aggregating
        }
      ],
      group: ["User.id"], // Group by user ID so we calculate totalExpense for each user
      order: [[Sequelize.literal("totalExpense"), "DESC"]], // Sort by totalExpense in descending order
    });

    res.status(200).json({
      leaderboard: leaderboard.map(user => ({
        id: user.id,
        name: user.name,
        totalExpense: user.get("totalExpense"),
      }))
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ message: "Failed to fetch leaderboard", error });
  }
};
