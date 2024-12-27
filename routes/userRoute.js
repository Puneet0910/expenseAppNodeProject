const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const express = require('express');
const expenseController = require('../controllers/expenseController')
const router = express.Router();

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/getUserDetails', authMiddleware, userController.getUserDetails);
router.get('/download', authMiddleware, expenseController.downloadFile);
module.exports = router;