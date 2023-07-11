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
  retireBugReport: async (bugReportId) => {
    const response = await axios.put(
      `http://localhost:5000/api/bugReports/${bugReportId}/retire`,
      {}, // Empty payload
      { withCredentials: true } // Config
    );
    return response.data;
  },
  closeBugReport: async (bugReportId) => {
    const response = await axios.put(
      `http://localhost:5000/api/bugReports/${bugReportId}/close`,
      {}, // Empty payload
      { withCredentials: true } // Config
    );
    return response.data;
  },
  reactivateBugReport: async (bugReportId) => {
    const response = await axios.put(
      `http://localhost:5000/api/bugReports/${bugReportId}/reactivate`
    );
    return response.data;
  },

  addCommentToBugReport: async (bugReportId, commentText) => {
    const response = await axios.patch(
      `http://localhost:5000/api/bugReports/${bugReportId}/addComment`,
      { commentText },
      { withCredentials: true }
    );
    return response.data;
  },
  deleteCommentFromBugReport: async (bugReportId, commentId) => {
    const response = await axios.delete(
      `http://localhost:5000/api/bugReports/${bugReportId}/comments/${commentId}`,
      { withCredentials: true }
    );
    return response.data;
  },
};
