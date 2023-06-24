import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BugReportList from "./BugReportList"; // adjust the path as necessary

const Homepage = () => {
  const [isLoading, setIsLoading] = useState(true);
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

  return (
    <div>
      <h1>Welcome to the Homepage!</h1>
      <p>This is your homepage. You can add more content here.</p>
      <BugReportList /> {/* Include the BugReportList component here */}
    </div>
  );
};

export default Homepage;
