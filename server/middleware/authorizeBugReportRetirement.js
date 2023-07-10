const jwt = require("jsonwebtoken");
const User = require("../models/user");
const BugReport = require("../models/bugreport");

async function authorizeBugReportRetirement(req, res, next) {
  console.log("authorizeBugReportRetirement called");

  const bugReport = await BugReport.findById(req.params.id);
  console.log("Fetched bug report: ", bugReport);

  if (!bugReport) {
    console.log("Bug report not found");
    return res.status(404).json({ error: "Bug report not found" });
  }

  // Check if the authenticated user is the creator of the bug report
  console.log("Comparing bug report creator ID and authenticated user ID");
  console.log("Bug report creator ID: ", bugReport.createdBy);
  console.log("Authenticated user ID: ", req.user._id);
  if (String(bugReport.createdBy) !== String(req.user._id)) {
    console.log("User not authorized to retire this bug report");
    return res
      .status(403)
      .json({ error: "User not authorized to retire this bug report" });
  }

  // Pass bugReport to next middleware/route handler
  req.bugReport = bugReport;
  console.log("Passing bug report to next handler");

  next();
}

module.exports = authorizeBugReportRetirement;
