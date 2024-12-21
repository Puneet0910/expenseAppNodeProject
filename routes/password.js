const express = require("express");

const router = express.Router();
const resetController = require("../controllers/password");

router.post("/forgot-Password", resetController.resetPassword);

module.exports = router;