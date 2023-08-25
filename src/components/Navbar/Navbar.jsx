import { useState } from "react";
import logo from "../../assets/logo.png";
import "./Navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <nav className="Navbar">
      {" "}
      {/* Apply using object */}
      {isLoggedIn && (
        <ul className="menu">
          <Link to="/homepage" class="logoItem">
            <img src={logo} alt="Company Logo" className="logo" />
          </Link>
          <li className="menuItem">
            <a href="/logout" onClick={() => setIsLoggedIn(false)}>
              Logout
            </a>
          </li>
          {/* other menu options */}
        </ul>
      )}
      {!isLoggedIn && (
        <ul className="menu">
          <Link to="/homepage" className="menuItem">
            <img src={logo} alt="Company Logo" className="logo" />
          </Link>
          <li className="menuItem">
            <a href="/login">Login</a>
          </li>
          <li className="menuItem">
            <a href="/register">Register</a>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
