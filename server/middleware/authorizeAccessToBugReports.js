const User = require("../models/user");
const Project = require("../models/project");
const BugReport = require("../models/bugreport"); // Replace with your actual BugReport model path

const authorizeAccessToBugReports = async (req, res, next) => {
  console.log("authorizeAccessToBugReports called");

  try {
    console.log("Trying to authorize access");

    // First, handle general authorization based on project association and roles
    const userId = req.user._id;
    const projectId = req.params.projectId;

    console.log("User ID:", userId);
    console.log("Project ID:", projectId);

    if (req.user.role === "admin") {
      console.log("User is admin. Access granted.");
      return next();
    }

    const project = await Project.findById(projectId);
    console.log("Fetched Project:", project);

    if (!project) {
      console.log("Project not found");
      return res.status(404).json({ message: "Project not found." });
    }

    if (String(project.projectManager) === String(userId)) {
      console.log("User is the project manager. Access granted.");
      return next();
    }

    if (
      (req.user.role === "developer" || req.user.role === "project manager") &&
      project.teamMembers.includes(userId)
    ) {
      console.log("User is a team member. Access granted.");
      return next();
    }

    // Secondly, if it's a bug report-specific route, add additional authorization
    if (req.params.id) {
      console.log("Bug Report ID exists in request");
      const bugReport = await BugReport.findById(req.params.id);

      console.log("Fetched Bug Report:", bugReport);

      if (!bugReport) {
        console.log("Bug report not found");
        return res.status(404).json({ error: "Bug report not found" });
      }

      if (String(bugReport.createdBy) === String(userId)) {
        console.log("User is the creator of the bug report. Access granted.");
        return next();
      }
    }

    console.log("User doesn't have permission to access this resource");
    res.status(403).json({
      message: "Forbidden: You don't have permission to access this resource.",
    });
  } catch (error) {
    console.log("An error occurred:", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = authorizeAccessToBugReports;
