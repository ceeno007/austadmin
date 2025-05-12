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

  const checkAuth = () => {
    const token = localStorage.getItem('accessToken');
    const applicationData = localStorage.getItem('applicationData');
    
    // Check if both token and application data exist
    const isValid = !!(token && applicationData);
    
    // Update authentication state
    setIsAuthenticated(isValid);
    
    // If not valid, clear any stale data
    if (!isValid) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('applicationData');
      localStorage.removeItem('userName');
      localStorage.removeItem('programType');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userId');
    }
    
    return isValid;
  };

  const login = (token: string, userData: any) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('applicationData', JSON.stringify(userData));
    
    // Store user information
    if (userData.user && userData.user.full_name) {
      localStorage.setItem('userName', userData.user.full_name);
    } else if (userData.name) {
      localStorage.setItem('userName', userData.name);
    } else if (userData.full_name) {
      localStorage.setItem('userName', userData.full_name);
    } else if (userData.user && userData.user.name) {
      localStorage.setItem('userName', userData.user.name);
    }
    
    if (userData.email) {
      localStorage.setItem('userEmail', userData.email);
    } else if (userData.user && userData.user.email) {
      localStorage.setItem('userEmail', userData.user.email);
    }
    
    if (userData.id) {
      localStorage.setItem('userId', userData.id.toString());
    } else if (userData.user && userData.user.uuid) {
      localStorage.setItem('userId', userData.user.uuid);
    }
    
    // First check for program type in applications array (this is where it's located in the response)
    let programType;
    if (userData.applications && userData.applications.length > 0) {
      programType = userData.applications[0].program_type;
      console.log("Found program_type in applications:", programType);
    } else {
      // Fallback to other locations if not found in applications
      programType = userData.program_type || userData.user?.program || userData.program;
    }
    
    if (programType) {
      localStorage.setItem('programType', programType.toLowerCase());
    //   console.log(`Program type set to: ${programType.toLowerCase()} from API response`);
    }
    
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
    
    // Redirect to login
    navigate('/login', { replace: true });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 