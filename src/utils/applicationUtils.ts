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
        console.log('Found submitted application after sign-in, redirecting to success page');
        
        // Store the application data for reference on the success page
        localStorage.setItem('applicationData', JSON.stringify(signInResponse));
        
        // Show success notification
        toast.success("Welcome back!", {
          description: "You have a submitted application. Redirecting to status page...",
          duration: 2000,
          style: {
            background: '#10B981',
            color: 'white',
            border: 'none',
          }
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
          console.log('Found existing submitted application, redirecting to success page');
          
          // Show success notification
          toast.success("Application found!", {
            description: "Redirecting to your application status...",
            duration: 2000,
            style: {
              background: '#10B981',
              color: 'white',
              border: 'none',
            }
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