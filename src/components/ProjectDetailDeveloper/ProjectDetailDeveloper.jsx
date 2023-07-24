import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ProjectDetailDeveloper = () => {
  const [project, setProject] = useState(null);
  const params = useParams();
  const { projectId: projectId } = useParams();
  const navigate = useNavigate(); // useNavigate hook for redirection

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/Users/isUserDeveloper",
          { withCredentials: true }
        );

        if (response.status !== 200 || !response.data.isDeveloper) {
          // Redirect if not a developer or if any unexpected response is received
          navigate("/homepage");
        }
      } catch (error) {
        console.error("Error checking user role:", error);
        navigate("/login"); // Redirect to login in case of an error (optional, based on your use case)
      }
    };

    checkUserRole(); // Invoke the checkUserRole function inside useEffect
  }, [navigate]);

  if (!project) return <div>Loading...</div>;

  return (
    <div>
      <h2>Project Details</h2>
      <h3>{project.name}</h3>
      <p>{project.description}</p>
      {/* You can add more details here as needed */}
      {/* e.g., project manager, team members, created date, etc. */}
    </div>
  );
};

export default ProjectDetailDeveloper;
