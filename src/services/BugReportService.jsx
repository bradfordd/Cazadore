import axios from "axios";

export default {
  getAllBugReports: async (page, limit, searchTerm = "") => {
    let url = `http://localhost:5000/api/bugReports/all?page=${page}&limit=${limit}`;

    if (searchTerm) {
      url += `&searchTerm=${searchTerm}`;
    }

    const response = await axios.get(url);
    return response.data;
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
