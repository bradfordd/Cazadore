import React, { useEffect, useState } from "react";
import BugReportService from "./services/BugReportService"; // Adjust the import path based on your directory structure

function BugReportList() {
  const [bugReports, setBugReports] = useState([]);

  useEffect(() => {
    const fetchBugReports = async () => {
      const data = await BugReportService.getAllBugReports();
      setBugReports(data);
    };

    fetchBugReports();
  }, []);

  return (
    <div>
      {bugReports.map((report) => (
        <div key={report._id}>
          <h2>{report.title}</h2>
          <p>{report.description}</p>
        </div>
      ))}
    </div>
  );
}

export default BugReportList;
