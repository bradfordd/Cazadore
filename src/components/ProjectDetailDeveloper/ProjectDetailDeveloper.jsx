import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ProjectDetailDeveloper = () => {
  const [project, setProject] = useState(null);
  const params = useParams();
  const { projectId: projectId } = useParams();
  const navigate = useNavigate(); // useNavigate hook for redirection

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const checkUserRoleResponse = await axios.get(
          `http://localhost:5000/api/projects/isDeveloperTeamMember/${projectId}`,
          { withCredentials: true }
        );
        console.log("CheckUserRoleResponse: ", checkUserRoleResponse.data);
        // Check if the user is part of the project team
        if (
          checkUserRoleResponse.status !== 200 ||
          !(checkUserRoleResponse.data.message === "User is a team member.")
        ) {
          navigate("/homepage");
          return; // Early exit from the function if the user isn't a developer team member
        }

        // If user is a developer team member, fetch the project details
        const projectResponse = await axios.get(
          `http://localhost:5000/api/projects/${projectId}`,
          { withCredentials: true }
        );

        if (projectResponse.status === 200) {
          setProject(projectResponse.data);
        } else {
          console.error("Unexpected response when fetching project details");
          navigate("/homepage");
        }
      } catch (error) {
        console.error(
          "Error fetching project details or checking user role:",
          error
        );
        navigate("/login");
      }
    };

    fetchProjectDetails();
  }, [projectId, navigate]);

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

export default ProjectDetailDeveloper;
