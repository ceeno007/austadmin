import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

import { Info, LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import UndergraduateForm from "@/components/forms/UndergraduateForm";
import PostgraduateForm from "@/components/forms/PostgraduateForm";
import FoundationForm from "@/components/forms/FoundationForm";
import { useAuth } from "@/contexts/AuthContext";
import paymentService from "@/services/payment";
import ApplicationStatusCheck from '@/components/ApplicationStatusCheck';
import { PaystackConsumer } from "react-paystack";
import apiService from "@/services/api";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const DocumentUpload = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const typeFromUrl = searchParams.get("type");
  const { checkAuth, logout, isAuthenticated } = useAuth();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const [activeTab, setActiveTab] = useState(() => {
    // Use URL parameter first, then localStorage, then default to "undergraduate"
    return typeFromUrl || localStorage.getItem("programType") || "undergraduate";
  });
  
  const [programType, setProgramType] = useState(() => {
    // Use URL parameter first, then localStorage, then default to "undergraduate"
    const type = typeFromUrl || localStorage.getItem("programType") || "undergraduate";
    
    // Always update localStorage with the current program type to ensure consistency
    localStorage.setItem("programType", type);
    
    return type;
  });

  const [userName, setUserName] = useState(() => {
    // Get the user's name from localStorage or applicationData
    const storedName = localStorage.getItem("userName");
    if (storedName) return storedName;
    
    // If not in userName, try to get from applicationData
    const applicationData = localStorage.getItem("applicationData");
    if (applicationData) {
      try {
        const data = JSON.parse(applicationData);
        
        // Check for full_name in the user object first (based on the API response structure)
        if (data.user && data.user.full_name) {
          localStorage.setItem("userName", data.user.full_name);
          return data.user.full_name;
        }
        
        // Fallback to other possible locations
        if (data.name) {
          localStorage.setItem("userName", data.name);
          return data.name;
        }
        if (data.full_name) {
          localStorage.setItem("userName", data.full_name);
          return data.full_name;
        }
        if (data.user?.name) {
          localStorage.setItem("userName", data.user.name);
          return data.user.name;
        }
      } catch (e) {
        console.error("Error parsing application data:", e);
      }
    }
    
    return "User";
  });

  // Add residency state
  const [residency, setResidency] = useState<'nigeria' | 'international'>('nigeria');

  // Update program type when URL parameter changes
  useEffect(() => {
    const typeFromUrl = new URLSearchParams(window.location.search).get('type');
    if (typeFromUrl) {
      setProgramType(typeFromUrl);
      localStorage.setItem('programType', typeFromUrl);
    } else {
      const savedType = localStorage.getItem('programType');
      if (savedType) {
        setProgramType(savedType);
      }
    }
  }, []);

  // Handler for tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setProgramType(value);
    localStorage.setItem("programType", value);
  };

  // Function to check if a tab should be disabled
  const isTabDisabled = (tab: string) => {
    return tab !== programType;
  };

  // Add authentication check
  useEffect(() => {
    const checkAuthStatus = () => {
      const accessToken = localStorage.getItem("accessToken");
      
      if (!accessToken) {
        // Clear any existing data
        localStorage.removeItem("accessToken");
        localStorage.removeItem("applicationData");
        localStorage.removeItem("userId");
        // Redirect to login page
        window.location.href = "/login";
        return;
      }
    };

    // Check auth immediately
    checkAuthStatus();

    // Set up interval to check auth every 5 minutes
    const interval = setInterval(checkAuthStatus, 5 * 60 * 1000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Handle payment initialization
  const handlePayment = async (amount: number, email: string, metadata: Record<string, any> = {}) => {
    try {
      setIsProcessingPayment(true);
      const response = await paymentService.initializePayment(amount, email, metadata);
      
      if (response.status === 'success' && response.data?.authorization_url) {
        // Redirect to Paystack payment page
        window.location.href = response.data.authorization_url;
      } else {
        toast.error(response.message || "Failed to initialize payment");
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error("An error occurred while processing your payment");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Handle payment verification
  const verifyPayment = async (reference: string) => {
    try {
      const response = await paymentService.verifyPayment(reference);
      
      if (response.status === 'success' && response.data?.status === 'success') {
        toast.success("Your payment has been processed successfully");
        // Handle successful payment (e.g., enable document upload)
        return true;
      } else {
        toast.error(response.message || "Payment verification failed");
        return false;
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      toast.error("Failed to verify payment status");
      return false;
    }
  };

  // Check for payment reference in URL (Paystack callback)
  useEffect(() => {
    const reference = searchParams.get('reference');
    if (reference) {
      verifyPayment(reference);
    }
  }, [searchParams]);

  // Update the handlePaystackSuccess function
  const handlePaystackSuccess = async (reference: any) => {
    try {
      // Get the current timestamp
      const timestamp = new Date().toISOString();
      
      // Get the program type from localStorage or URL params
      const programType = localStorage.getItem("programType") || "undergraduate";
      
      // Get the application data from localStorage
      const applicationData = JSON.parse(localStorage.getItem("applicationData") || "{}");
      
      // Update local storage to mark payment as completed
      localStorage.setItem("paymentCompleted", "true");
      localStorage.setItem("paymentReference", reference.reference);
      
      // Show success message
      toast.success("Your application has been submitted successfully.", {
        duration: 5000,
      });

      // Navigate to success page
      navigate("/payment-success");
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Please contact support if this persists.");
    }
  };

  // Update the PaystackButton component
  const PaystackButton = () => {
    // Get program type from localStorage
    const programType = localStorage.getItem("programType") || "undergraduate";
    const applicationData = JSON.parse(localStorage.getItem("applicationData") || "{}");
    
    // Set amount based on program type and residency
    const getAmount = () => {
      switch(programType.toLowerCase()) {
        case 'postgraduate':
        case 'msc':
        case 'phd':
          return residency === 'nigeria' ? 2000000 : 5000; // ₦20,000 for Nigerians, $50 for international
        case 'foundation':
        case 'jupeb':
          return residency === 'nigeria' ? 1000000 : 0; // ₦10,000 for Nigerians, no international
        default:
          return 0; // Free for undergraduate
      }
    };

    // Get currency based on residency
    const getCurrency = () => {
      if (programType.toLowerCase() === 'postgraduate' && residency === 'international') {
        return "USD";
      }
      return "NGN";
    };

    // Create reference with program type - only for paid programs
    const createReference = () => {
      const timestamp = new Date().getTime();
      // Only generate reference for paid programs
      if (programType.toLowerCase() === 'postgraduate' || programType.toLowerCase() === 'foundation') {
        const programPrefix = programType.toLowerCase().substring(0, 3); // e.g., "pos" for postgraduate
        return `${programPrefix}_${timestamp}`;
      }
      return timestamp.toString(); // For undergraduate, just use timestamp
    };

    const config = {
      reference: createReference(),
      email: applicationData.user?.email || "",
      amount: getAmount(),
      publicKey: 'pk_test_7fcc7a1fe3005ff3f99b088e7999c4add0d37bbd',
      currency: getCurrency(),
      metadata: {
        program_type: programType,
        timestamp: new Date().toISOString(),
        custom_fields: [
          {
            display_name: "Program Type",
            variable_name: "program_type",
            value: programType
          },
          {
            display_name: "Residency",
            variable_name: "residency",
            value: residency === 'nigeria' ? "Nigerian" : "International"
          }
        ]
      }
    };

    const handleSuccess = (reference: any) => {
      handlePaystackSuccess(reference);
    };

    const handleClose = () => {
      toast.error("Payment cancelled. You can try again when you're ready.");
    };

    // Get display amount based on program and residency
    const getDisplayAmount = () => {
      switch(programType.toLowerCase()) {
        case 'postgraduate':
        case 'msc':
        case 'phd':
          return residency === 'nigeria' ? "₦20,000" : "$50";
        case 'foundation':
        case 'jupeb':
          return residency === 'nigeria' ? "₦10,000" : "Not Available";
        default:
          return "Free";
      }
    };

    // Don't show payment button for undergraduate or international foundation
    if (programType.toLowerCase() === 'undergraduate' || 
        (programType.toLowerCase() === 'foundation' && residency === 'international')) {
      return null;
    }

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Select Your Residency</Label>
          <Select
            value={residency}
            onValueChange={(value: 'nigeria' | 'international') => setResidency(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your residency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nigeria">Nigeria</SelectItem>
              <SelectItem value="international">International</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <PaystackConsumer {...config}>
          {({initializePayment}) => (
            <Button
              onClick={() => initializePayment(handleSuccess, handleClose)}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Pay {getDisplayAmount()} Application Fee
            </Button>
          )}
        </PaystackConsumer>
      </div>
    );
  };

  return (
    <>
      <style>
        {`
          /* Force hide login page completely */
          .login-page, .signin-page, [data-testid="login"], [data-testid="signin"], 
          .auth-page, .login-container, .signin-container, 
          [class*="login"], [class*="signin"], [id*="login"], [id*="signin"] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            position: absolute !important;
            z-index: -9999 !important;
            pointer-events: none !important;
            height: 0 !important;
            width: 0 !important;
            overflow: hidden !important;
          }
          
          /* Fix double scrollbars */
          html, body {
            height: 100% !important;
            overflow-x: hidden !important;
            overflow-y: hidden !important;
          }
          
          /* Single scrollbar container */
          .document-upload-container {
            height: 100vh !important;
            overflow-y: auto !important;
            overflow-x: hidden !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            background: #ffffff !important;
            z-index: 99999 !important;
          }
          .theme-dark .document-upload-container {
            background: #0f172a !important; /* slate-900 */
          }
          
          /* Hide any other scrollable elements */
          main, .container, .max-w-4xl {
            overflow: visible !important;
          }
        `}
      </style>
      <div 
        className="document-upload-container bg-white dark:bg-slate-900"
      >
      <main 
        className="container mx-auto px-4 py-8 bg-white dark:bg-slate-900"
      >
        <div 
          className="max-w-4xl mx-auto bg-white dark:bg-slate-900"
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {programType === "undergraduate" && "Undergraduate Program"}
                {programType === "postgraduate" && "Postgraduate Program"}
                {programType === "phd" && "Ph.D. Program"}
                {programType === "foundation" && "School of Foundation & Remedial Studies Program"}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Please upload your required documents below</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
          
          <div 
            className="space-y-6 bg-white dark:bg-slate-900"
          >
            {programType === "postgraduate" || programType === "msc" || programType === "phd" ? (
              <PostgraduateForm onPayment={handlePayment} isProcessingPayment={isProcessingPayment} />
            ) : programType === "foundation" ? (
              <FoundationForm onPayment={handlePayment} isProcessingPayment={isProcessingPayment} />
            ) : (
              <UndergraduateForm onPayment={handlePayment} isProcessingPayment={isProcessingPayment} />
            )}
          </div>
        </div>
      </main>
    </div>
    </>
  );
};

export default DocumentUpload; 