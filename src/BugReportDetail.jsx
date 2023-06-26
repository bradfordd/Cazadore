import React, { useState, useEffect } from "react";
import UserService from "./services/UserService";

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

      <label>
        Assign to:
        <select
          value={selectedUser}
          onChange={(event) => setSelectedUser(event.target.value)}
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
