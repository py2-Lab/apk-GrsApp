
const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authenticate");

const {
    getProfile,
    updateProfile,
    getTransactions,
} = require("../controllers/admin.controller");

router.use(authenticate);

router.get("/profile", getProfile);
router.patch("/profile", updateProfile);

router.get("/transactions", getTransactions);

module.exports = router;
