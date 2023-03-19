import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const BackToLogin = () => {
  const location = useLocation();
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default BackToLogin;
