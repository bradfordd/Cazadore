const Project = require("../models/project");
const User = require("../models/user");

async function authorizeProjectUpdate(req, res, next) {
  console.log("authorizeProjectUpdate called");

  const project = await Project.findById(req.params.id);
  console.log("Fetched project: ", project);

  if (!project) {
    console.log("Project not found");
    return res.status(404).json({ error: "Project not found" });
  }

  // Check if the authenticated user is the project manager of the project or an admin
  console.log("Comparing project manager ID and authenticated user ID");
  console.log("Project manager ID: ", project.projectManager);
  console.log("Authenticated user ID: ", req.user._id);
  if (
    String(project.projectManager) !== String(req.user._id) &&
    req.user.role !== "Admin"
  ) {
    console.log("User not authorized to update this project");
    return res
      .status(403)
      .json({ error: "User not authorized to update this project" });
  }

  // Pass project to next middleware/route handler
  req.project = project;
  console.log("Passing project to next handler");

  next();
}

module.exports = authorizeProjectUpdate;
