import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCurrentClient } from '@/services/clientAuthService';

interface ClientPrivateRouteProps {
  children: React.ReactNode;
}

const ClientPrivateRoute: React.FC<ClientPrivateRouteProps> = ({ children }) => {
  const location = useLocation();
  
  // Utiliser React Query pour vérifier l'authentification
  const { data: client, isLoading } = useQuery({
    queryKey: ['currentClient'],
    queryFn: getCurrentClient,
    retry: false
  });

  // Pendant le chargement, vous pouvez afficher un spinner ou rien
  if (isLoading) {
    return null;
  } 

  // Vérifier directement si client existe
  if (!client) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ClientPrivateRoute;