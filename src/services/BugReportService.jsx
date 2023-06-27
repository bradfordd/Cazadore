import axios from "axios";

export default {
  getAllBugReports: async (page, limit, searchTerm = "", filters = {}) => {
    let url = `http://localhost:5000/api/bugReports/all?page=${page}&limit=${limit}`;

    if (searchTerm) {
      url += `&searchTerm=${encodeURIComponent(searchTerm)}`;
    }

    // Add filter parameters to URL
    for (const key in filters) {
      if (filters[key]) {
        url += `&${key}=${encodeURIComponent(filters[key])}`;
      }
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
  assignBugToUser: async (bugReportId, userId) => {
    const response = await axios.patch(
      `http://localhost:5000/api/bugReports/${bugReportId}/assign`,
      { userId: userId }
    );
    return response.data;
  },
};
