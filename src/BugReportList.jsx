import React, { useEffect, useState } from "react";
import BugReportService from "./services/BugReportService";
import BugReportDetail from "./BugReportDetail";

function BugReportList() {
  const [bugReports, setBugReports] = useState([]);
  const [page, setPage] = useState(1); // Initial page
  const [perPage, setPerPage] = useState(10); // Items per page
  const [totalPages, setTotalPages] = useState(0); // Total pages
  const [searchTerm, setSearchTerm] = useState(""); // Search term
  const [status, setStatus] = useState(""); // Status filter
  const [priority, setPriority] = useState(""); // Priority filter
  const [assignee, setAssignee] = useState(""); // Assignee filter
  const [selectedBug, setSelectedBug] = useState(null);

  useEffect(() => {
    const fetchBugReports = async () => {
      const filters = {
        status: status,
        priority: priority,
        assignedTo: assignee,
      };

      const data = await BugReportService.getAllBugReports(
        page,
        perPage,
        searchTerm,
        filters
      );
      setBugReports(data.bugReports);
      setTotalPages(Math.ceil(data.total / perPage)); // Calculate total pages
    };

    fetchBugReports();
  }, [page, perPage, searchTerm, status, priority, assignee]); // Add filters to dependencies

  const nextPage = () => {
    setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset page number to 1 when search term changes
  };

  // New handlers for filter changes
  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setPage(1);
  };

  const handlePriorityChange = (e) => {
    setPriority(e.target.value);
    setPage(1);
  };

  const handleAssigneeChange = (e) => {
    setAssignee(e.target.value);
    setPage(1);
  };

  if (selectedBug) {
    return (
      <BugReportDetail bug={selectedBug} goBack={() => setSelectedBug(null)} />
    );
  }

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search by title..."
      />{" "}
      {/* Search input */}
      <select value={status} onChange={handleStatusChange}>
        <option value="">All statuses</option>
        <option value="Open">Open</option>
        <option value="In Progress">In Progress</option>
        <option value="Closed">Closed</option>
      </select>
      <select value={priority} onChange={handlePriorityChange}>
        <option value="">All priorities</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <input
        type="text"
        value={assignee}
        onChange={handleAssigneeChange}
        placeholder="Assigned to..."
      />
      <div>
        Page: {page} / {totalPages}
      </div>
      {selectedBug ? (
        <BugReportDetail
          bug={selectedBug}
          goBack={() => setSelectedBug(null)}
        />
      ) : (
        bugReports.map((report) => (
          <div key={report._id} onClick={() => setSelectedBug(report)}>
            <h2>{report.title}</h2>
            <p>{report.description}</p>
          </div>
        ))
      )}
      {!selectedBug && (
        <>
          <button onClick={prevPage}>Previous</button>
          <button onClick={nextPage}>Next</button>
        </>
      )}
    </div>
  );
}

export default BugReportList;
