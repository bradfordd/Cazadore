const User = require("../models/user");
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

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const match = await bcrypt.compare(req.body.password, hashedPassword);

  console.log("Creating new user...");
  const user = new User({
    username: req.body.username,
    password: hashedPassword,
  });

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
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "24h",
      });

      console.log("Token generated: ", token);

      console.log("Setting cookie and sending response...");
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "Lax",
        secure: false,
      });

      res.status(200).json({ message: "Login successful" });
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
    const users = await User.find({}, "username _id");
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getCurrentUser = async (req, res) => {
  console.log("Getting current user...");
  try {
    console.log("Looking up user with ID: ", req._id);
    const user = await User.findById(req.user._id, "username _id");
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
