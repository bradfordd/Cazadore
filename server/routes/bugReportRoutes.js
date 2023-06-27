// routes/bugReportRoutes.js

const express = require("express");
const bugReportController = require("../controllers/bugReportController");
const router = express.Router();

router.post("/create", bugReportController.createBugReport);

// Get all bug reports - now supports pagination via query parameters 'page' and 'limit'
router.get("/all", bugReportController.getAllBugReports);

router.get("/:id", bugReportController.getBugReportById);

router.put("/:id", bugReportController.updateBugReport);

router.patch("/:id/assign", bugReportController.assignBugReport);

router.put("/:id/retire", bugReportController.retireBugReport);

module.exports = router;
