const express = require("express");
const router = express.Router();
const multer = require("multer");
const Comment = require("../models/comments");
const authenticateJWT = require("../middleware/authenticateJWT");
const commentController = require("../controllers/commentController");

// Multer configuration for file uploads
const storage = multer.memoryStorage(); // This stores the image in memory
const upload = multer({ storage: storage });

// Ensure that user is authenticated for all routes
router.use(authenticateJWT);

// CREATE a new comment (with optional image attachment)
router.post(
  "/",
  (req, res, next) => {
    console.log("Using the POST / route to create a new comment.");
    next();
  },
  upload.single("attachment"),
  commentController.createComment
);

// READ all comments for a specific bug report
router.get("/bug/:bugReportId", commentController.getAllComments);

// UPDATE a comment by its ID
router.put(
  "/:id",
  upload.single("attachment"),
  commentController.updateComment
);

// DELETE a comment by its ID
router.delete("/:id", commentController.deleteComment);

module.exports = router;
