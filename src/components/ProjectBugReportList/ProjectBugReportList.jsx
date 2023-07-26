// ProjectBugReportsList.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ProjectBugReportsList = () => {
  const { projectId } = useParams();
  const [bugReports, setBugReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

    fetchBugReports();
  }, [projectId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Bug Reports for Project ID: {projectId}</h2>
      <ul>
        {bugReports.map((report) => (
          <li key={report._id}>
            <h3>
              {report.title} - Status: {report.status}
            </h3>
            <div>
              <p>Description: {report.description}</p>
              <p>Steps to Reproduce: {report.stepsToReproduce}</p>
              <p>Expected Result: {report.expectedResult}</p>
              <p>Actual Result: {report.actualResult}</p>
              <p>Priority: {report.priority}</p>
              <p>Created By: {report.createdBy.username}</p>
              <p>Created At: {new Date(report.createdAt).toLocaleString()}</p>
              <p>Updated At: {new Date(report.updatedAt).toLocaleString()}</p>
              {/* Add more details if needed */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectBugReportsList;
