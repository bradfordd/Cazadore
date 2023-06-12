const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.registerNewUser = async (req, res) => {
  // Hash the password before storing it
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  // Create a new user
  const user = new User({
    username: req.body.username,
    password: hashedPassword,
  });

  // Save user to the database
  try {
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
      res.send("Not Allowed");
    }
  } catch {
    res.status(500).send();
  }
};
