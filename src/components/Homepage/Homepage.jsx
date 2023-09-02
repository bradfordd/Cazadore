import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProjectDashboardManager from "../ProjectDashboardManager/ProjectDashboardManager";
import ProjectDashboardDeveloper from "../ProjectDashboardDeveloper/ProjectDashboardDeveloper";
import Navbar from "../Navbar/Navbar";
import withRoleBasedRendering from "../../hocs/withRoleBasedRendering";
import "./Homepage.css";

const Homepage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState(null); // initialized as null
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/protected",
          {
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          setIsLoading(false);

          // Retrieve the user's role from session storage and set it in state
          const role = sessionStorage.getItem("userRole");
          setUserRole(role);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          navigate("/login");
        }
      }
    };

    checkAuthentication();
  }, [navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const DashboardBasedOnRole = withRoleBasedRendering(
    ProjectDashboardManager,
    ProjectDashboardDeveloper
  );

  return (
    <div className="Homepage">
      <Navbar />
      <DashboardBasedOnRole />
    </div>
  );
};

export default Homepage;
