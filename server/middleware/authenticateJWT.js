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
  console.log("[authenticateJWT] START");

  console.log("[authenticateJWT] Authenticating JWT");
  console.log("[authenticateJWT] Cookies: ", req.cookies);
  const token = req.cookies.token;

  console.log("[authenticateJWT] Token from cookies: ", token);

  if (token) {
    try {
      const user = await verifyToken(token, process.env.JWT_SECRET_KEY);
      console.log("[authenticateJWT] Verified user from token: ", user);

      req.user = user;
      const userFromDb = await User.findById(req.user.id, "username _id role");

      if (userFromDb) {
        console.log("[authenticateJWT] Found user in DB: ", userFromDb);
        req.user = userFromDb;
        console.log("[authenticateJWT] Calling next()...");
        next();
      } else {
        console.log("[authenticateJWT] User not found in DB");
        return res.status(404).json({ message: "User not found" });
      }
    } catch (err) {
      console.log("[authenticateJWT] Error verifying token: ", err);
      return res.sendStatus(403);
    }
  } else {
    console.log("[authenticateJWT] No token provided");
    res.sendStatus(401);
  }

  console.log("[authenticateJWT] END");
}

module.exports = authenticateJWT;
