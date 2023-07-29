// withRoleBasedRendering.js (Your HOC)

import React from "react";
import { getCurrentUserRole } from "./authService";

export default function withRoleBasedRendering(
  ManagerComponent,
  DeveloperComponent,
  DefaultComponent
) {
  return function WrappedComponent(props) {
    const userRole = getCurrentUserRole();

    switch (userRole) {
      case "manager":
        return <ManagerComponent {...props} />;
      case "developer":
        return <DeveloperComponent {...props} />;
      default:
        return <DefaultComponent {...props} />;
    }
  };
}
