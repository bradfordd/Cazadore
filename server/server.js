const express = require("express");
const db = require("./db");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes"); // import the user routes
const bugReportRoutes = require("./routes/bugReportRoutes"); // import the bug report routes
const projectRoutes = require("./routes/projectRoutes"); // import the project routes
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser"); // import the cookie-parser
const authenticateJWT = require("./middleware/authenticateJWT");
require("dotenv").config({ path: "../.env" });

const app = express();

app.use(morgan("combined"));

app.use(
  cors({
    origin: "http://localhost:5173", // replace with your frontend's address
    credentials: true, // add this line
  })
);

app.use(bodyParser.json());
app.use(cookieParser()); // use the cookie-parser middleware

// use your routes
app.use("/api/users", userRoutes);
app.use("/api/bugReports", bugReportRoutes); // use bug report routes
app.use("/api/projects", projectRoutes); // use project routes

app.get("/api/protected", authenticateJWT, (req, res) => {
  res.send("You accessed a protected route!");
});

db.connect();

app.listen(5000, () => console.log("Server running on port 5000"));
