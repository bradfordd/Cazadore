const Project = require("../models/project");

const projectManagerAuthorization = async (req, res, next) => {
  try {
    console.log(`[Authorization] Attempting to authorize user: ${req.user.id}`);

    const project = await Project.findById(req.params.id);
    if (!project) {
      console.log(
        `[Authorization] Project with ID: ${req.params.id} not found`
      );
      return res.status(404).json({ message: "Project not found" });
    }

    console.log(`[Authorization] Found project: ${project.name}`);
    console.log(
      `[Authorization] Project manager for ${
        project.name
      }: ${project.projectManager.toString()}`
    ); // Logging project manager's ID

    if (project.projectManager.toString() !== req.user.id) {
      console.log(
        `[Authorization] User: ${req.user.id} is not the project manager for ${project.name}`
      );
      return res
        .status(403)
        .json({ message: "User is not the project manager for this project" });
    }

    console.log(
      `[Authorization] User: ${req.user.id} is authorized as the project manager for project: ${project.name}`
    );
    next();
  } catch (error) {
    console.log(
      `[Authorization] Error occurred while authorizing: ${error.message}`
    );
    res.status(500).json({ message: error.message });
  }
};

module.exports = projectManagerAuthorization;
