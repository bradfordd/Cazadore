const jwt = require("jsonwebtoken");

function authenticateJWT(req, res, next) {
  console.log("Authenticating JWT");
  console.log("Cookies: ", req.cookies);
  const token = req.cookies.token;

  console.log("Token from cookies: ", token);

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) {
        console.log("Error verifying token: ", err);
        return res.sendStatus(403);
      }

      console.log("Verified user from token: ", user);
      req._id = user.id;

      next();
    });
  } else {
    console.log("No token provided");
    res.sendStatus(401);
  }
}

module.exports = authenticateJWT;
