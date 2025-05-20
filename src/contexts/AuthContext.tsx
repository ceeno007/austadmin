import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  email: string;
  full_name: string;
  program?: string;
  id?: string;
  uuid?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
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
  const [user, setUser] = useState<User | null>(null);
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
      setUser(null);
    } else {
      // Set user data from localStorage
      const userData = JSON.parse(applicationData || '{}');
      setUser({
        email: userData.email || userData.user?.email || '',
        full_name: userData.full_name || userData.user?.full_name || '',
        program: userData.program || userData.user?.program || '',
        id: userData.id || userData.user?.id || '',
        uuid: userData.uuid || userData.user?.uuid || ''
      });
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
    
    // Process program type from API response
    // The FastAPI response format includes:
    // {
    //   access_token: "token",
    //   token_type: "bearer",
    //   user: { email, uuid, program, full_name }
    //   postgraduate_applications: []
    // }
    let programType;
    
    // Check first in the user object from the FastAPI response
    if (userData.user && userData.user.program) {
      programType = userData.user.program;
    }
    // Then check for program type in applications array (this is where it's located in the response)
    else if (userData.applications && userData.applications.length > 0) {
      programType = userData.applications[0].program_type;
    } 
    // Check for postgraduate applications specifically
    else if (userData.postgraduate_applications && userData.postgraduate_applications.length > 0) {
      programType = 'postgraduate';
    }
    // Fallback to other locations if not found above
    else {
      programType = userData.program_type || userData.program;
    }
    
    if (programType) {
      // Store program type in lowercase for consistency
      localStorage.setItem('programType', programType.toLowerCase());
    }
    
    // Set user data
    setUser({
      email: userData.user?.email || userData.email || '',
      full_name: userData.user?.full_name || userData.full_name || userData.name || '',
      program: programType,
      id: userData.user?.id || userData.id || '',
      uuid: userData.user?.uuid || userData.uuid || ''
    });
    
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
    setUser(null);
    
    // Redirect to login
    navigate('/login', { replace: true });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 