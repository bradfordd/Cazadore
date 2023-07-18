const projectManagerRoleCheck = (req, res, next) => {
  console.log("req.user", req.user);
  if (req.user.role !== "project manager") {
    return res.status(403).json({ message: "User is not a project manager" });
  }
  next();
};

module.exports = projectManagerRoleCheck;
