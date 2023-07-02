// routes/bugReportRoutes.js

const express = require("express");
const bugReportController = require("../controllers/bugReportController");
const router = express.Router();
const authenticateJWT = require("../middleware/authenticateJWT");

router.post("/create", bugReportController.createBugReport);

// Get all bug reports - now supports pagination via query parameters 'page' and 'limit'
router.get("/all", bugReportController.getAllBugReports);

router.get("/:id", bugReportController.getBugReportById);

router.put("/:id", bugReportController.updateBugReport);

router.patch("/:id/assign", bugReportController.assignBugReport);

router.put("/:id/retire", bugReportController.retireBugReport);

// Add the route to reactivate a bug report
router.put("/:id/reactivate", bugReportController.reactivateBugReport);

router.patch(
  "/:id/addComment",
  authenticateJWT,
  bugReportController.addCommentToBugReport
);

module.exports = router;
