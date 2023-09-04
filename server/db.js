const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect(
      "mongodb+srv://dbradford1337:VpxKIPeVSNareSeJ@sharedcluster.qczt561.mongodb.net/?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Connected to MongoDB!");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
}

async function close() {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed!");
  } catch (err) {
    console.error("Failed to close MongoDB connection", err);
  }
}

module.exports = { connect, close };
