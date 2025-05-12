import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';

const ConditionalNavbar = () => {
  const location = useLocation();
  
  // Don't show navbar on document upload page
  if (location.pathname === '/document-upload') {
    return null;
  }
  
  return <Navbar />;
};

export default ConditionalNavbar; 