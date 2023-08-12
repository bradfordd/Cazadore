import { useState } from "react";
import logo from "../../assets/logo.png";
import styles from "./Navbar.module.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <nav className={styles.navbar}>
      {" "}
      {/* Apply styles using styles object */}
      {isLoggedIn && (
        <ul className={styles.menu}>
          <Link to="/homepage" className={styles.menuItem}>
            <img src={logo} alt="Company Logo" className={styles.logo} />
          </Link>
          <li className={styles.menuItem}>
            <a href="/logout" onClick={() => setIsLoggedIn(false)}>
              Logout
            </a>
          </li>
          {/* other menu options */}
        </ul>
      )}
      {!isLoggedIn && (
        <ul className={styles.menu}>
          <Link to="/homepage" className={styles.menuItem}>
            <img src={logo} alt="Company Logo" className={styles.logo} />
          </Link>
          <li className={styles.menuItem}>
            <a href="/login">Login</a>
          </li>
          <li className={styles.menuItem}>
            <a href="/register">Register</a>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
