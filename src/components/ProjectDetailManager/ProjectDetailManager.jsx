import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ProjectDetailManager = () => {
  const [project, setProject] = useState(null);
  const { projectId } = useParams();
  const navigate = useNavigate();

  console.log("Params:", projectId); // Log the projectId

  useEffect(() => {
    const fetchProjectDetail = async () => {
      try {
        // First, check if the user is the assigned manager for the project
        const managerCheckResponse = await axios.get(
          `http://localhost:5000/api/projects/isAssignedManager/${projectId}`,
          { withCredentials: true }
        );

        if (
          managerCheckResponse.status !== 200 ||
          !(
            managerCheckResponse.data.message === "User is the project manager."
          )
        ) {
          console.log(
            "User is not the assigned project manager:",
            managerCheckResponse.data.message
          );
          navigate("/homepage"); // Redirect to homepage if the user isn't the assigned manager
          return; // Exit the function early
        }

        // If user is the assigned manager, then fetch the project details
        const projectDetailResponse = await axios.get(
          `http://localhost:5000/api/projects/${projectId}`,
          { withCredentials: true }
        );

        console.log("Response received:", projectDetailResponse); // Log the full response

        if (projectDetailResponse.status === 200) {
          console.log("Setting project data:", projectDetailResponse.data); // Log the project data
          setProject(projectDetailResponse.data);
        } else {
          console.log(
            "Unexpected response status:",
            projectDetailResponse.status
          );
        }
      } catch (error) {
        console.error(
          "Error fetching project details or checking user role:",
          error
        );
        console.error("Error details:", error.response?.data || error.message); // Log detailed error message if available
        navigate("/login"); // Redirect to login (or any other appropriate page) in case of an error
      }
    };

    fetchProjectDetail();
  }, [projectId, navigate]); // Add projectId and navigate to the dependency array

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
