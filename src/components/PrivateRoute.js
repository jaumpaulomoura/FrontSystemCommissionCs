import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ element }) => {
  const { email } = useAuth();

  console.log('PrivateRoute - Current email:', email); // Verifique o email aqui
  return email ? element : <Navigate to="/" />;
};

export default PrivateRoute;
