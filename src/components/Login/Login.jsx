import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import styles from "./Login.module.css";

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
        { withCredentials: true }
      );

      if (response.status === 200) {
        // If login was successful, store the user's role in session storage
        sessionStorage.setItem("userRole", response.data.role);

        // Then navigate to the homepage
        navigate("/homepage");
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />{" "}
      {/* Assuming Navbar is a component you've imported elsewhere */}
      <h1>Login</h1>
      <form className={styles["login-form"]} onSubmit={handleSubmit}>
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
        {error && <p>{error}</p>}
        <button type="submit">Login</button>
      </form>
      <div>
        <Link to="/register">Don't have an account? Register</Link>
      </div>
    </div>
  );
};

export default Login;
