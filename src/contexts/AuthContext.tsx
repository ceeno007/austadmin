import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string, userData: any) => void;
  logout: () => void;
  checkAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Prevent back button after logout
  useEffect(() => {
    window.history.pushState(null, '', window.location.href);
    window.onpopstate = function () {
      window.history.pushState(null, '', window.location.href);
    };
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('accessToken');
    const isValid = !!token;
    setIsAuthenticated(isValid);
    return isValid;
  };

  const login = (token: string, userData: any) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('applicationData', JSON.stringify(userData));
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Clear all authentication data
    localStorage.removeItem('accessToken');
    localStorage.removeItem('applicationData');
    localStorage.removeItem('userName');
    localStorage.removeItem('programType');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    
    // Update authentication state
    setIsAuthenticated(false);
    
    // Clear navigation history and redirect to login
    window.history.replaceState(null, '', '/login');
    navigate('/login', { replace: true });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 