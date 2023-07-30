// ProjectBugReportsList.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

const ProjectBugReportsList = () => {
  const { projectId } = useParams();
  const [bugReports, setBugReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [project, setProject] = useState(null);

  const Breadcrumbs = () => {
    return (
      <nav className="breadcrumbs">
        <Link to="/homepage">Homepage</Link>
        <Link to={`/projects/${projectId}`}>
          {project ? project.name : projectId}
        </Link>{" "}
        Bug Reports
      </nav>
    );
  };

  useEffect(() => {
    const fetchBugReports = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/bugReports/project/${projectId}`,
          { withCredentials: true }
        );

        if (response.status === 200) {
          setBugReports(response.data);
        } else {
          setError("Unexpected response status:", response.status);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    const fetchProjectDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/projects/${projectId}`,
          { withCredentials: true }
        );

        if (response.status === 200) {
          setProject(response.data);
        } else {
          setError("Unexpected response status:", response.status);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchBugReports();
    fetchProjectDetails();
  }, [projectId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Navbar />
      <Breadcrumbs />
      <h2>Bug Reports for {project ? project.name : "Project"}</h2>
      <ul>
        {bugReports.map((report) => (
          <li key={report._id}>
            <h3>
              {report.title} - Status: {report.status}
            </h3>
            <div
              onClick={() => handleBugSelect(report)}
              style={{ cursor: "pointer" }}
            >
              <p>Description: {report.description}</p>
              <p>Steps to Reproduce: {report.stepsToReproduce}</p>
              <p>Expected Result: {report.expectedResult}</p>
              <p>Actual Result: {report.actualResult}</p>
              <p>Priority: {report.priority}</p>
              <p>Created By: {report.createdBy.username}</p>
              <p>Created At: {new Date(report.createdAt).toLocaleString()}</p>
              <p>Updated At: {new Date(report.updatedAt).toLocaleString()}</p>
              <Link to={`/projects/${projectId}/bug-reports/${report._id}`}>
                Select Bug
              </Link>
              {/* Add more details if needed */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectBugReportsList;
