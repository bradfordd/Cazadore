import React, { useEffect, useState } from "react";
import axios from "axios";

const ManagedProjects = () => {
  const [projects, setProjects] = useState([]);

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

  return (
    <div>
      <h2>Managed Projects</h2>
      {projects.length > 0 ? (
        <ul>
          {projects.map((project) => (
            <li key={project._id}>
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
