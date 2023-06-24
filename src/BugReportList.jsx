import React, { useEffect, useState } from "react";
import BugReportService from "./services/BugReportService";

function BugReportList() {
  const [bugReports, setBugReports] = useState([]);
  const [page, setPage] = useState(1); // Initial page
  const [perPage, setPerPage] = useState(10); // Items per page
  const [totalPages, setTotalPages] = useState(0); // Total pages

  useEffect(() => {
    const fetchBugReports = async () => {
      const data = await BugReportService.getAllBugReports(page, perPage);
      setBugReports(data.bugReports);
      setTotalPages(Math.ceil(data.total / perPage)); // Calculate total pages
    };

    fetchBugReports();
  }, [page, perPage]);

  const nextPage = () => {
    setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div>
      <div>
        Page: {page} / {totalPages}
      </div>{" "}
      {/* Display current page and total pages */}
      {bugReports.map((report) => (
        <div key={report._id}>
          <h2>{report.title}</h2>
          <p>{report.description}</p>
        </div>
      ))}
      <button onClick={prevPage}>Previous</button>
      <button onClick={nextPage}>Next</button>
    </div>
  );
}

export default BugReportList;
