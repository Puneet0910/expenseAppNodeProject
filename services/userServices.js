const Expense = require("../models/expenseModel");

exports.getExpenses = (req) => {
  return Expense.findAll({ where: { userId: req.user.userId } });
};
