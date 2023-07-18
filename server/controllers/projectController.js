const Project = require("../models/project");
const User = require("../models/user");

const projectController = {
  // Get all projects
  getAllProjects: async (req, res) => {
    try {
      const projects = await Project.find();
      res.json(projects);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Create a new project
  createProject: async (req, res) => {
    // Validate the users
    const userIds = [req.user.id, req.body.projectManager].concat(
      req.body.teamMembers || []
    );

    try {
      for (let userId of userIds) {
        const user = await User.findById(userId);
        if (!user) {
          return res
            .status(400)
            .json({ message: `User with ID: ${userId} does not exist` });
        }

        // Additional check if the user is a project manager
        if (
          userId === req.body.projectManager &&
          user.role !== "project manager"
        ) {
          return res.status(400).json({
            message: `User with ID: ${userId} is not a project manager`,
          });
        }
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }

    const project = new Project({
      name: req.body.name,
      description: req.body.description,
      createdBy: req.user.id,
      projectManager: req.body.projectManager,
      teamMembers: req.body.teamMembers || [], // If teamMembers is not provided in the request, initialize it as an empty array
    });

    try {
      // Save the new project
      const newProject = await project.save();

      res.status(201).json(newProject);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // Get a specific project
  getProject: async (req, res) => {
    try {
      const project = await Project.findById(req.params.id).populate(
        "teamMembers",
        "username"
      );
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

      console.log(
        `User ${req.user.id} has permission to update this project. Checking for updates...`
      );

      // List of fields this function can update
      const updatableFields = ["name", "description", "teamMembers"];

      // Iterate over fields in the request body
      for (let field in req.body) {
        if (!updatableFields.includes(field)) {
          // Check if the field exists in the project schema
          if (!Project.schema.paths[field]) {
            return res
              .status(400)
              .json({ message: `Field: ${field} does not exist` });
          } else {
            return res.status(400).json({
              message: `Field: ${field} cannot be updated with this API`,
            });
          }
        }
      }

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
    console.log("Attempting to delete a project...");
    try {
      console.log(`Searching for project with id: ${req.params.id}`);
      const project = await Project.findById(req.params.id);

      if (project == null) {
        console.log(`No project found with the ID: ${req.params.id}`);
        return res.status(404).json({ message: "Cannot find project" });
      }

      console.log(
        `Found project: ${project.name}. Checking user permissions...`
      );

      console.log("Project Manager: ", project.projectManager);

      console.log(
        `User ${req.user.id} has permission. Proceeding with deletion...`
      );
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

  // Add a member to a project
  addMemberToProject: async (req, res) => {
    try {
      console.log(
        `Attempting to add member ${req.body.newMember} to project ${req.params.id}`
      );
      const project = await Project.findById(req.params.id);

      if (project == null) {
        console.log(`No project found with the ID: ${req.params.id}`);
        return res.status(404).json({ message: "Cannot find project" });
      }

      // Validate the new member
      const newMember = await User.findById(req.body.newMember);
      if (!newMember) {
        return res.status(400).json({
          message: `User with ID: ${req.body.newMember} does not exist`,
        });
      }

      // Check if the user to be added is already a member of the project
      if (project.teamMembers.includes(req.body.newMember)) {
        console.log(
          `User ${req.body.newMember} is already a member of the project`
        );
        return res.status(400).json({
          message: "User is already a member of this project",
        });
      }

      // Add new member to the project
      project.teamMembers.push(req.body.newMember);

      console.log(`Adding member ${req.body.newMember} to project...`);

      const updatedProject = await project.save();
      console.log("Member added successfully.");

      res.json(updatedProject);
    } catch (err) {
      console.log(
        "An error occurred during the member addition process: ",
        err.message
      );
      res.status(500).json({ message: err.message });
    }
  },
};

module.exports = projectController;
