const mongoose = require("mongoose");
const BugReport = require("./models/bugreport"); // adjust the path according to your project structure

// Replace the following with your MongoDB connection string
const MONGODB_URI =
  "mongodb+srv://dbradford1337:VpxKIPeVSNareSeJ@sharedcluster.qczt561.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB...");
    // Delete all bug reports
    return BugReport.deleteMany({});
  })
  .then(() => {
    console.log("All bug reports deleted successfully.");
    // Close the connection to the database
    return mongoose.connection.close();
  })
  .catch((err) => {
    console.error("An error occurred:", err);
  });
