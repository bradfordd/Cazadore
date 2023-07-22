import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ProjectDashboardDeveloper = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/projects/developer",
          {
            withCredentials: true, // to ensure the cookie/token is sent if needed
          }
        );
        setProjects(response.data);
        console.log("Response Data: ", response.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching projects. Please try again.");
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <div>Loading projects...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="developer-dashboard">
      <h2>Developer Dashboard</h2>
      {projects.length > 0 ? (
        <div className="projects-list">
          {projects.map((project) => (
            <div key={project._id} className="project-card">
              <h3>
                <Link to={`/project/developer/${project._id}`}>
                  {project.name}
                </Link>
              </h3>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <p>Managed by: {project.projectManager.username}</p>
              <h4>Team Members:</h4>
              <ul>
                {project.teamMembers.map((member) => (
                  <li key={member._id}>{member.username}</li>
                ))}
              </ul>
              <p>
                Created on: {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>You're not currently a part of any projects.</p>
      )}
    </div>
  );
};

export default ProjectDashboardDeveloper;
