// routes/bugReportRoutes.js

const express = require("express");
const bugReportController = require("../controllers/bugReportController");
const router = express.Router();
const authenticateJWT = require("../middleware/authenticateJWT");
const authorizeBugReportRetirement = require("../middleware/authorizeBugReportRetirement");
const verifyCreateBugReportPermission = require("../middleware/verifyCreateBugReportPermission");
const verifyUpdateBugReportPermission = require("../middleware/verifyUpdateBugReportPermission");

router.post("/create", authenticateJWT, bugReportController.createBugReport);

// Get all bug reports - now supports pagination via query parameters 'page' and 'limit'
router.get("/all", bugReportController.getAllBugReports);

router.get("/:id", bugReportController.getBugReportById);

router.put(
  "/:id",
  authenticateJWT,
  verifyUpdateBugReportPermission,
  bugReportController.updateBugReport
);

router.patch(
  "/:id/assign",
  authenticateJWT,
  verifyUpdateBugReportPermission,
  bugReportController.assignBugReport
);

// Add the route to reactivate a bug report
router.put(
  "/:id/reactivate",
  authenticateJWT,
  verifyUpdateBugReportPermission,
  bugReportController.reactivateBugReport
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
