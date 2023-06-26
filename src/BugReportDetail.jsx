import React from "react";

function BugReportDetail({ bug, goBack }) {
  return (
    <div>
      <h1>{bug.title}</h1>
      <p>{bug.description}</p>
      <p>Steps to Reproduce: {bug.stepsToReproduce}</p>
      <p>Expected Result: {bug.expectedResult}</p>
      <p>Actual Result: {bug.actualResult}</p>
      <p>Priority: {bug.priority}</p>
      <p>Status: {bug.status}</p>
      <p>
        Created by: {bug.createdBy.name} (Display name depending on your User
        model structure)
      </p>
      <p>
        Assigned to: {bug.assignedTo ? bug.assignedTo.name : "Not Assigned"}
      </p>
      <button onClick={goBack}>Back to List</button>
    </div>
  );
}

export default BugReportDetail;
