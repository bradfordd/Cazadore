const mongoose = require("mongoose"); // added mongoose require to set debug
const db = require("../db"); // Replace with your actual path to your db connection module
const User = require("../models/user"); // Replace with the actual path to your User model

// Enable Mongoose debug mode
mongoose.set("debug", true);

// MongoDB Connection
db.connect()
  .then(() => {
    console.log("MongoDB connected...");

    console.log("About to run update operation...");
    // Update all users with the role 'project manager' to have an empty 'lastUpdatedProject' field
    return User.updateMany(
      { role: "project manager" },
      { $set: { lastUpdatedProject: null } }
    );
  })
  .then((res) => {
    console.log("Update operation completed.");
    console.log("Number of documents matched:", res.n);
    console.log("Number of documents modified:", res.nModified);
  })
  .catch((err) => {
    console.log("An error occurred:", err);
  })
  .finally(() => {
    // Close the MongoDB connection (only do this if not running inside your main app)
    db.close()
      .then(() => {
        console.log("MongoDB connection closed!");
      })
      .catch((err) => {
        console.log("Failed to close MongoDB connection:", err);
      });
  });
