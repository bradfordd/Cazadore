const User = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("../validators/userValidator");
const jwt = require("jsonwebtoken");

exports.registerNewUser = async (req, res) => {
  // Validate the username and password
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

  // If either validation fails, send an error message back to the client
  if (usernameValidationResult !== true) {
    return res.status(400).json({ message: usernameValidationResult });
  }
  if (passwordValidationResult !== true) {
    return res.status(400).json({ message: passwordValidationResult });
  }

  // Hash the password before storing it
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  // Testing bcrypt hashing and comparison

  const match = await bcrypt.compare(req.body.password, hashedPassword);
  // End of testing bcrypt hashing and comparison

  // Create a new user
  console.log("Creating new user..."); // Log when starting to create new user
  const user = new User({
    username: req.body.username,
    password: hashedPassword,
  });

  // Save user to the database
  try {
    // ... (omitted for brevity) ...
    const newUser = await user.save();
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
    // Here we are using the cookie-parser middleware to set a HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({ newUser });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.loginUser = async (req, res) => {
  console.log("Environment: ", process.env.NODE_ENV);
  console.log("Login attempt received. User: ", req.body.username);

  // Find user
  const user = await User.findOne({ username: req.body.username });

  if (user == null) {
    console.log("No user found for username: ", req.body.username);
    return res.status(400).json({ message: "Cannot find user" });
  }

  try {
    // Check password
    if (await bcrypt.compare(req.body.password, user.password)) {
      console.log("Password match for user: ", user.username);

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "24h",
      });

      console.log("Token generated: ", token);

      // Setting the HTTP cookie with the token
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
    const users = await User.find({}, "username _id"); // Get all users with just 'username' and '_id' fields
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req._id, "username _id");
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
