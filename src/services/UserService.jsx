// services/UserService.js

import axios from "axios";

export default {
  getAllUsers: async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users");
      return response.data;
    } catch (error) {
      console.error(`Error occurred while fetching all users: ${error}`);
    }
  },
  getCurrentUser: async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/users/currentUser",
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error(`Error occurred while fetching current user: ${error}`);
    }
  },
};
