import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ApplicationStatusCheckProps {
  children: React.ReactNode;
}

const ApplicationStatusCheck: React.FC<ApplicationStatusCheckProps> = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkApplicationStatus = async () => {
      try {
        // Get application data from localStorage
        const applicationData = localStorage.getItem('applicationData');
        if (applicationData) {
          const data = JSON.parse(applicationData);
          
          // Check if application is submitted
          if (data.status === 'submitted') {
            // Redirect to success page
            navigate('/application-success');
            return;
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking application status:', error);
        setIsLoading(false);
      }
    };

    if (user) {
      checkApplicationStatus();
    } else {
      setIsLoading(false);
    }
  }, [user, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF5500]"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ApplicationStatusCheck; 