import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, roleRequired, userRole, children }) => {
  if (!isAuthenticated) {
    // Se l'utente non è autenticato, reindirizza alla pagina di login
    return <Navigate to="/login" replace />;
  }

  if (roleRequired && userRole !== roleRequired) {
    // Se l'utente non ha il ruolo richiesto, mostra un messaggio di accesso negato o reindirizza
    return <Navigate to="/access-denied" replace />;
  }

  // Renderizza il componente figlio
  return children;
};

export default ProtectedRoute;