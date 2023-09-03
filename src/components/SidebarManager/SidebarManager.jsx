import React from "react";
import { Link } from "react-router-dom";
import "./SidebarManager.css"; // Assuming you have a CSS file named Sidebar.css in the same folder

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Sidebar</h2>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/projects">Projects</Link>
        </li>
        <li>
          <Link to="/settings">Settings</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
