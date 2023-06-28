import { useState } from "react";
import logo from "../../assets/logo.png";
import "./Navbar.css";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <nav>
      <img src={logo} alt="Company Logo" />
      {isLoggedIn && (
        <ul>
          <li>
            <a href="/profile">Profile</a>
          </li>
          <li>
            <a href="/logout" onClick={() => setIsLoggedIn(false)}>
              Logout
            </a>
          </li>
          {/* other menu options */}
        </ul>
      )}
      {!isLoggedIn && (
        <ul>
          <li>
            <a href="/login">Login</a>
          </li>
          <li>
            <a href="/register">Register</a>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
