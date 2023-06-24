import axios from "axios";

export default {
  getAllBugReports: async () => {
    const response = await axios.get(
      "http://localhost:5000/api/bugReports/all"
    );
    return response.data;
  },

  getBugReportById: async (id) => {
    const response = await axios.get(`/api/bugReports/${id}`);
    return response.data;
  },
};
