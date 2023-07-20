import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import Login from "../Login/Login";
import Register from "../Register/Register";
import Homepage from "../Homepage/Homepage";
import ProjectDetail from "../ProjectDetail/ProjectDetail";
import "./App.css";
import axios from "axios";

// Create a Redirect component that navigates to the login page
const RedirectToLogin = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/login");
  }, [navigate]);

  return null; // This component doesn't render anything
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RedirectToLogin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/project/:projectId" element={<ProjectDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
