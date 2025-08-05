import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

/**
 * Checks the application status from a sign-in response and redirects to the success page if an application is submitted
 * @param signInResponse - The response from the sign-in API call
 * @returns boolean - True if redirection is happening, false otherwise
 */
export const checkSignInApplicationStatus = (signInResponse: any): boolean => {
  try {
    // Check if there's an application in the response
    if (signInResponse?.applications?.length > 0) {
      const application = signInResponse.applications[0];
      
      // If the application is already submitted, redirect to success page
      if (application.submitted === true) {
        // console.log('Found submitted application after sign-in, redirecting to success page');
        
        // Store the application data for reference on the success page
        localStorage.setItem('applicationData', JSON.stringify(signInResponse));
        
        // Show success notification
        toast.success("Welcome back!", {
          description: "You have a submitted application. Redirecting to status page...",
          duration: 2000,
        });
        
        // Redirect to application success page after a short delay
        setTimeout(() => {
          window.location.href = '/application-success';
        }, 2000);
        
        return true; // Indicate that redirection is happening
      }
    }
    
    // No submitted application found
    return false;
  } catch (error) {
    console.error('Error checking application status after sign-in:', error);
    return false;
  }
};

/**
 * Loads and checks existing application data from localStorage
 * @returns boolean - True if application is found and submitted, false otherwise
 */
export const checkExistingApplicationStatus = (): boolean => {
  try {
    const storedData = localStorage.getItem('applicationData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      if (parsedData.applications && parsedData.applications.length > 0) {
        const application = parsedData.applications[0];
        
        // If the application is already submitted, redirect to success page
        if (application.submitted === true) {
          // console.log('Found existing submitted application, redirecting to success page');
          
          // Show success notification
          toast.success("Application found!", {
            description: "Redirecting to your application status...",
            duration: 2000,
          });
          
          // Redirect to application success page after a short delay
          setTimeout(() => {
            window.location.href = '/application-success';
          }, 2000);
          
          return true; // Indicate that redirection is happening
        }
      }
    }
    
    // No submitted application found
    return false;
  } catch (error) {
    console.error('Error checking existing application status:', error);
    return false;
  }
};

// Handle application redirection after sign-in
export const handleApplicationRedirect = (authResponse: any, navigate: any): boolean => {
  if (!authResponse || !authResponse.applications || authResponse.applications.length === 0) {
    return false;
  }
  
  const application = authResponse.applications[0];
  if (application.submitted) {
    // console.log('Found submitted application after sign-in, redirecting to success page');
    navigate('/application-success');
    return true;
  }
  
  return false;
};

// Check if user has an existing application and redirect if needed
export const checkApplicationStatusAndRedirect = (navigate: any): boolean => {
  try {
    // Check if there's application data in localStorage
    const applicationData = localStorage.getItem('applicationData');
    if (!applicationData) {
      return false;
    }
    
    const data = JSON.parse(applicationData);
    
    // Check if it's a valid application object
    if (!data || !data.applications || data.applications.length === 0) {
      return false;
    }
    
    const application = data.applications[0];
    
    // If the application is marked as submitted, redirect to success page
    if (application.submitted) {
      // console.log('Found existing submitted application, redirecting to success page');
      navigate('/application-success');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking application status:', error);
    return false;
  }
}; 