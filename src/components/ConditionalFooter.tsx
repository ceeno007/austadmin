import React from 'react';
import { useLocation } from 'react-router-dom';
import Footer from './Footer';

const ConditionalFooter = () => {
  const location = useLocation();
  
  // Don't show footer on document upload page
  if (location.pathname === '/document-upload') {
    return null;
  }
  
  return <Footer />;
};

export default ConditionalFooter; 