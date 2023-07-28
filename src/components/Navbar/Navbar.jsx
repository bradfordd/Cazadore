import { useState } from "react";
import logo from "../../assets/logo.png";
import "./Navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <nav>
      {isLoggedIn && (
        <ul>
          <Link to="/homepage">
            <img src={logo} alt="Company Logo" />
          </Link>
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
          <Link to="/homepage">
            <img src={logo} alt="Company Logo" />
          </Link>
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
