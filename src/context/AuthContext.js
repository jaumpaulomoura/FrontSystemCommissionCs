import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [email, setEmail] = useState(Cookies.get('email') || '');
  const [token, setToken] = useState(Cookies.get('token') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(!!Cookies.get('token'));

  useEffect(() => {
    if (token) {
      Cookies.set('token', token, { expires: 7 }); // Expira em 7 dias
      Cookies.set('email', email, { expires: 7 });
    }
  }, [token, email]);

  const login = (userEmail, userToken) => {
    setEmail(userEmail);
    setToken(userToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    Cookies.remove('email');
    Cookies.remove('token');
    setEmail('');
    setToken('');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ email, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
