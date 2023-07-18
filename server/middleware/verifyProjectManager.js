const Project = require("../models/project");

const projectManagerAuthorization = async (req, res, next) => {
  try {
    console.log(`Attempting to authorize user: ${req.user.id}`);

    const project = await Project.findById(req.params.id);
    if (!project) {
      console.log(`Project with ID: ${req.params.id} not found`);
      return res.status(404).json({ message: "Project not found" });
    }

    console.log(`Found project: ${project.name}`);

    if (project.projectManager.toString() !== req.user.id) {
      console.log(
        `User: ${req.user.id} is not the project manager for this project`
      );
      return res
        .status(403)
        .json({ message: "User is not the project manager for this project" });
    }

    console.log(
      `User: ${req.user.id} is authorized as the project manager for project: ${project.name}`
    );
    next();
  } catch (error) {
    console.log(`Error occurred while authorizing: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

module.exports = projectManagerAuthorization;
