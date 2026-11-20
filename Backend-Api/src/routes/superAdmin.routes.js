
const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authenticate");
const requireSuperAdmin = require("../middleware/requireSuperAdmin");

const {
    getRegistrations,
    reviewRegistration,
    getAdmins,
    deleteAdmin,
} = require("../controllers/superAdmin.controller");

router.use(authenticate, requireSuperAdmin);

router.get("/registrations", getRegistrations);
router.patch("/registrations/:id", reviewRegistration);

router.get("/admins", getAdmins);
router.delete("/admins/:id", deleteAdmin);

module.exports = router;
