import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./ProjectSelectionManager.css";
import { useNavigate } from "react-router-dom";

const ManagedProjects = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchManagedProjects = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/projects/managed",
          { withCredentials: true } // Include this option
        );
        if (response.status === 200) {
          setProjects(response.data);
        }
      } catch (error) {
        console.error("Error fetching managed projects:", error);
      }
    };
    fetchManagedProjects();
  }, []);
  const handleProjectClick = async (projectId) => {
    try {
      // Make an API call to update the lastUpdatedProject field
      const response = await axios.put(
        "http://localhost:5000/api/Users/updateLastUpdatedProject",
        { lastUpdatedProject: projectId },
        { withCredentials: true }
      );
      if (response.status === 200) {
        // Navigate to the homepage after successfully updating
        navigate("/homepage");
      }
    } catch (error) {
      console.error("Error updating lastUpdatedProject:", error);
    }
  };
  return (
    <div className="projectSelectionManager">
      <h2>Select a Project to Manage:</h2>
      {projects.length > 0 ? (
        <ul>
          {projects.map((project) => (
            <li
              key={project._id}
              onClick={() => handleProjectClick(project._id)}
            >
              <h3>{project.name}</h3>
              <p>{project.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No managed projects found.</p>
      )}
    </div>
  );
};

export default ManagedProjects;
