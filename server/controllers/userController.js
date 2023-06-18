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
    console.log("Saving user to the database..."); // Log when starting to save user to the database
    const newUser = await user.save();
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
    res.status(201).json({
      newUser,
      token, // Add token to response
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.loginUser = async (req, res) => {
  // Find user
  const user = await User.findOne({ username: req.body.username });
  if (user == null) {
    return res.status(400).json({ message: "Cannot find user" });
  }

  try {
    // Check password
    if (await bcrypt.compare(req.body.password, user.password)) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "1h",
      });
      res.json({ token }); // Send the token in the response
    } else {
      res.status(403).json({ message: "Not Allowed" }); // Unauthorized access
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
