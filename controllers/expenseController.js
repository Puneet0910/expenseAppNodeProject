const Expense = require('../models/expenseModel');
const User = require('../models/userModel'); // Import the User model


exports.addExpense = async (req, res, next) => {
    try {
        const { amount, description, category } = req.body;
        const userId = req.user.userId;

        // Ensure that the 'amount' is treated as a number
        const expenseAmount = parseInt(amount, 10);

        // Create a new expense
        const expense = await Expense.create({
            amount: expenseAmount,
            description,
            category,
            userId
        });

        // Fetch the user and update totalExpense
        const user = await User.findByPk(userId);
        user.totalExpense += expenseAmount;  // Add the new expense amount
        await user.save();  // Save the updated user

        res.status(201).json({ message: 'Expense added successfully', expense });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server error' });
    }
};


// Get Expenses
exports.getExpenses = async (req, res, next) => {
    try {
        const expenses = await Expense.findAll({ where: { userId: req.user.userId } });
        res.status(200).json({ expenses });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server error' });
    }
};

// Delete Expense
exports.deleteExpense = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Fetch the expense details
        const expense = await Expense.findByPk(id);

        // If the expense exists, delete it and update the user's totalExpense
        if (expense) {
            const user = await User.findByPk(expense.userId);

            // Deduct the deleted expense amount from the user's totalExpense
            user.totalExpense -= expense.amount;
            await user.save();  // Save the updated user

            // Delete the expense
            await Expense.destroy({ where: { id } });

            res.status(200).json({ message: 'Expense deleted successfully' });
        } else {
            res.status(404).json({ message: 'Expense not found' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server error' });
    }
};
