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
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: function () {
      return (
        this.role === "project manager" && this.lastUpdatedProject !== null
      );
    },
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
