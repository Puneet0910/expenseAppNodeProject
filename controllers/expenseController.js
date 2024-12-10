const Expense = require('../models/expenseModel');

exports.addExpense = async (req, res, next) => {
    try {
        const { amount, description, category } = req.body;
        const expense = await Expense.create({ amount, description, category });
        res.status(201).json({ message: 'Expense added successfully', expense });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server error' });
    }
};

exports.getExpenses = async (req, res, next) => {
    try {
        const expenses = await Expense.findAll();
        res.status(200).json({ expenses });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server error' });
    }
};

exports.deleteExpense = async (req, res, next) => {
    try {
        const { id } = req.params;
        await Expense.destroy({ where: { id } });
        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server error' });
    }
};