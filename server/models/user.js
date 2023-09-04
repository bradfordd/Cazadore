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
  lastUpdatedProject: {
    type: mongoose.Schema.Types.ObjectId, // holds the objectID of the last updated project
    ref: "Project", // assuming your project model is named "Project"
    required: function () {
      return this.role === "project manager";
    }, // only required if role is "project manager"
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
