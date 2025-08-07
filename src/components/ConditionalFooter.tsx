import React from 'react';
import { useLocation } from 'react-router-dom';
import Footer from './Footer';

const ConditionalFooter = () => {
  const location = useLocation();
  
  // Don't show footer on document upload page, terms, or privacy pages
  if (location.pathname === '/document-upload' || 
      location.pathname === '/terms' || 
      location.pathname === '/privacy') {
    return null;
  }
  
  return <Footer />;
};

export default ConditionalFooter; 