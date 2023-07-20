const developerRoleCheck = (req, res, next) => {
  console.log("req.user", req.user);
  if (req.user.role !== "developer") {
    return res.status(403).json({ message: "User is not a developer" });
  }
  next();
};

module.exports = developerRoleCheck;
