const Expense = require('../models/expenseModel');
const User = require('../models/userModel'); // Import the User model
const Sequelize = require('../utility/database');

const UserServices = require("../services/userServices");
const S3Services = require("../services/S3Services");

exports.addExpense = async (req, res, next) => {
    const transaction = await Sequelize.transaction(); // Start a new transaction
    try {
        const { amount, description, category } = req.body;
        const userId = req.user.userId;

        // Ensure that the 'amount' is treated as a number 
        const expenseAmount = parseInt(amount, 10);

        // Create a new expense within the transaction
        const expense = await Expense.create(
            {
                amount: expenseAmount,
                description,
                category,
                userId
            },
            { transaction } // Pass the transaction
        );

        // Fetch the user and update totalExpense within the transaction
        const user = await User.findByPk(userId, { transaction });
        user.totalExpense += expenseAmount; // Add the new expense amount
        await user.save({ transaction }); // Save the updated user with the transaction

        // Commit the transaction
        await transaction.commit();

        res.status(201).json({ message: 'Expense added successfully', expense });
    } catch (error) {
        // Rollback the transaction in case of any error
        if (transaction) await transaction.rollback();
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
    const transaction = await Sequelize.transaction(); // Start a new transaction
    try {
        const { id } = req.params;

        // Fetch the expense details within the transaction
        const expense = await Expense.findByPk(id, { transaction });

        if (expense) {
            const user = await User.findByPk(expense.userId, { transaction });

            // Deduct the deleted expense amount from the user's totalExpense
            user.totalExpense -= expense.amount;
            await user.save({ transaction }); // Save the updated user with the transaction

            // Delete the expense within the transaction
            await Expense.destroy({ where: { id }, transaction });

            // Commit the transaction
            await transaction.commit();

            res.status(200).json({ message: 'Expense deleted successfully' });
        } else {
            res.status(404).json({ message: 'Expense not found' });
        }
    } catch (error) {
        // Rollback the transaction in case of any error
        if (transaction) await transaction.rollback();
        console.log(error);
        res.status(500).json({ message: 'Internal Server error' });
    }
};

const json2csv = require('json2csv').parse; // npm install json2csv

exports.downloadFile = async (req, res, next) => {
    try {
        const expenses = await UserServices.getExpenses(req);

        // Convert JSON data to CSV format
        const csv = json2csv(expenses);

        // Generate a filename
        const userId = req.user.userId;
        const filename = `Expense${userId}/${new Date().toISOString()}.csv`;

        // Upload the CSV file to S3
        const fileUrl = await S3Services.uploadToS3(csv, filename);
        
        // Return the URL of the uploaded file
        res.status(200).json({ fileUrl, success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ fileUrl: "", success: false });
    }
};
