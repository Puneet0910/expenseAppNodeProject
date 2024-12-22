const express = require("express");

const router = express.Router();
const passwordController = require("../controllers/password");

router.post("/forgot-Password", passwordController.forgotPassword);
router.get("/reset-Password/:id", passwordController.resetPassword);
router.post("/update-Password/:id", passwordController.updatePassword);

module.exports = router;