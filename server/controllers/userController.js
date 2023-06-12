const User = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("../validators/userValidator");

exports.registerNewUser = async (req, res) => {
  console.log("New user registration started..."); // Log when registration starts
  console.log("Entered Username: " + req.body.username);
  console.log("Entered Password: " + req.body.password);
  // Validate the username and password
  const usernameValidationResult = validator.validateUsername(
    req.body.username
  );
  const passwordValidationResult = validator.validatePassword(
    req.body.password
  );

  console.log("Username validation result: ", usernameValidationResult); // Log username validation result
  console.log("Password validation result: ", passwordValidationResult); // Log password validation result

  // If either validation fails, send an error message back to the client
  if (usernameValidationResult !== true) {
    return res.status(400).json({ message: usernameValidationResult });
  }
  if (passwordValidationResult !== true) {
    return res.status(400).json({ message: passwordValidationResult });
  }

  // Hash the password before storing it
  console.log("Hashing password..."); // Log when starting to hash the password
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  console.log("Password hashed: ", hashedPassword); // Log the hashed password

  // Testing bcrypt hashing and comparison
  console.log("Testing bcrypt hashing and comparison...");

  const match = await bcrypt.compare(req.body.password, hashedPassword);
  console.log(
    "Do the original password and the hashed password match?:",
    match
  );
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
    console.log("User saved successfully. User: ", newUser); // Log the new user data after successful save
    res.status(201).json(newUser);
  } catch (err) {
    console.error("Failed to save user to the database. Error: ", err); // Log the error if failed to save user to the database
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
      console.log("Failed login attempt:"); // Start of the debugging code
      console.log("Entered password: " + req.body.password);
      console.log("Stored hashed password: " + user.password);
      //       const enteredPassword = req.body.password;
      //       const saltRounds = 10; // choose a suitable number of salt rounds
      //       const hashedEnteredPassword = await bcrypt.hash(
      //         enteredPassword,
      //         saltRounds
      //       );
      //       console.log("Entered Password After Hash: " + hashedEnteredPassword);
      const match = await bcrypt.compare(req.body.password, user.password);
      console.log(
        "Do the entered password and the stored hashed password match?: ",
        match
      ); // End of the debugging code
      res.send("Not Allowed");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};
