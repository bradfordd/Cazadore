const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    bugReport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BugReport",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    attachment: {
      type: Buffer, // Store the binary data of the image
      required: false, // You can make this required if every comment must have an attachment
    },
  },
  {
    timestamps: true, // This adds fields for creation and update timestamps
  }
);

module.exports = mongoose.model("Comment", commentSchema);
