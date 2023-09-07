const isUserDeveloper = (user) => {
  if (!user || !user.role) {
    return false;
  }
  return user.role === "developer";
};

module.exports = isUserDeveloper;
