import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProjectSelectionManager from "../ProjectSelectionManager/ProjectSelectionManager";
import ProjectDashboardDeveloper from "../ProjectDashboardDeveloper/ProjectDashboardDeveloper";
import DeveloperHomepage from "../DeveloperHomepage/DeveloperHomepage";
import ProjectManagerHomepage from "../ProjectManagerHomepage/ProjectManagerHomepage";
import Navbar from "../Navbar/Navbar";
import withRoleBasedRendering from "../../hocs/withRoleBasedRendering";
import "./Homepage.css";

const Homepage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState(null); // initialized as null
  const navigate = useNavigate();

  console.log("Homepage component rendering");

  useEffect(() => {
    console.log("useEffect triggered for Homepage");

    const checkAuthentication = async () => {
      console.log("Inside checkAuthentication()");
      try {
        const response = await axios.get(
          "http://localhost:5000/api/protected",
          {
            withCredentials: true,
          }
        );

        console.log("checkAuthentication response:", response);

        if (response.status === 200) {
          console.log("Authentication successful");
          setIsLoading(false);

          // Retrieve the user's role from session storage and set it in state
          const role = sessionStorage.getItem("userRole");
          console.log("Retrieved user role from session storage:", role);
          setUserRole(role);
        }
      } catch (error) {
        console.log("Error inside checkAuthentication:", error);
        if (error.response && error.response.status === 401) {
          console.log("Navigating to /login due to unauthorized access");
          navigate("/login");
        }
      }
    };

    checkAuthentication();
  }, [navigate]);

  if (isLoading) {
    console.log("isLoading is true, showing Loading...");
    return <div>Loading...</div>;
  }

  console.log("isLoading is false, showing homepage based on role");

  const HomepageBasedOnRole = withRoleBasedRendering(
    ProjectManagerHomepage,
    DeveloperHomepage
  );

  return (
    <div className="Homepage">
      <Navbar />
      <HomepageBasedOnRole />
    </div>
  );
};

export default Homepage;
