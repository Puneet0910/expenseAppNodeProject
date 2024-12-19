const User = require("../models/userModel");

exports.getLeaderboard = async (req, res) => {
  try {
    // Fetch all users with their totalExpense, sorted in descending order
    const leaderboard = await User.findAll({
      attributes: ["id", "name", "totalExpense"], // Fetch the totalExpense directly
      order: [["totalExpense", "DESC"]], // Sort by totalExpense in descending order
    });

    res.status(200).json({
      leaderboard: leaderboard.map(user => ({
        id: user.id,
        name: user.name,
        totalExpense: user.totalExpense, // Directly use the pre-calculated totalExpense
      }))
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ message: "Failed to fetch leaderboard", error });
  }
};
