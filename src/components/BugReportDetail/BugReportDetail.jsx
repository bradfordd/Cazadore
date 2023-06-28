import React, { useState, useEffect } from "react";
import UserService from "../../services/UserService";
import BugReportService from "../../services/BugReportService";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function BugReportDetail({ bug, goBack }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [pendingUser, setPendingUser] = useState("");
  const [assignedUser, setAssignedUser] = useState(bug.assignedTo || "");
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

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

  const retireBug = async () => {
    await BugReportService.retireBugReport(bug._id);
    handleClose();
    goBack();
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
      <button onClick={handleShow}>Retire Bug Report</button>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Retire Bug Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to retire this bug report?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            No
          </Button>
          <Button variant="primary" onClick={retireBug}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default BugReportDetail;
