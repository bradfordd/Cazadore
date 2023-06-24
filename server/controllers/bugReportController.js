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

// New function to get all bug reports
exports.getAllBugReports = async (req, res) => {
  try {
    const bugReports = await BugReport.find({});

    // send success response
    res.status(200).json(bugReports);
  } catch (error) {
    // send error response
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
