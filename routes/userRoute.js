const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const express = require('express');

const router = express.Router();

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/getUserDetails', authMiddleware, userController.getUserDetails)
module.exports = router;