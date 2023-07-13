const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  projectManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  teamMembers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  bugReports: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BugReport",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

const Project = mongoose.model("Project", ProjectSchema);

module.exports = Project;
