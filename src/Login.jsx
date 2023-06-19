import React, { useState } from "react";
import axios from "axios";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // To display any error message

  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:5000/api/users/login`,
        {
          username,
          password,
        },
        { withCredentials: true } // Add this line
      );

      if (response.status === 200) {
        // If login was successful, navigate to the homepage
        navigate("/homepage");
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <div className="container">
      <Navbar />
      <h1>Login</h1>
      <form className="login-form" onSubmit={handleSubmit}>
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
        <button type="submit">Login</button>
      </form>
      <div>
        <Link to="/register">Don't have an account? Register</Link>
      </div>
    </div>
  );
};

export default Login;
