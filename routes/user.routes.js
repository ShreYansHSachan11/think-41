const express = require("express");
const router = express.Router();
const userController = require('../controllers/user.controller');

router.get("/", userController.getAllUsers);      // <-- FIXED
router.get("/:id", userController.getUserById);   // <-- FIXED

module.exports = router;