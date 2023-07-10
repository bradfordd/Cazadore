// routes/bugReportRoutes.js

const express = require("express");
const bugReportController = require("../controllers/bugReportController");
const router = express.Router();
const authenticateJWT = require("../middleware/authenticateJWT");
const authorizeBugReportRetirement = require("../middleware/authorizeBugReportRetirement");

router.post("/create", bugReportController.createBugReport);

// Get all bug reports - now supports pagination via query parameters 'page' and 'limit'
router.get("/all", bugReportController.getAllBugReports);

router.get("/:id", bugReportController.getBugReportById);

router.put("/:id", bugReportController.updateBugReport);

router.patch("/:id/assign", bugReportController.assignBugReport);

// Add the route to reactivate a bug report
router.put("/:id/reactivate", bugReportController.reactivateBugReport);

router.patch(
  "/:id/addComment",
  authenticateJWT,
  bugReportController.addCommentToBugReport
);

router.delete(
  "/:bugReportId/comments/:commentId",
  authenticateJWT,
  bugReportController.deleteCommentFromBugReport
);

router.put(
  "/:id/retire",
  authenticateJWT,
  authorizeBugReportRetirement,
  bugReportController.retireBugReport
);

router.put(
  "/:id/close",
  authenticateJWT,
  authorizeBugReportRetirement,
  bugReportController.closeBugReport
);

module.exports = router;
