const express = require('express');
const expenseController = require('../controllers/expenseController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.post('/addExpense',authMiddleware, expenseController.addExpense);
router.get('/getExpenses', authMiddleware, expenseController.getExpenses);
router.delete('/deleteExpense/:id', expenseController.deleteExpense);

module.exports = router;