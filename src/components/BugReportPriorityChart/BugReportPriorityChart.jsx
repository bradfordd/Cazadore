import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

const BugReportChart = () => {
  // Simulated data. You'd normally fetch this from your API.
  const bugReports = [
    { priority: "Low", count: 10 },
    { priority: "Medium", count: 20 },
    { priority: "High", count: 5 },
  ];

  return (
    <BarChart
      width={500}
      height={300}
      data={bugReports}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="priority" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="count" fill="#8884d8" />
    </BarChart>
  );
};

export default BugReportChart;
