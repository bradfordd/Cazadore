import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import styles from "./Register.module.css"; // updated import
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usernameError, setUsernameError] = useState(""); // To display username error message
  const [passwordError, setPasswordError] = useState(""); // To display password error message
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [role, setRole] = useState("developer");

  const usernameTippyRef = useRef();
  const passwordTippyRef = useRef();
  const confirmPasswordTippyRef = useRef();

  const navigate = useNavigate();

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [successMessage, navigate]);

  const handleUsernameChange = (event) => {
    const value = event.target.value;
    setUsername(value);
    validateUsername(value);
  };

  const handlePasswordChange = (event) => {
    const value = event.target.value;
    setPassword(value);
    validatePassword(value);
  };

  const handleConfirmPasswordChange = (event) => {
    const value = event.target.value;
    setConfirmPassword(value);
    if (value !== password) {
      setConfirmPasswordError("Passwords do not match.");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const validateUsername = (username) => {
    // Check if the username is too short or too long
    if (username.length < 8 || username.length > 25) {
      setUsernameError("Username must be 8-25 characters long.");
      return;
    }

    // Check if the username contains only letters and numbers
    const containsOnlyLettersAndNumbers = /^[a-zA-Z0-9]+$/.test(username);
    if (!containsOnlyLettersAndNumbers) {
      setUsernameError(
        "Username can only contain letters (A-Z, a-z) and numbers (0-9)."
      );
      return;
    }

    // If all checks pass, reset the error message
    setUsernameError("");
  };

  const validatePassword = (password) => {
    // Checking if the password is 8-25 characters long
    if (password.length < 8 || password.length > 25) {
      setPasswordError("Password should be between 8 to 25 characters long");
      return;
    }

    // Checking for presence of at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      setPasswordError("Password should contain at least one lowercase letter");
      return;
    }

    // Checking for presence of at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      setPasswordError("Password should contain at least one uppercase letter");
      return;
    }

    // Checking for presence of at least one digit
    if (!/\d/.test(password)) {
      setPasswordError("Password should contain at least one number");
      return;
    }

    // Checking for presence of at least one special character
    if (!/[@$!%*?&#_\-+=^~[\]{}:;,.<>\/\\|]/.test(password)) {
      setPasswordError(
        "Password should contain at least one special character (@, $, !, %, *, ?, &, #, _, -, +, =, ^, ~, [, ], {, }, :, ;, ,, ., <, >, /, \\, |)"
      );
      return;
    }

    setPasswordError(""); // reset the error message if input is valid
  };

  const handleSubmit = async (event) => {
    setFormError(""); // Clear the general form error when form is submitted

    event.preventDefault();

    // validate the inputs again before making the request
    validateUsername(username);
    validatePassword(password);

    if (!role) {
      setFormError("Please select a role.");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return; // don't submit the form if the passwords don't match
    }
    // wait for state updates before proceeding
    setTimeout(async () => {
      if (usernameError) {
        if (usernameTippyRef.current) {
          usernameTippyRef.current.show(); // Manually show the tooltip
        }
      } else {
        if (usernameTippyRef.current) {
          usernameTippyRef.current.hide(); // Manually hide the tooltip
        }
      }

      if (passwordError) {
        if (passwordTippyRef.current) {
          passwordTippyRef.current.show(); // Manually show the tooltip
        }
      } else {
        if (passwordTippyRef.current) {
          passwordTippyRef.current.hide(); // Manually hide the tooltip
        }
      }

      if (!usernameError && !passwordError) {
        try {
          const response = await axios.post(
            `http://localhost:5000/api/users/register`,
            {
              username,
              password,
              role,
            }
          );
          console.log(response);
          // set success message
          setSuccessMessage("Registration successful!");
          // handle response, store user data, etc...
        } catch (err) {
          setFormError(err.response.data.message);
        }
      }
    }, 0);
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <h1>Register</h1>
      {successMessage && (
        <p>
          {styles.successMessage}
          {successMessage}
        </p>
      )}
      <form className={styles.registerForm} onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <br />
          <Tippy
            content={usernameError}
            onCreate={(tippy) => (usernameTippyRef.current = tippy)}
            visible={!!usernameError}
            placement="left"
          >
            <input
              type="text"
              name="username"
              required
              onChange={handleUsernameChange}
            />
          </Tippy>
        </div>
        <div>
          <label>Password:</label>
          <br />
          <Tippy
            content={passwordError}
            onCreate={(tippy) => (passwordTippyRef.current = tippy)}
            visible={!!passwordError}
            placement="left"
          >
            <input
              type="password"
              name="password"
              required
              onChange={handlePasswordChange}
            />
          </Tippy>
        </div>
        <div>
          <label>Confirm Password:</label>
          <br />
          <Tippy
            content={confirmPasswordError}
            onCreate={(tippy) => (confirmPasswordTippyRef.current = tippy)}
            visible={!!confirmPasswordError}
            placement="left"
          >
            <input
              type="password"
              name="confirmPassword"
              required
              onChange={handleConfirmPasswordChange}
            />
          </Tippy>
        </div>
        <div>
          <label>Role:</label>
          <br />
          <input
            type="radio"
            id="developer"
            name="role"
            value="developer"
            onChange={handleRoleChange}
            defaultChecked
          />
          <label htmlFor="developer">Developer</label>
          <br />
          <input
            type="radio"
            id="project-manager"
            name="role"
            value="project manager"
            onChange={handleRoleChange}
          />
          <label htmlFor="project-manager">Project Manager</label>
        </div>

        {formError && <p className="form-error">{formError}</p>}
        <button type="submit">Register</button>
      </form>
      <div className={styles.registerLink}>
        <Link to="/login">Already have an account? Login</Link>
      </div>
    </div>
  );
};

export default Register;
