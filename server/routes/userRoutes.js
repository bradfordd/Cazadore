// routes/userRoutes.js

const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

router.post("/register", userController.registerNewUser);
router.post("/login", userController.loginUser);
router.get("/", userController.getAllUsers);

module.exports = router;
