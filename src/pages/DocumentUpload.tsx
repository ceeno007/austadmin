import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
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

const DocumentUpload = () => {
  const { toast } = useToast();
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

  // Update program type when URL parameter changes
  useEffect(() => {
    if (typeFromUrl) {
      setActiveTab(typeFromUrl);
      setProgramType(typeFromUrl);
      localStorage.setItem("programType", typeFromUrl);
      console.log(`Program type set to ${typeFromUrl} from URL parameter`);
    } else {
      // If URL has no type, get from localStorage to maintain persistence  
      const savedType = localStorage.getItem("programType");
      if (savedType) {
        setActiveTab(savedType);
        setProgramType(savedType);
        // Update URL to match the saved program type without full page reload
        window.history.replaceState(
          null, 
          '', 
          `${window.location.pathname}?type=${savedType}`
        );
        console.log(`Program type set to ${savedType} from localStorage`);
      }
    }
  }, [typeFromUrl]);

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
        console.log("No access token found");
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
        toast({
          title: "Payment Error",
          description: response.message || "Failed to initialize payment",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: "An error occurred while processing your payment",
        variant: "destructive",
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Handle payment verification
  const verifyPayment = async (reference: string) => {
    try {
      const response = await paymentService.verifyPayment(reference);
      
      if (response.status === 'success' && response.data?.status === 'success') {
        toast({
          title: "Payment Successful",
          description: "Your payment has been processed successfully",
        });
        // Handle successful payment (e.g., enable document upload)
        return true;
      } else {
        toast({
          title: "Payment Failed",
          description: response.message || "Payment verification failed",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      toast({
        title: "Payment Error",
        description: "Failed to verify payment status",
        variant: "destructive",
      });
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

  return (
    <ApplicationStatusCheck>
      <div className="min-h-screen bg-[hsl(var(--accent)/0.02)]">
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {programType === "undergraduate" && "Undergraduate Program"}
                  {programType === "postgraduate" && "Postgraduate Program"}
                  {programType === "phd" && "Ph.D. Program"}
                  {programType === "foundation" && "FOUNDATION AND REMEDIAL STUDIES Program"}
                </h1>
                <p className="text-gray-600 mt-2">Please upload your required documents below</p>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
            
            <div className="space-y-6">
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
        <Toaster />
      </div>
    </ApplicationStatusCheck>
  );
};

export default DocumentUpload; 