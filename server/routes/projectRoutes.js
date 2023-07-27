const express = require("express");
const projectController = require("../controllers/projectController");
const router = express.Router();
const authenticateJWT = require("../middleware/authenticateJWT");
const projectManagerAuthorization = require("../middleware/verifyProjectManager");
const projectManagerRoleCheck = require("../middleware/checkProjectManagerRole");
const verifyDeveloperRole = require("../middleware/checkDeveloperRole");

// Ensure that user is authenticated for all routes
router.use(authenticateJWT);

router.get(
  "/developer",
  verifyDeveloperRole,
  projectController.getProjectsOfDeveloper
);

router.get("/isAssignedManager/:id", projectController.isAssignedManager);

router.get(
  "/isDeveloperTeamMember/:id",
  projectController.isDeveloperTeamMember
);

// Get managed projects by the logged-in user
router.get("/managed", authenticateJWT, projectController.getManagedProjects);

// Create a new project
// Ensure that user is a project manager
router.post(
  "/create",
  projectManagerRoleCheck,
  projectController.createProject
);

// Get all projects
router.get("/all", projectController.getAllProjects);

// Add a member to a specific project
// Ensure that user is the project manager for this project
router.put(
  "/:id/addMember",
  projectManagerAuthorization,
  projectController.addMemberToProject
);

// Get a specific project
router.get("/:id", projectController.getProject);

// Update a specific project
// Ensure that user is the project manager for this project
router.put(
  "/:id",
  projectManagerAuthorization,
  projectController.updateProject
);

// Delete a specific project
// Ensure that user is the project manager for this project
router.delete(
  "/:id",
  projectManagerAuthorization,
  projectController.deleteProject
);

router.get(
  "/:id/unassigned-developers",
  projectManagerAuthorization,
  projectController.getUnassignedDevelopers
);

// Get all users who are either a project manager or a developer for a specific project
router.get("/:id/participants", projectController.getProjectParticipants);

module.exports = router;
