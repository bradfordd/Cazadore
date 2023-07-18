const BugReport = require("../models/bugreport");

const verifyUpdateBugReportPermission = async (req, res, next) => {
  try {
    // Get the bug report
    const bugReport = await BugReport.findById(req.params.id).populate(
      "project"
    );

    // Check if bug report exists
    if (!bugReport) {
      return res.status(404).json({ error: "Bug report not found" });
    }

    // Get the project related to the bug report
    const project = bugReport.project;

    // Check if user is the creator of the bug report or the project manager
    const isCreator = String(bugReport.createdBy) === String(req.user.id);
    const isProjectManager =
      String(project.projectManager) === String(req.user.id);

    // If the user is neither the creator nor the project manager, return an error
    if (!isCreator && !isProjectManager) {
      return res.status(403).json({
        error:
          "Unauthorized: you do not have permission to update this bug report",
      });
    }

    // If everything checks out, call the next middleware function
    next();
  } catch (error) {
    // If there was a problem, respond with the error message
    res.status(500).json({ error: error.message });
  }
};

module.exports = verifyUpdateBugReportPermission;
