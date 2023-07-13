const mongoose = require("mongoose");
const Project = require("./models/project"); // Adjust path according to your project structure

async function updateProjects() {
  // Connect to your MongoDB
  await mongoose.connect(
    "mongodb+srv://dbradford1337:VpxKIPeVSNareSeJ@sharedcluster.qczt561.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  // Update all projects
  await Project.updateMany(
    {}, // select all documents
    { $rename: { createdBy: "projectManager" } } // rename 'createdBy' to 'projectManager'
  );

  console.log("All projects updated successfully");
  process.exit(0); // exit script
}

updateProjects().catch((error) => {
  console.error("An error occurred during the update process: ", error);
  process.exit(1); // exit script with an error status
});
