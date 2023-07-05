const BugReport = require("../models/bugreport");
const User = require("../models/user");

exports.updateBugReport = async (req, res) => {
  try {
    // First, we'll validate the user ID
    const user = await User.findById(req.body.assignedTo);
    if (!user) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    // Check if bug report is active
    const bugReport = await BugReport.findById(req.params.id);
    if (!bugReport || !bugReport.isActive) {
      return res
        .status(404)
        .json({ error: "Bug report not found or already deleted" });
    }

    // Now, we'll update the bug report
    const updatedBugReport = await BugReport.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // option that returns the new version of the updated document
        runValidators: true, // validates the update operation against the model's schema
      }
    );

    // If no bug report was found with the provided ID, return an error
    if (!updatedBugReport) {
      return res.status(404).json({ error: "Bug report not found" });
    }

    res.status(200).json(updatedBugReport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createBugReport = async (req, res) => {
  try {
    // extract data from request
    const {
      title,
      description,
      stepsToReproduce,
      expectedResult,
      actualResult,
      priority,
      createdBy,
    } = req.body;

    // create new bug report
    const newBugReport = new BugReport({
      title,
      description,
      stepsToReproduce,
      expectedResult,
      actualResult,
      priority,
      createdBy,
      status: "Open", // default status
      assignedTo: null, // not assigned yet
    });

    // save bug report to database
    const savedBugReport = await newBugReport.save();

    // send success response
    res.status(201).json(savedBugReport);
  } catch (error) {
    // send error response
    res.status(500).json({ error: error.message });
  }
};

// Updated function to get all bug reports with pagination
// Updated function to get all bug reports with pagination and search functionality
// Updated function to get all bug reports with pagination and search functionality
exports.getAllBugReports = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const searchTerm = req.query.searchTerm || "";

  // Extract filter parameters from request query
  const statusFilter = req.query.status;
  const priorityFilter = req.query.priority;
  const assigneeFilter = req.query.assignedTo;

  // Construct MongoDB query based on filters
  let query = {
    title: new RegExp(searchTerm, "i"), // This will find bug reports with a title containing the searchTerm
    isActive: true, // Only return active bug reports
  };

  if (statusFilter) {
    query.status = statusFilter;
  }

  if (priorityFilter) {
    query.priority = priorityFilter;
  }

  if (assigneeFilter) {
    query.assignedTo = assigneeFilter;
  }

  try {
    const bugReports = await BugReport.find(query)
      .populate("assignedTo", "_id username")
      .populate("createdBy", "_id username")
      .skip((page - 1) * limit)
      .limit(limit);

    // Get total number of bug reports matching the searchTerm and filters
    const totalBugReports = await BugReport.countDocuments(query);

    res.status(200).json({
      total: totalBugReports,
      page,
      limit,
      bugReports,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.assignBugReport = async (req, res) => {
  try {
    // Validate the user ID
    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    // Update the bug report's assignedTo field
    const updatedBugReport = await BugReport.findByIdAndUpdate(
      req.params.id,
      { assignedTo: req.body.userId },
      {
        new: true, // option that returns the new version of the updated document
        runValidators: true, // validates the update operation against the model's schema
      }
    ).populate("assignedTo", "_id username"); // Populate the 'assignedTo' field

    // If no bug report was found with the provided ID, return an error
    if (!updatedBugReport) {
      return res.status(404).json({ error: "Bug report not found" });
    }

    res.status(200).json(updatedBugReport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.retireBugReport = async (req, res) => {
  try {
    // Try to find the bug report by ID and update the isActive field
    const updatedBugReport = await BugReport.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      {
        new: true, // Returns the updated document
        runValidators: true, // Validates the update operation against the schema
      }
    );

    // If no bug report was found with the provided ID, return an error
    if (!updatedBugReport) {
      return res.status(404).json({ error: "Bug report not found" });
    }

    // Send the updated bug report in the response
    res.status(200).json(updatedBugReport);
  } catch (error) {
    // If there was a problem, respond with the error message
    res.status(500).json({ error: error.message });
  }
};

exports.reactivateBugReport = async (req, res) => {
  try {
    // Try to find the bug report by ID and update the isActive field
    const updatedBugReport = await BugReport.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      {
        new: true, // Returns the updated document
        runValidators: true, // Validates the update operation against the schema
      }
    );

    // If no bug report was found with the provided ID, return an error
    if (!updatedBugReport) {
      return res.status(404).json({ error: "Bug report not found" });
    }

    // Send the updated bug report in the response
    res.status(200).json(updatedBugReport);
  } catch (error) {
    // If there was a problem, respond with the error message
    res.status(500).json({ error: error.message });
  }
};

exports.getBugReportById = async (req, res) => {
  try {
    const bugReport = await BugReport.findById(req.params.id)
      .populate("assignedTo", "-password -__v") // Exclude password and __v fields
      .populate("createdBy", "-password -__v") // Exclude password and __v fields
      .populate({
        path: "comments",
        populate: {
          path: "postedBy",
          select: "username _id", // include the username and _id of the commenter
        },
      });

    // If the bug report was not found or isActive is false, send an appropriate error message
    if (!bugReport || !bugReport.isActive) {
      return res.status(404).json({ message: "Bug report not found" });
    }

    // send success response
    res.status(200).json(bugReport);
  } catch (error) {
    // send error response
    res.status(500).json({ error: error.message });
  }
};

exports.addCommentToBugReport = async (req, res) => {
  try {
    console.log("Request received");
    console.log("Request body: ", req.body);
    console.log("Request params: ", req.params);
    console.log("User ID from JWT: ", req._id);

    // extract data from request
    const { commentText } = req.body;
    const { id } = req.params;
    const userId = req._id;

    console.log("Fetching bug report with id: ", id);
    // get bug report
    const bugReport = await BugReport.findById(id);

    if (!bugReport) {
      console.log("Bug report not found");
      return res.status(404).json({ message: "Bug report not found" });
    }

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      console.log("User found in database: ", user);
    } catch (error) {
      console.log("Error: ", error);
      res.status(500).json({ error: error.message });
    }
    console.log("Adding comment to bug report");
    // add comment to bug report
    bugReport.comments.push({
      content: commentText,
      postedBy: userId,
    });

    console.log("Saving updated bug report");
    // save bug report
    const updatedBugReport = await bugReport.save();

    console.log("Returning updated bug report");
    res.status(200).json(updatedBugReport);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCommentFromBugReport = async (req, res) => {
  try {
    const bugReportId = req.params.bugReportId;
    const commentId = req.params.commentId;

    const bugReport = await BugReport.findById(bugReportId);
    if (!bugReport) {
      return res.status(404).json({ error: "Bug report not found" });
    }

    const comment = bugReport.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Only the comment author or a user with a certain role can delete the comment
    if (req._id !== comment.postedBy.toString()) {
      return res
        .status(403)
        .json({ error: "You don't have permission to delete this comment" });
    }

    // Pull the comment from the comments array
    bugReport.comments.pull(commentId);
    const updatedBugReport = await bugReport.save();
    res.status(200).json(updatedBugReport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
