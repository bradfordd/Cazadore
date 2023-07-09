const jwt = require("jsonwebtoken");
const User = require("../models/user");

function verifyToken(token, secretKey) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        reject(err);
      } else {
        resolve(user);
      }
    });
  });
}

async function authenticateJWT(req, res, next) {
  console.log("Authenticating JWT");
  console.log("Cookies: ", req.cookies);
  const token = req.cookies.token;

  console.log("Token from cookies: ", token);

  if (token) {
    try {
      const user = await verifyToken(token, process.env.JWT_SECRET_KEY);
      console.log("Verified user from token: ", user);

      req.user = user;
      const userFromDb = await User.findById(req.user.id, "username _id");

      if (userFromDb) {
        req.user = userFromDb;
      } else {
        return res.status(404).json({ message: "User not found" });
      }

      next();
    } catch (err) {
      console.log("Error verifying token: ", err);
      return res.sendStatus(403);
    }
  } else {
    console.log("No token provided");
    res.sendStatus(401);
  }
}
module.exports = authenticateJWT;
