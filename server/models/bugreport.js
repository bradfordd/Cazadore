const mongoose = require("mongoose");

const bugReportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    stepsToReproduce: {
      type: String,
      required: true,
    },
    expectedResult: {
      type: String,
      required: true,
    },
    actualResult: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
      required: true,
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Closed"],
      default: "Open",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    isActive: {
      // New field
      type: Boolean,
      default: true,
    },
    comments: [
      {
        postedBy: {
          // change 'author' to 'postedBy'
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        content: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true, // This adds fields for creation and update timestamps
  }
);

module.exports = mongoose.model("BugReport", bugReportSchema);
