import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getUserFromToken } from '../../utils/auth';


const AuthRoute = ({allowedRoles }) => {
const user = getUserFromToken();

  if (!user) {
    // User is not authenticated
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    // User does not have the required role
    return <Navigate to="/unauthorized" />;
  }

  return user? <Outlet /> : <Navigate to="/login" />;

};

export default AuthRoute;
