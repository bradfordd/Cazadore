const BugReport = require("../models/bugreport");

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

exports.getBugReportById = async (req, res) => {
  try {
    const bugReport = await BugReport.findById(req.params.id);

    // If the bug report was not found, send an appropriate error message
    if (!bugReport) {
      return res.status(404).json({ message: "Bug report not found" });
    }

    // send success response
    res.status(200).json(bugReport);
  } catch (error) {
    // send error response
    res.status(500).json({ error: error.message });
  }
};
