const express = require("express");
const db = require("./db");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes"); // import the routes

const app = express();

app.use(bodyParser.json());

// use your routes
app.use("/api/users", userRoutes);

db.connect();

app.listen(5000, () => console.log("Server running on port 5000"));
