// withRoleBasedRendering.jsx (Your HOC)

import React from "react";
import { getCurrentUserRole } from "../services/AuthService";

export default function withRoleBasedRendering(
  ManagerComponent,
  DeveloperComponent
) {
  return function WrappedComponent(props) {
    const userRole = getCurrentUserRole();

    switch (userRole) {
      case "project manager":
        return <ManagerComponent />;
      case "developer":
        return <DeveloperComponent />;
    }

    // If no roles match, simply return null or a placeholder component
    return null;
  };
}
