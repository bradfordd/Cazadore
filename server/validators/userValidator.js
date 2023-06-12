const validator = require("validator");

exports.validatePassword = function (password) {
  // Check if the password is at least 8 characters long
  if (!validator.isLength(password, { min: 8, max: 25 })) {
    return "Password must be at least 8 characters long and no more than 25 characters long.";
  }

  // Check if the password includes at least one uppercase letter, one lowercase letter, one number, and one special character
  if (
    !validator.matches(
      password,
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
  ) {
    return "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.";
  }

  // If all checks pass, the password is valid
  return true;
};

exports.validateUsername = function (username) {
  // Check if the username is alphanumeric
  if (!validator.isAlphanumeric(username)) {
    return "Username can only contain letters and numbers.";
  }

  // Check if the username is at least 8 characters long and no more than 25 characters long
  if (!validator.isLength(username, { min: 8, max: 25 })) {
    return "Username must be at least 8 characters long and no more than 25 characters long.";
  }

  // If all checks pass, the username is valid
  return true;
};
