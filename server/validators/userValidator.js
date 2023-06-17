const validator = require("validator");

exports.validatePassword = function (password) {
  // Check if the password is at least 8 characters long
  if (!validator.isLength(password, { min: 8, max: 25 })) {
    return "Password should be between 8 to 25 characters long.";
  }

  // Check if the password includes at least one lowercase letter
  if (!validator.matches(password, /[a-z]/)) {
    return "Password should contain at least one lowercase letter.";
  }

  // Check if the password includes at least one uppercase letter
  if (!validator.matches(password, /[A-Z]/)) {
    return "Password should contain at least one uppercase letter.";
  }

  // Check if the password includes at least one number
  if (!validator.matches(password, /\d/)) {
    return "Password should contain at least one number.";
  }

  // Check if the password includes at least one special character
  if (!validator.matches(password, /[@$!%*?&#_\-+=^~[\]{}:;,.<>\/\\|]/)) {
    return "Password should contain at least one special character (@, $, !, %, *, ?, &, #, _, -, +, =, ^, ~, [, ], {, }, :, ;, ,, ., <, >, /, \\, |).";
  }

  // If all checks pass, the password is valid
  return true;
};

exports.validateUsername = function (username) {
  // Check if the username is at least 8 characters long
  if (!validator.isLength(username, { min: 8, max: 25 })) {
    return "Username must be 8-25 characters long.";
  }

  // Check if the username includes only letters and numbers
  if (!validator.isAlphanumeric(username)) {
    return "Username can only contain letters (A-Z, a-z) and numbers (0-9).";
  }

  // If all checks pass, the username is valid
  return true;
};
