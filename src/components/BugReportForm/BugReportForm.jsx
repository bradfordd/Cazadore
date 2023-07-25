import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const BugReportForm = () => {
  const { projectId } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    stepsToReproduce: "",
    expectedResult: "",
    actualResult: "",
    priority: "Medium",
    project: projectId,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/bugReports/create",
        formData,
        { withCredentials: true }
      );
      if (response.status === 201) {
        console.log("Bug report created:", response.data);
        // You can also add further logic here, e.g., redirect or show a success message.
      } else {
        console.error("Unexpected response:", response);
      }
    } catch (error) {
      console.error("Error submitting bug report:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Title:
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
      </label>

      <label>
        Description:
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
        />
      </label>

      <label>
        Steps to Reproduce:
        <textarea
          name="stepsToReproduce"
          value={formData.stepsToReproduce}
          onChange={handleInputChange}
          required
        />
      </label>

      <label>
        Expected Result:
        <textarea
          name="expectedResult"
          value={formData.expectedResult}
          onChange={handleInputChange}
          required
        />
      </label>

      <label>
        Actual Result:
        <textarea
          name="actualResult"
          value={formData.actualResult}
          onChange={handleInputChange}
          required
        />
      </label>

      <label>
        Priority:
        <select
          name="priority"
          value={formData.priority}
          onChange={handleInputChange}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </label>

      <button type="submit">Submit Bug Report</button>
    </form>
  );
};

export default BugReportForm;
