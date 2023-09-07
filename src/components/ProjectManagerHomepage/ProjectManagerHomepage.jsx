import React, { useEffect, useState } from "react";
import axios from "axios";
import ProjectSelectionManager from "../ProjectSelectionManager/ProjectSelectionManager";
import BugReportPriorityChart from "../BugReportPriorityChart/BugReportPriorityChart";
import { useNavigate } from "react-router-dom";

const ProjectManagerHomepage = () => {
  const [lastUpdatedProject, setLastUpdatedProject] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("useEffect triggered");

    const fetchLastUpdatedProject = async () => {
      console.log("Inside fetchLastUpdatedProject()");
      try {
        const response = await axios.get(
          "http://localhost:5000/api/Users/lastUpdatedProject",
          { withCredentials: true }
        );

        console.log("fetchLastUpdatedProject response:", response);

        if (response.status === 200) {
          console.log("Setting lastUpdatedProject");
          setLastUpdatedProject(response.data.lastUpdatedProject);
          setIsLoading(false);
          if (response.data.lastUpdatedProject !== null) {
            console.log("Calling fetchProjectDataById()");
            await fetchProjectDataById(response.data.lastUpdatedProject);
          }
        }
      } catch (error) {
        handleError(error);
      }
    };

    const fetchProjectDataById = async (projectId) => {
      console.log("Inside fetchProjectDataById()");
      try {
        const response = await axios.get(
          `http://localhost:5000/api/projects/${projectId}`,
          { withCredentials: true }
        );

        console.log("fetchProjectDataById response:", response);

        if (response.status === 200) {
          console.log("Setting projectData");
          setProjectData(response.data);
        } else {
          console.log("Resetting lastUpdatedProject to null");
          setLastUpdatedProject(null);
        }
      } catch (error) {
        handleError(error);
      }
    };

    const handleError = (error) => {
      console.log("Inside handleError()");
      if (error.response && error.response.status === 401) {
        console.log("Unauthorized access");
        setError("You are not authorized to view this data.");
      } else {
        console.log("Error message:", error.message);
        setError(error.message);
      }
      setIsLoading(false);
    };

    fetchLastUpdatedProject();
  }, []);

  console.log("Rendering Component");

  if (isLoading) {
    console.log("isLoading is true");
    return <div>Loading...</div>;
  }
  if (error) {
    console.log("Error occurred:", error);
    return <div>Error: {error}</div>;
  }

  console.log("Returning main component body");
  return lastUpdatedProject === null ? (
    <ProjectSelectionManager />
  ) : (
    <BugReportPriorityChart />
  );
};

export default ProjectManagerHomepage;
