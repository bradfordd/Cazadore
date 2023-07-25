import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import BugReportForm from "../BugReportForm/BugReportForm";

const ProjectDetailManager = () => {
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [unassignedDevelopers, setUnassignedDevelopers] = useState([]);
  const [selectedDeveloper, setSelectedDeveloper] = useState("");
  const { projectId } = useParams();

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

    // Fetch the unassigned developers for the dropdown
    const fetchUnassignedDevelopers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/projects/${projectId}/unassigned-developers`,
          { withCredentials: true }
        );
        if (response.status === 200) {
          setUnassignedDevelopers(response.data);
        } else {
          console.log("Unexpected response status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching unassigned developers:", error);
      }
    };

    fetchUnassignedDevelopers();
  }, [projectId, navigate]); // Add projectId and navigate to the dependency array

  const handleAddDeveloperToProject = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/projects/${projectId}/addMember`,
        { newMember: selectedDeveloper },
        { withCredentials: true }
      );
      if (response.status === 200) {
        console.log("Developer added successfully:", response.data);
        // After adding, fetch the updated list of unassigned developers.
        fetchUnassignedDevelopers();
        setSelectedDeveloper(""); // Reset selected developer
      } else {
        console.error("Error adding developer:", response.data.message);
      }
    } catch (error) {
      console.error("Error adding developer:", error);
    }
  };

  if (!project) return <div>Loading...</div>;

  return (
    <div>
      <h2>Project Details</h2>
      <h3>{project.name}</h3>
      <p>{project.description}</p>
      <div>
        <select
          value={selectedDeveloper}
          onChange={(e) => setSelectedDeveloper(e.target.value)}
        >
          <option value="">Select a developer...</option>
          {unassignedDevelopers.map((developer) => (
            <option key={developer._id} value={developer._id}>
              {developer.username}
            </option>
          ))}
        </select>
        <button onClick={handleAddDeveloperToProject}>Add</button>
      </div>
      <h2>Submit a Bug Report</h2>
      <button onClick={() => navigate(`/projects/${projectId}/bug-reports`)}>
        See all bug reports for this project
      </button>
      <BugReportForm />
    </div>
  );
};

export default ProjectDetailManager;
