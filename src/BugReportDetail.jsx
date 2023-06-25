import React from "react";

function BugReportDetail({ bug, goBack }) {
  return (
    <div>
      <h1>{bug.title}</h1>
      <p>{bug.description}</p>
      <button onClick={goBack}>Back to List</button>
    </div>
  );
}

export default BugReportDetail;
