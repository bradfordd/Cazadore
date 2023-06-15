import React, { useState } from "react";
import axios from "axios";
import "./Register.css";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // To display any error message

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // basic validation rules
    const passwordValidation =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,25}$/;
    const usernameValidation = /^[a-zA-Z0-9]{8,25}$/;

    if (!usernameValidation.test(username)) {
      setError("Invalid username");
      return;
    }

    if (!passwordValidation.test(password)) {
      setError("Invalid password");
      return;
    }

    // Proceed with server request if validation passed
    try {
      const response = await axios.post(
        `http://localhost:5000/api/users/register`,
        {
          username,
          password,
        }
      );
      // handle response, store user data, etc...
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <div className="container">
      <Navbar />
      <h1>Register</h1>
      <form className="register-form" onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <br />
          <input
            type="text"
            name="username"
            required
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          <label>Password:</label>
          <br />
          <input
            type="password"
            name="password"
            required
            onChange={handlePasswordChange}
          />
        </div>
        {error && <p>{error}</p>} {/* Displaying the error message */}
        <button type="submit">Register</button>
      </form>
      <div className="register-link">
        <Link to="/login">Already have an account? Login</Link>
      </div>
    </div>
  );
};

export default Register;
