import React, { useState, useEffect } from "react";
import UserService from "../../services/UserService";
import BugReportService from "../../services/BugReportService";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import jwt_decode from "jwt-decode";
import { Link, useParams } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Breadcrumb from "../Breadcrumb/Breadcrumb";

function BugReportDetail() {
  const { projectId, bugReportId } = useParams();
  const [pendingUser, setPendingUser] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [bug, setBug] = useState(null);
  const [assignedUser, setAssignedUser] = useState("");
  const [users, setUsers] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [isManager, setIsManager] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const Breadcrumbs = () => {
    return (
      <nav className="breadcrumbs">
        <Link to="/homepage">Homepage</Link>
        <Link to={`/projects/${projectId}`}>{projectName || projectId}</Link>
        <Link to={`/projects/${projectId}/bug-reports`}>Bug Reports</Link>
        Bug Detail
      </nav>
    );
  };

  useEffect(() => {
    const allCookies = document.cookie;

    const fetchCurrentUser = async () => {
      const user = await UserService.getCurrentUser();
      console.log("Assigning current user");
      setCurrentUser(user);
    };

    fetchCurrentUser();

    const tokenCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));

    if (tokenCookie) {
      const token = tokenCookie.split("=")[1];
      console.log("Token: ", token);
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.id;
      console.log("Decoded token ID: ", userId);
    } else {
      console.log("Token cookie not found");
    }

    const fetchBug = async () => {
      console.log("fetchBug triggered");
      const bugReport = await BugReportService.getBugReportById(bugReportId);
      console.log("Fetched bug report: ", bugReport);
      setBug(bugReport);
      setComments(bugReport.comments);
      if (bugReport && bugReport.assignedTo) {
        setAssignedUser(bugReport.assignedTo);
      } else {
        console.log("bugReport.assignedTo is undefined or null");
      }
    };

    fetchBug();
    const fetchParticipants = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/projects/${projectId}/participants`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching participants:", error);
      }
    };

    fetchParticipants();

    const fetchProjectName = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/projects/${projectId}`,
          { credentials: "include" }
        );
        const data = await response.json();
        setProjectName(data.name); // Assuming the project object has a "name" field
      } catch (error) {
        console.error("Error fetching project name:", error);
      }
    };

    fetchProjectName();

    const checkIfManager = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/projects/isAssignedManager/${projectId}`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        if (data.message === "User is the project manager.") {
          setIsManager(true);
        }
      } catch (error) {
        console.error("Error checking if user is assigned manager:", error);
      }
    };

    checkIfManager();
  }, [bugReportId, projectId]);

  const assignBug = async () => {
    if (pendingUser) {
      const updatedBug = await BugReportService.assignBugToUser(
        bug._id,
        pendingUser
      );
      console.log("updated Bug: ", updatedBug.assignedTo);
      if (updatedBug && updatedBug.assignedTo) {
        setAssignedUser(updatedBug.assignedTo);
      }
    }
  };

  const addComment = async () => {
    const updatedBug = await BugReportService.addCommentToBugReport(
      bug._id,
      newCommentText
    );
    if (updatedBug && updatedBug.comments) {
      setComments(updatedBug.comments);
      setNewCommentText(""); // Clear the new comment text
    }
  };

  const retireBug = async () => {
    await BugReportService.retireBugReport(bug._id);
    handleClose();
  };

  const deleteComment = async (commentId) => {
    const updatedBug = await BugReportService.deleteCommentFromBugReport(
      bug._id,
      commentId
    );
    if (updatedBug && updatedBug.comments) {
      setComments(updatedBug.comments);
    }
  };

  return (
    <div>
      <Navbar />
      <Breadcrumbs />
      {bug ? (
        <>
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
          {/* For the Assign Option */}
          {isManager && (
            <>
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
            </>
          )}

          {/* For the Retire Bug Report Option */}
          {(currentUser && currentUser._id === bug.createdBy._id) ||
          isManager ? (
            <button onClick={handleShow}>Retire Bug Report</button>
          ) : null}
        </>
      ) : (
        <h1>Loading...</h1>
      )}
      <button>Back to List</button>
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
      <form
        onSubmit={(event) => {
          event.preventDefault();
          addComment();
        }}
      ></form>
    </div>
  );
}

export default BugReportDetail;
