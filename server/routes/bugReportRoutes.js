// routes/bugReportRoutes.js

const express = require("express");
const bugReportController = require("../controllers/bugReportController");
const router = express.Router();

router.post("/create", bugReportController.createBugReport);
router.get("/all", bugReportController.getAllBugReports);
router.get("/:id", bugReportController.getBugReportById);

module.exports = router;
