const express = require("express");
const router = express.Router();
const premiumUser = require("../controllers/premiumUser");
const authenticate = require("../middleware/auth"); 
router.get("/", authenticate, premiumUser.getLeaderboard);

module.exports = router;
