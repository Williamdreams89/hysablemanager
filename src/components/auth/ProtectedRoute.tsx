import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute: React.FC = () => {
  const isAuthenticated = Boolean(localStorage.getItem("access_token"));

  if (!isAuthenticated) {
    // Redirect to login if user is not authenticated
    return <Navigate to="/auth/login" replace />;
  }

  // Allow access to protected route
  return <Outlet />;
};

export default ProtectedRoute;
