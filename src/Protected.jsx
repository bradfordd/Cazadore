import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Protected = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/protected");

        if (response.status === 200) {
          setIsLoading(false);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // If the server responded with a 401 status (Unauthorized),
          // redirect the user to the login page
          navigate("/login");
        }
      }
    };

    checkAuthentication();
  }, [navigate]); // The navigate dependency is required to avoid a warning

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Protected Page</h1>
      <p>You successfully accessed a protected route!</p>
    </div>
  );
};

export default Protected;
