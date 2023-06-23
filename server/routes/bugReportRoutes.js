// routes/bugReportRoutes.js

const express = require("express");
const bugReportController = require("../controllers/bugReportController");
const router = express.Router();

router.post("/create", bugReportController.createBugReport);

module.exports = router;
