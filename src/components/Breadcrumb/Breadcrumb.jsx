// Breadcrumb.js
import React from "react";
import { Link } from "react-router-dom";

const Breadcrumb = ({ crumbs }) => {
  return (
    <div className="breadcrumb">
      {crumbs.map((crumb, idx) => {
        // If it's the last crumb, don't make it a link
        if (idx === crumbs.length - 1) {
          return <span key={idx}>{crumb.label}</span>;
        }
        return (
          <span key={idx}>
            <Link to={crumb.path}>{crumb.label}</Link>
            {" > "}
          </span>
        );
      })}
    </div>
  );
};

export default Breadcrumb;
