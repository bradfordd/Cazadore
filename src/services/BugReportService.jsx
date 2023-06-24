import axios from "axios";

export default {
  getAllBugReports: async (page, perPage) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/bugReports/all?page=${page}&limit=${perPage}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching data: ", error);
      return [];
    }
  },

  getAllBugReportsNoPagination: async () => {
    const response = await axios.get(
      "http://localhost:5000/api/bugReports/all"
    );
    return response.data;
  },

  getBugReportById: async (id) => {
    const response = await axios.get(
      `http://localhost:5000/api/bugReports/${id}`
    );
    return response.data;
  },
};
