import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import BugReportForm from "../BugReportForm/BugReportForm";

const ProjectDetailDeveloper = () => {
  const [project, setProject] = useState(null);
  const params = useParams();
  const { projectId: projectId } = useParams();
  const navigate = useNavigate(); // useNavigate hook for redirection
  const breadcrumbs = [
    {
      label: "Homepage",
      path: "/homepage",
    },
    {
      label: project ? project.name : "Loading...", // Handle potential null value for project
      path: null,
    },
  ];

  useEffect(() => {
    const fetchProjectDetail = async () => {
      try {
        // First, check if the user is the assigned manager for the project
        const managerCheckResponse = await axios.get(
          `http://localhost:5000/api/projects/isDeveloperTeamMember/${projectId}`,
          { withCredentials: true }
        );

        if (
          managerCheckResponse.status !== 200 ||
          !(managerCheckResponse.data.message === "User is a team member.")
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
      <Navbar />
      <Breadcrumb crumbs={breadcrumbs} />
      <h2>Project Details</h2>
      <h3>{project.name}</h3>
      <p>{project.description}</p>
      <h2>Submit a Bug Report</h2>
      <button onClick={() => navigate(`/projects/${projectId}/bug-reports`)}>
        See all bug reports for this project
      </button>
      <BugReportForm />
    </div>
  );
};

export default ProjectDetailDeveloper;
