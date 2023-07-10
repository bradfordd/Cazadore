import React, { useState, useEffect } from "react";
import UserService from "../../services/UserService";
import BugReportService from "../../services/BugReportService";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import jwt_decode from "jwt-decode";

function BugReportDetail({ bug, goBack }) {
  const [users] = useState([]);
  const [pendingUser, setPendingUser] = useState("");
  const [assignedUser, setAssignedUser] = useState(bug.assignedTo || "");
  const [showModal, setShowModal] = useState(false);
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  // Fetch all users when component mounts

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
      const bugReport = await BugReportService.getBugReportById(bug._id);
      console.log("Fetched bug report: ", bugReport);
      setComments(bugReport.comments);
    };

    fetchBug();
  }, [bug._id]);

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
    goBack();
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
      {console.log("Bug: ", bug)}
      {console.log("CurrentUser: ", currentUser)}
      {bug && currentUser && currentUser._id === bug.createdBy._id && (
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
      )<button onClick={goBack}>Back to List</button>
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
      {comments.length > 0 && (
        <div>
          <h2>Comments</h2>
          {comments.map((comment, index) => (
            <div key={index}>
              <p>{comment.content}</p>
              <p>Posted by: {comment.postedBy.username}</p>
              // Show the delete button only if the current user's ID matches
              the comment's user ID
              {currentUser._id === comment.postedBy._id && (
                <button onClick={() => deleteComment(comment._id)}>
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          addComment();
        }}
      >
        <textarea
          value={newCommentText}
          onChange={(event) => setNewCommentText(event.target.value)}
          placeholder="Add a comment"
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default BugReportDetail;
