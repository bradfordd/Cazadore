const User = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("../validators/userValidator");

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
    res.status(201).json(newUser);
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
      res.send("Success");
    } else {
      const match = await bcrypt.compare(req.body.password, user.password);
      res.send("Not Allowed");
    }
  } catch (err) {
    res.status(500).send();
  }
};
