const Project = require("../models/project");
const User = require("../models/user");

const projectController = {
  // Get all projects
  getAllProjects: async (req, res) => {
    try {
      const projects = await Project.find()
        .populate("createdBy", "username")
        .populate("teamMembers", "username");
      res.json(projects);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Create a new project
  createProject: async (req, res) => {
    const project = new Project({
      name: req.body.name,
      description: req.body.description,
      createdBy: req.user.id,
      projectManager: req.body.projectManager,
      teamMembers: req.body.teamMembers || [], // If teamMembers is not provided in the request, initialize it as an empty array
    });

    try {
      const newProject = await project.save();
      res.status(201).json(newProject);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // Get a specific project
  getProject: async (req, res) => {
    try {
      const project = await Project.findById(req.params.id)
        .populate("createdBy", "username")
        .populate("teamMembers", "username");
      if (project == null) {
        return res.status(404).json({ message: "Cannot find project" });
      }
      res.json(project);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Update a project
  updateProject: async (req, res) => {
    console.log("Attempting to update a project...");
    console.log("Request Body: ", req.body);
    try {
      console.log(`Searching for project with id: ${req.params.id}`);
      const project = await Project.findById(req.params.id);

      if (project == null) {
        console.log(`No project found with id: ${req.params.id}`);
        return res.status(404).json({ message: "Cannot find project" });
      }

      console.log(
        `Found project: ${project.name}. Verifying user permissions...`
      );
      if (
        project.createdBy.toString() !== req.user.id &&
        req.user.role !== "Admin"
      ) {
        console.log(
          `User ${req.user.id} does not have permission to update this project.`
        );
        return res.status(403).json({
          message: "You do not have permission to update this project",
        });
      }

      console.log(
        `User ${req.user.id} has permission to update this project. Checking for updates...`
      );
      if (req.body.name != null) {
        console.log(`Updating project name to: ${req.body.name}`);
        project.name = req.body.name;
      }

      if (req.body.description != null) {
        console.log(`Updating project description to: ${req.body.description}`);
        project.description = req.body.description;
      }

      if (req.body.teamMembers != null) {
        console.log(`Updating team members to: ${req.body.teamMembers}`);
        project.teamMembers = req.body.teamMembers;
      }

      console.log("Saving updated project...");
      const updatedProject = await project.save();
      console.log("Project updated successfully.");

      res.json(updatedProject);
    } catch (err) {
      console.log(
        "An error occurred during the project update process: ",
        err.message
      );
      res.status(500).json({ message: err.message });
    }
  },

  // Delete a project
  deleteProject: async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);

      if (project == null) {
        console.log(`No project found with the ID: ${req.params.id}`);
        return res.status(404).json({ message: "Cannot find project" });
      }

      if (
        project.createdBy.toString() !== req.user.id &&
        req.user.role !== "Admin"
      ) {
        console.log(
          `User ${req.user.id} doesn't have permission to delete this project`
        );
        return res.status(403).json({
          message: "You do not have permission to delete this project",
        });
      }

      await Project.deleteOne({ _id: req.params.id });

      console.log(`Project with ID: ${req.params.id} has been deleted.`);
      res.json({ message: "Project Deleted" });
    } catch (err) {
      console.log(
        "An error occurred during the project deletion process: ",
        err.message
      );
      res.status(500).json({ message: err.message });
    }
  },
};

module.exports = projectController;
