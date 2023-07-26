const BugReport = require("../models/bugreport");
const User = require("../models/user");
const Project = require("../models/project");

const validateBugReportInput = (body) => {
  const {
    title,
    description,
    stepsToReproduce,
    expectedResult,
    actualResult,
    createdBy,
    priority,
    projectId,
  } = body;

  if (
    !title ||
    !description ||
    !stepsToReproduce ||
    !expectedResult ||
    !actualResult ||
    !createdBy ||
    !priority ||
    !projectId
  ) {
    return false;
  }

  return true;
};

exports.updateBugReport = async (req, res) => {
  try {
    console.log("Received request to update bug report with body:", req.body);

    // Define the fields we want to allow updating
    const updateFields = [
      "title",
      "description",
      "stepsToReproduce",
      "expectedResult",
      "actualResult",
      "priority",
      "assignedTo",
    ];

    // Build an object with only the provided fields
    const updateData = {};
    for (const field of updateFields) {
      if (req.body[field]) {
        updateData[field] = req.body[field];
      }
    }

    console.log("Data to be used for update:", updateData);

    // Now, we'll update the bug report
    const updatedBugReport = await BugReport.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true, // option that returns the new version of the updated document
        runValidators: true, // validates the update operation against the model's schema
      }
    );

    console.log("Result of update operation:", updatedBugReport);

    // If no bug report was found with the provided ID, return an error
    if (!updatedBugReport) {
      console.log("No bug report found with ID:", req.params.id);
      return res.status(404).json({ error: "Bug report not found" });
    }

    res.status(200).json(updatedBugReport);
  } catch (error) {
    console.error("An error occurred while updating the bug report:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.createBugReport = async (req, res) => {
  try {
    console.log("Starting createBugReport...");

    // Extract most fields from req.body as before
    const {
      title,
      description,
      stepsToReproduce,
      expectedResult,
      actualResult,
      priority,
      projectId,
    } = req.body;

    console.log("Request Body: ", req.body);
    console.log("Received data from request:", req.body);

    // Use req.user.id directly as createdBy
    const createdBy = req.user.id;

    console.log("CreatedBy (from token):", createdBy);

    console.log("createdBy: ", createdBy);
    console.log("projectID: ", req.body.projectId);

    // Check if project and creator exist
    const project = await Project.findById(req.body.projectId);
    const creator = await User.findById(createdBy);

    console.log("Found project:", project);
    console.log("Found creator:", creator);

    if (!project || !creator) {
      console.log("Invalid project ID or creator ID!");
      return res
        .status(400)
        .json({ error: "Invalid project ID or creator ID" });
    }

    // Check if user is a member or project manager of the project
    const isTeamMember = project.teamMembers.includes(creator._id);
    const isProjectManager =
      String(project.projectManager) === String(creator._id);

    console.log("Is Team Member:", isTeamMember);
    console.log("Is Project Manager:", isProjectManager);

    if (!(isTeamMember || isProjectManager)) {
      console.log(
        "User is not authorized to create bug report for this project!"
      );
      return res.status(403).json({
        error:
          "User is neither a team member nor a project manager of the project",
      });
    }

    // create new bug report
    const newBugReport = new BugReport({
      title,
      description,
      stepsToReproduce,
      expectedResult,
      actualResult,
      priority,
      createdBy: creator._id,
      project: projectId, // Assign the project ID
      status: "Open", // default status
      assignedTo: null, // not assigned yet
    });

    console.log("New bug report to be saved:", newBugReport);

    // save bug report to database
    const savedBugReport = await newBugReport.save();

    console.log("Saved bug report:", savedBugReport);

    // send success response
    res.status(201).json(savedBugReport);
  } catch (error) {
    console.error("Error in createBugReport:", error);
    // send error response
    res.status(500).json({ error: error.message });
  }
};

// Updated function to get all bug reports with pagination
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
    console.log("Assign Bug Report function called.");

    // Check if the user object is attached to the request
    if (!req.user || !req.user._id) {
      console.log("User not authenticated.");
      return res
        .status(401)
        .json({ error: "Authentication required to assign the bug report." });
    }

    console.log(`Authenticated User ID: ${req.user._id}`);

    console.log("Bug Report ID: ", req.params.id);

    // Fetch the bug report
    const bugReport = await BugReport.findById(req.params.id).populate(
      "project"
    );

    if (!bugReport) {
      console.log("Bug report not found.");
      return res.status(404).json({ error: "Bug report not found." });
    }

    console.log(`Bug Report found for Project: ${bugReport.project.name}`);

    // Ensure the logged-in user is the project manager
    if (String(bugReport.project.projectManager) !== String(req.user._id)) {
      console.log("User is not the project manager.");
      return res
        .status(403)
        .json({ error: "Only project managers can assign bug reports." });
    }

    console.log("User is the project manager.");

    // Check if the user they want to assign is a part of the project's team members
    const isUserInTeam = bugReport.project.teamMembers.some(
      (memberId) => String(memberId) === String(req.body.userIdToAssign)
    );

    if (!isUserInTeam) {
      console.log("User to assign is not part of the project team.");
      return res
        .status(403)
        .json({ error: "The user is not a part of this project's team." });
    }

    console.log("User to assign is part of the project team.");

    // Assign the user to the bug report
    bugReport.assignedTo = req.body.userIdToAssign;
    await bugReport.save();

    console.log("Bug Report assigned successfully.");

    res.status(200).json(bugReport);
  } catch (error) {
    console.error("Error in assignBugReport function:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.retireBugReport = async (req, res) => {
  try {
    // Fetch the bug report from the database
    const bugReport = await BugReport.findById(req.params.id);

    // If no bug report was found with the provided ID, return an error
    if (!bugReport) {
      return res.status(404).json({ error: "Bug report not found" });
    }

    // If the user is authorized, retire the bug report
    bugReport.status = "Closed";
    bugReport.isActive = false;
    const updatedBugReport = await bugReport.save();

    // Send the updated bug report in the response
    res.status(200).json(updatedBugReport);
  } catch (error) {
    // If there was a problem, respond with the error message
    res.status(500).json({ error: error.message });
  }
};

exports.closeBugReport = async (req, res) => {
  console.log("closeBugReport function called");

  try {
    // Fetch the bug report from the database
    console.log("Fetching bug report with ID:", req.params.id);
    const bugReport = await BugReport.findById(req.params.id);

    // If no bug report was found with the provided ID, return an error
    if (!bugReport) {
      console.log("Bug report not found");
      return res.status(404).json({ error: "Bug report not found" });
    }

    // If the user is authorized, retire the bug report
    console.log("Changing bug report status to 'Closed'");
    bugReport.status = "Closed";
    const updatedBugReport = await bugReport.save();
    console.log("Bug report successfully updated:", updatedBugReport);

    // Send the updated bug report in the response
    res.status(200).json(updatedBugReport);
  } catch (error) {
    // If there was a problem, respond with the error message
    console.log("Error occurred:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getBugReportsByProjectId = async (req, res) => {
  try {
    const projectId = req.params.projectId;

    const bugReports = await BugReport.find({
      project: projectId,
      isActive: true,
    })
      .populate("assignedTo", "-password -__v")
      .populate("createdBy", "-password -__v");

    // If there are no active bug reports associated with the project
    if (!bugReports.length) {
      return res
        .status(404)
        .json({ message: "No active bug reports found for this project." });
    }

    // Send success response
    res.status(200).json(bugReports);
  } catch (error) {
    // Send error response
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
      .populate("createdBy", "-password -__v"); // Exclude password and __v fields

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
