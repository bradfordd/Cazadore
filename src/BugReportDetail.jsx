import React, { useState, useEffect } from "react";
import UserService from "./services/UserService";
import BugReportService from "./services/BugReportService";

function BugReportDetail({ bug, goBack }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  // Fetch all users when component mounts
  useEffect(() => {
    async function fetchUsers() {
      const fetchedUsers = await UserService.getAllUsers();
      setUsers(fetchedUsers);
    }

    fetchUsers();
  }, []);

  const assignBug = async () => {
    if (selectedUser) {
      const updatedBug = await BugReportService.assignBugToUser(
        bug._id,
        selectedUser
      );
      bug.assignedTo = updatedBug.assignedTo;
    }
  };

  return (
    <div>
      <h1>{bug.title}</h1>
      <p>Steps to Reproduce: {bug.stepsToReproduce}</p>
      <p>Expected Result: {bug.expectedResult}</p>
      <p>Actual Result: {bug.actualResult}</p>
      <p>Priority: {bug.priority}</p>
      <p>Status: {bug.status}</p>
      <p>{bug.description}</p>
      <p>
        Created by:{" "}
        {bug.createdBy.username ? bug.createdBy.username : "Unknown"}
      </p>
      <p>
        Assigned to:{" "}
        {bug.assignedTo && bug.assignedTo.username
          ? bug.assignedTo.username
          : "Not Assigned"}
      </p>

      <label>
        Assign to:
        <select
          value={selectedUser}
          onChange={(event) => {
            console.log("change detected");
            setSelectedUser(event.target.value);
            assignBug();
          }}
        >
          <option value="">Select a user</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.username}
            </option>
          ))}
        </select>
      </label>

      <button onClick={goBack}>Back to List</button>
    </div>
  );
}

export default BugReportDetail;
