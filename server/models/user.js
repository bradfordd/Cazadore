const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "project manager", "developer"],
    required: true,
  },
  managedProjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: [],
    },
  ],
  participatingProjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: [],
    },
  ],
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
