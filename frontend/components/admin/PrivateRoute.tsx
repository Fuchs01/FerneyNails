import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, hasPermission } from '@services/authService';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRole?: 'administrateur' | 'gerant' | 'employe';
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredRole = 'employe' }) => {
  const location = useLocation();
  
  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (!hasPermission(requiredRole)) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;