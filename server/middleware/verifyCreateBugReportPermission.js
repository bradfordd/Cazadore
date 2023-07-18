const Project = require("../models/project");
const User = require("../models/user");

const verifyCreateBugReportPermission = async (req, res, next) => {
  try {
    const { createdBy, projectId } = req.body;

    console.log("Request body:", req.body);
    console.log("User ID from token:", req.user.id);

    // Check if the token's userId matches the createdBy
    if (String(req.user.id) !== String(createdBy)) {
      console.log("Token user ID does not match createdBy");
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Check if project and creator exist
    const project = await Project.findById(projectId);
    const creator = await User.findById(createdBy);

    console.log("Project:", project);
    console.log("Creator:", creator);

    if (!project || !creator) {
      console.log("Project or creator not found");
      return res
        .status(400)
        .json({ error: "Invalid project ID or creator ID" });
    }

    // Check if user is a member or project manager of the project
    const isTeamMember = project.teamMembers.includes(creator._id);
    const isProjectManager =
      String(project.projectManager) === String(creator._id);

    console.log("Is team member:", isTeamMember);
    console.log("Is project manager:", isProjectManager);

    if (!(isTeamMember || isProjectManager)) {
      console.log("User is neither a team member nor a project manager");
      return res.status(403).json({
        error:
          "User is neither a team member nor a project manager of the project",
      });
    }

    // If everything checks out, call the next middleware function
    next();
  } catch (error) {
    console.log("Error:", error);
    // If there was a problem, respond with the error message
    res.status(500).json({ error: error.message });
  }
};

module.exports = verifyCreateBugReportPermission;
