const User = require("../models/user");
const Project = require("../models/project");
const bcrypt = require("bcrypt");
const validator = require("../validators/userValidator");
const jwt = require("jsonwebtoken");

exports.registerNewUser = async (req, res) => {
  const existingUser = await User.findOne({ username: req.body.username });
  if (existingUser) {
    return res.status(400).json({ message: "Username already exists" });
  }

  const usernameValidationResult = validator.validateUsername(
    req.body.username
  );
  const passwordValidationResult = validator.validatePassword(
    req.body.password
  );

  if (usernameValidationResult !== true) {
    return res.status(400).json({ message: usernameValidationResult });
  }
  if (passwordValidationResult !== true) {
    return res.status(400).json({ message: passwordValidationResult });
  }

  // Check if the role is valid
  const acceptedRoles = ["admin", "project manager", "developer"];
  if (!acceptedRoles.includes(req.body.role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  // Only add lastUpdatedProject field if the user is a project manager
  let userFields = {
    username: req.body.username,
    password: hashedPassword,
    role: req.body.role,
  };

  if (req.body.role === "project manager") {
    userFields.lastUpdatedProject = null;
  }

  const user = new User(userFields);

  try {
    const newUser = await user.save();
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Lax",
      secure: false,
    });

    res.status(201).json({ newUser });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.loginUser = async (req, res) => {
  console.log("Environment: ", process.env.NODE_ENV);
  console.log("Login attempt received. User: ", req.body.username);

  console.log("Attempting to find user in database...");
  const user = await User.findOne({ username: req.body.username });

  if (user == null) {
    console.log("No user found for username: ", req.body.username);
    return res.status(400).json({ message: "Cannot find user" });
  }

  console.log("User found, attempting to compare passwords...");
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      console.log("Password match for user: ", user.username);

      console.log("Passwords match, generating token...");
      const tokenPayload = {
        id: user._id,
        role: user.role, // Assuming 'role' is the name of the field in your User model
      };
      const token = jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY, {
        expiresIn: "24h",
      });

      console.log("Token generated: ", token);

      console.log("Setting cookie and sending response...");
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "Lax",
        secure: false,
      });

      // Send the role back to the client along with the success message
      res.status(200).json({ message: "Login successful", role: user.role });
    } else {
      console.log("Password mismatch for user: ", user.username);
      res.status(403).json({ message: "Not Allowed" }); // Unauthorized access
    }
  } catch (err) {
    console.log("Error during login attempt: ", err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "username _id role");
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getCurrentUser = async (req, res) => {
  console.log("Getting current user...");
  try {
    console.log("Looking up user with ID: ", req._id);
    const user = await User.findById(req.user._id, "username _id role");
    if (user) {
      console.log("Found user: ", user);
      res.status(200).json(user);
    } else {
      console.log("User not found for ID: ", req.user._id);
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error("Error occurred while fetching user: ", err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.isUserDeveloper = async (req, res) => {
  try {
    const user = await User.findById(req.user._id, "role");
    if (user && user.role === "developer") {
      return res.status(200).json({ isDeveloper: true });
    } else {
      return res.status(200).json({ isDeveloper: false });
    }
  } catch (err) {
    console.error(
      "Error occurred while checking if user is a developer: ",
      err.message
    );
    res.status(500).json({ message: err.message });
  }
};

exports.isUserProjectManager = async (req, res) => {
  try {
    const user = await User.findById(req.user._id, "role");
    if (user && user.role === "project manager") {
      return res.status(200).json({ isProjectManager: true });
    } else {
      return res.status(200).json({ isProjectManager: false });
    }
  } catch (err) {
    console.error(
      "Error occurred while checking if user is a project manager: ",
      err.message
    );
    res.status(500).json({ message: err.message });
  }
};

exports.updateLastUpdatedProject = async (req, res) => {
  console.log("Attempting to update lastUpdatedProject...");
  console.log("req.user: " + req.user);
  const userId = req.user._id;
  const lastUpdatedProject = req.body.lastUpdatedProject; // This can be null

  try {
    console.log(`Looking for user with ID: ${userId}`);
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Only allow project managers to update this field
    if (user.role !== "project manager") {
      return res.status(403).json({ message: "Not authorized" });
    }

    // If lastUpdatedProject is null, no need to check for the project
    if (lastUpdatedProject !== null) {
      const project = await Project.findById(lastUpdatedProject);

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      if (project.projectManager.toString() !== userId.toString()) {
        return res
          .status(403)
          .json({ message: "You are not the manager of this project" });
      }
    }

    // Update the lastUpdatedProject field (this can set it to null)
    user.lastUpdatedProject = lastUpdatedProject;
    await user.save();

    res
      .status(200)
      .json({ message: "Last updated project field updated successfully" });
  } catch (err) {
    console.error(
      "Error occurred while updating lastUpdatedProject:",
      err.message
    );
    res.status(500).json({ message: err.message });
  }
};

exports.getLastUpdatedProject = async (req, res) => {
  try {
    console.log("Getting last updated project for current user...");
    const user = await User.findById(req.user._id, "lastUpdatedProject");

    if (user) {
      console.log("Found user:", user);
      res.status(200).json({ lastUpdatedProject: user.lastUpdatedProject });
    } else {
      console.log("User not found for ID:", req.user._id);
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error(
      "Error occurred while fetching last updated project:",
      err.message
    );
    res.status(500).json({ message: err.message });
  }
};
