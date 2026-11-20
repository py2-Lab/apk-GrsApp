
const express = require("express");
const router = express.Router();

const authLimiter = require("../middleware/authLimiter");

const {
    register,
    login,
} = require("../controllers/auth.controller");

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);

module.exports = router;
