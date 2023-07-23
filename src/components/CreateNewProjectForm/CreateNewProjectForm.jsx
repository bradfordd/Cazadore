import React, { useState, useEffect } from "react";
import axios from "axios";

function CreateProjectForm() {
  const [projectData, setProjectData] = useState({
    name: "",
    description: "",
    projectManager: "",
    teamMembers: [],
  });

  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Assuming you have an endpoint to fetch all users
    axios
      .get("http://localhost:5000/api/users", { withCredentials: true })
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProjectData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    if (name === "teamMembers") {
      const selectedIndex = event.target.options.selectedIndex;
      const selectedOptions = [...event.target.options]
        .filter((option) => option.selected)
        .map((option) => option.value);
      setProjectData((prevData) => ({
        ...prevData,
        teamMembers: selectedOptions,
      }));
    } else {
      setProjectData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/projects",
        projectData,
        { withCredentials: true }
      );
      console.log("Project created:", response.data);
      // Handle success, maybe reset the form or navigate to a different page
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={projectData.name}
        onChange={handleInputChange}
        placeholder="Project Name"
        required
      />
      <textarea
        name="description"
        value={projectData.description}
        onChange={handleInputChange}
        placeholder="Description"
        required
      />

      {/* Assuming each user has an 'id' and 'name' attribute */}
      <select
        name="projectManager"
        value={projectData.projectManager}
        onChange={handleSelectChange}
        required
      >
        <option value="">Select Project Manager</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>

      <select
        name="teamMembers"
        value={projectData.teamMembers}
        onChange={handleSelectChange}
        multiple
        required
      >
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>

      <button type="submit">Create Project</button>
    </form>
  );
}

export default CreateProjectForm;
