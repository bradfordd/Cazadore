const Project = require("../models/project");
const User = require("../models/user");
const isUserDeveloper = require("../middleware/isUserADeveloper"); // Import your function

const projectController = {
  // Get all projects
  getAllProjects: async (req, res) => {
    try {
      const projects = await Project.find()
        .populate("projectManager", "username") // populating projectManager with just the username
        .populate("teamMembers", "username"); // populating teamMembers with just the username

      res.json(projects);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Create a  w project
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
      const project = await Project.findById(req.params.id)
        .populate("projectManager", "username") // populating projectManager with just the username
        .populate("teamMembers", "username"); // populating teamMembers with just the username

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

  getManagedProjects: async (req, res) => {
    try {
      // Get the ID of the logged-in user from the authentication middleware (assuming it's stored in req.user.id)
      const userId = req.user.id;

      console.log("Fetching managed projects for user ID:", userId);

      // Find projects where the projectManager field matches the user ID and populate the teamMembers field
      const projects = await Project.find({ projectManager: userId })
        .populate("projectManager", "username") // Optional: populate the projectManager with just the username
        .populate("teamMembers", "username"); // populating teamMembers with just the username

      console.log("Managed projects:", projects);

      res.json(projects);
    } catch (err) {
      console.error("Error fetching managed projects:", err);
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
  getProjectParticipants: async (req, res) => {
    try {
      const projectId = req.params.id;

      // Fetch the project
      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found." });
      }

      // Fetch the project manager
      const projectManager = await User.findById(project.projectManager).select(
        "-password"
      ); // Omit the password field

      // Fetch the team members
      const teamMembers = await User.find({
        _id: { $in: project.teamMembers },
      }).select("-password"); // Omit the password field

      // Combine the project manager and team members into a single list
      const participants = [projectManager, ...teamMembers];

      res.json(participants);
    } catch (err) {
      console.error("Error occurred in getProjectParticipants:", err);
      return res.status(500).json({ message: err.message });
    }
  },

  getProjectsOfDeveloper: async (req, res, next) => {
    console.log("Entering getProjectsOfDeveloper function..."); // Log when we enter the function

    try {
      // Get the ID of the logged-in developer from the authentication middleware
      // (assuming it's stored in req.user.id)
      const developerId = req.user.id;

      console.log("Developer ID from req.user.id:", developerId); // Log the extracted developerId

      console.log("Fetching projects for developer ID:", developerId);

      // Find projects where the teamMembers field contains the developer's ID and populate them
      const projects = await Project.find({ teamMembers: developerId })
        .populate("projectManager", "username") // Optional: populate the projectManager with just the username
        .populate("teamMembers", "username"); // populating teamMembers with just the username

      console.log("Number of projects fetched:", projects.length); // Log the number of projects returned
      console.log("Projects of developer:", projects);

      res.json(projects);
    } catch (err) {
      console.error("Caught an error in getProjectsOfDeveloper:", err); // Log the error
      console.error("Error message:", err.message); // Specifically log the error message

      // If there are any additional properties on the error object that could be useful,
      // you can log them as well. For example:
      // console.error("Error name:", err.name);
      // console.error("Error stack:", err.stack);

      res.status(500).json({ message: err.message });
    }
  },
  isDeveloperTeamMember: async (req, res) => {
    try {
      console.log("Inside isDeveloperTeamMember function");

      const projectId = req.params.id;
      const userId = req.user.id;

      console.log(`Project ID: ${projectId}, User ID: ${userId}`);

      // Check if the user is a developer
      const user = await User.findById(userId);

      if (!user || user.role !== "developer") {
        console.log("User is not a developer or doesn't exist");
        return res.status(403).json({ message: "User is not a developer." });
      }

      console.log(`User role: ${user.role}`);

      const project = await Project.findById(projectId);

      if (!project) {
        console.log("Project not found with the provided ID");
        return res.status(404).json({ message: "Project not found." });
      }

      console.log(`Project team members: ${project.teamMembers}`);

      if (project.teamMembers.includes(userId)) {
        console.log("User is a member of the project");
        return res.status(200).json({ message: "User is a team member." });
      } else {
        console.log("User is not a member of the project");
        return res.status(403).json({ message: "User is not a team member." });
      }
    } catch (err) {
      console.error("Error occurred in isDeveloperTeamMember:", err);
      return res.status(500).json({ message: err.message });
    }
  },

  isAssignedManager: async (req, res) => {
    try {
      console.log("Inside isAssignedManager function");

      const projectId = req.params.id;
      const userId = req.user.id;

      console.log(`Project ID: ${projectId}, User ID: ${userId}`);

      // Check if the user is a project manager
      const user = await User.findById(userId);

      if (!user || user.role !== "project manager") {
        console.log("User is not a project manager or doesn't exist");
        return res
          .status(403)
          .json({ message: "User is not a project manager." });
      }

      console.log(`User role: ${user.role}`);

      const project = await Project.findById(projectId);

      if (!project) {
        console.log("Project not found with the provided ID");
        return res.status(404).json({ message: "Project not found." });
      }

      console.log(`Project manager ID: ${project.projectManager}`);

      if (project.projectManager.toString() === userId) {
        console.log("User is the project manager");
        return res
          .status(200)
          .json({ message: "User is the project manager." });
      } else {
        console.log("User is not the project manager");
        return res
          .status(403)
          .json({ message: "User is not the project manager." });
      }
    } catch (err) {
      console.error("Error occurred in isAssignedManager:", err);
      return res.status(500).json({ message: err.message });
    }
  },

  getUnassignedDevelopers: async (req, res) => {
    try {
      console.log("Inside getUnassignedDevelopers function");

      const projectId = req.params.id;

      // Retrieve the project by its ID
      const project = await Project.findById(projectId);

      if (!project) {
        console.log("Project not found with the provided ID");
        return res.status(404).json({ message: "Project not found." });
      }

      // Retrieve all developers from the database
      const allDevelopers = await User.find({
        role: "developer",
        _id: { $nin: project.teamMembers },
      }).select("-password");

      // Filter out developers already assigned to the project
      const unassignedDevelopers = allDevelopers.filter(
        (developer) => !project.teamMembers.includes(developer._id.toString())
      );

      // Return the list of unassigned developers
      res.json(unassignedDevelopers);
    } catch (err) {
      console.error("Error occurred in getUnassignedDevelopers:", err);
      return res.status(500).json({ message: err.message });
    }
  },
  getAssignedDevelopers: async (req, res) => {
    try {
      console.log("Inside getAssignedDevelopers function");

      const projectId = req.params.id;

      // Retrieve the project by its ID
      const project = await Project.findById(projectId);

      if (!project) {
        console.log("Project not found with the provided ID");
        return res.status(404).json({ message: "Project not found." });
      }

      // Retrieve all developers from the database who are assigned to this project
      const assignedDevelopers = await User.find({
        role: "developer",
        _id: { $in: project.teamMembers },
      }).select("-password");

      // Return the list of assigned developers
      res.json(assignedDevelopers);
    } catch (err) {
      console.error("Error occurred in getAssignedDevelopers:", err);
      return res.status(500).json({ message: err.message });
    }
  },
  assignUserToProject: async (req, res) => {
    try {
      console.log("Inside assignUserToProject function");
      const projectId = req.params.id;
      const userId = req.body.userId;
      const requesterId = req.user._id; // Assuming this is set by your authentication middleware

      // Fetch the project and user
      const project = await Project.findById(projectId);
      const user = await User.findById(userId);
      const requester = await User.findById(requesterId);

      if (!project || !user || !requester) {
        return res.status(404).json({ message: "Project or User not found." });
      }

      // Check if the requester is the project manager
      if (requester._id.toString() !== project.projectManager.toString()) {
        return res
          .status(403)
          .json({ message: "Only the project manager can assign users." });
      }

      // Check if the user to be assigned is a developer
      if (!isUserDeveloper(user)) {
        return res
          .status(400)
          .json({ message: "Only developers can be assigned." });
      }

      // Check if the user is already a team member
      if (project.teamMembers.includes(userId)) {
        return res
          .status(400)
          .json({ message: "User is already a team member." });
      }

      // Assign the user to the project
      project.teamMembers.push(userId);
      await project.save();

      res
        .status(200)
        .json({ message: "User has been assigned to the project." });
    } catch (err) {
      console.error("Error occurred in assignUserToProject:", err);
      res.status(500).json({ message: err.message });
    }
  },
};

module.exports = projectController;
