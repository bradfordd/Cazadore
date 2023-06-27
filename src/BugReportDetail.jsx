import React, { useState, useEffect } from "react";
import UserService from "./services/UserService";
import BugReportService from "./services/BugReportService";

function BugReportDetail({ bug, goBack }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [pendingUser, setPendingUser] = useState("");
  const [assignedUser, setAssignedUser] = useState(bug.assignedTo || "");

  // Fetch all users when component mounts
  useEffect(() => {
    async function fetchUsers() {
      const fetchedUsers = await UserService.getAllUsers();
      setUsers(fetchedUsers);
    }

    fetchUsers();
  }, []);

  const assignBug = async () => {
    if (pendingUser) {
      const updatedBug = await BugReportService.assignBugToUser(
        bug._id,
        pendingUser
      );
      console.log(updatedBug);
      if (updatedBug && updatedBug.assignedTo) {
        setAssignedUser(updatedBug.assignedTo);
      }
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
        {bug.createdBy && bug.createdBy.username
          ? bug.createdBy.username
          : "Not Assigned"}
      </p>
      <p>
        Assigned to:{" "}
        {assignedUser && assignedUser.username
          ? assignedUser.username
          : "Not Assigned"}
      </p>

      <label>
        Assign to:
        <select
          value={pendingUser}
          onChange={(event) => {
            setPendingUser(event.target.value);
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
      <button onClick={assignBug}>Assign</button>
      <button onClick={goBack}>Back to List</button>
    </div>
  );
}

export default BugReportDetail;
