// routes/userRoutes.js

const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();
const authenticateJWT = require("../middleware/authenticateJWT");

router.post("/register", userController.registerNewUser);
router.post("/login", userController.loginUser);
router.get("/", userController.getAllUsers);
router.get("/currentUser", authenticateJWT, userController.getCurrentUser);
router.get("/isUserDeveloper", authenticateJWT, userController.isUserDeveloper);
router.get(
  "/isUserManager",
  authenticateJWT,
  userController.isUserProjectManager
);
router.get("/isUserManager", authenticateJWT);

module.exports = router;
