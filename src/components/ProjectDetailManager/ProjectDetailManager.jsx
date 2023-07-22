import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ProjectDetailManager = () => {
  const [project, setProject] = useState(null);
  const params = useParams();
  const { projectId: projectId } = useParams();

  // Log the entire params object
  console.log("Params:", params);

  useEffect(() => {
    const fetchProjectDetail = async () => {
      try {
        // Use template literals to embed the projectId in the URL
        const response = await axios.get(
          `http://localhost:5000/api/projects/${projectId}`,
          { withCredentials: true }
        );

        console.log("Response received:", response); // Log the full response

        if (response.status === 200) {
          console.log("Setting project data:", response.data); // Log the project data we're about to set
          setProject(response.data);
        } else {
          console.log("Unexpected response status:", response.status); // Log if status is other than 200
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
        console.error("Error details:", error.response?.data || error.message); // Log detailed error message if available
      }
    };

    fetchProjectDetail();
  }, [projectId]); // Add projectId to the dependency array to make sure useEffect only runs when projectId changes

  if (!project) return <div>Loading...</div>;

  return (
    <div>
      <h2>Project Details</h2>
      <h3>{project.name}</h3>
      <p>{project.description}</p>
      {/* You can add more details here as needed */}
      {/* e.g., project manager, team members, created date, etc. */}
    </div>
  );
};

export default ProjectDetailManager;
