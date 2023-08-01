const Comment = require("../models/comments");
const User = require("../models/user");
const BugReport = require("../models/bugreport");

exports.createComment = async (req, res) => {
  try {
    console.log("Create Comment function triggered.");
    console.log("Req.file: ", req.file);
    console.log("Req.body: ", req.body);

    const { content, bugReportId } = req.body;

    if (!content || !bugReportId) {
      console.log("Error: Content or bug report ID missing.");
      return res
        .status(400)
        .json({ error: "Content and bug report ID are required." });
    }

    console.log(`Searching for bug report with ID: ${bugReportId}`);
    const bugReport = await BugReport.findById(bugReportId);
    if (!bugReport) {
      console.log("Error: Bug report not found.");
      return res.status(404).json({ error: "Bug report not found." });
    }

    let attachmentBuffer;
    if (req.file) {
      // Check if multer processed a file
      console.log("A file has been uploaded with multer.");
      attachmentBuffer = req.file.buffer; // This is the buffer of the uploaded file
      console.log(`File size: ${attachmentBuffer.length} bytes`);
    } else {
      console.log("No file attached to the request.");
    }

    console.log(`Creating new comment for bug report: ${bugReportId}`);
    const newComment = new Comment({
      content,
      createdBy: req.user.id,
      bugReport: bugReportId,
      attachment: attachmentBuffer, // Save the file's buffer in the Comment model
    });

    const savedComment = await newComment.save();
    console.log(`Comment created with ID: ${savedComment.id}`);

    res.status(201).json(savedComment);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Updated content is required." });
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      { content },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedComment) {
      return res.status(404).json({ error: "Comment not found." });
    }

    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const deletedComment = await Comment.findByIdAndDelete(req.params.id);

    if (!deletedComment) {
      return res.status(404).json({ error: "Comment not found." });
    }

    res.status(200).json({ message: "Comment successfully deleted." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCommentsByBugReportId = async (req, res) => {
  try {
    const bugReportId = req.params.bugReportId;

    const comments = await Comment.find({ bugReport: bugReportId }).populate(
      "createdBy",
      "-password -__v"
    );

    if (!comments.length) {
      return res
        .status(404)
        .json({ message: "No comments found for this bug report." });
    }

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCommentById = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id).populate(
      "createdBy",
      "-password -__v"
    );

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllComments = async (req, res) => {
  try {
    console.log("Fetching all comments...");

    const comments = await Comment.find().populate(
      "createdBy",
      "-password -__v"
    );

    if (!comments.length) {
      return res.status(404).json({ message: "No comments found." });
    }

    res.status(200).json(comments);
  } catch (error) {
    console.error("An error occurred while fetching all comments:", error);
    res.status(500).json({ error: error.message });
  }
};
