const express = require("express");
const projectController = require("../controllers/projectController");
const router = express.Router();
const authenticateJWT = require("../middleware/authenticateJWT");
const authorizeProjectUpdate = require("../middleware/authorizeProjectUpdate"); // assume this middleware authorizes update/delete actions

// Ensure that user is authenticated for all routes
router.use(authenticateJWT);

// Create a new project
router.post("/create", projectController.createProject);

// Get all projects
router.get("/all", projectController.getAllProjects);

// Get a specific project
router.get("/:id", projectController.getProject);

// Update a specific project
router.put("/:id", authorizeProjectUpdate, projectController.updateProject);

// Delete a specific project
router.delete("/:id", authorizeProjectUpdate, projectController.deleteProject);

// Add a member to a specific project
router.put(
  "/:id/addMember",
  authorizeProjectUpdate,
  projectController.addMemberToProject
);

module.exports = router;
