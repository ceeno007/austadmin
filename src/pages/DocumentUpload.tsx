import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Info } from "lucide-react";
import { useLocation } from "react-router-dom";
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

const DocumentUpload = () => {
  const { toast } = useToast();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const typeFromUrl = searchParams.get("type");
  const { checkAuth } = useAuth();

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

  const [showInfoModal, setShowInfoModal] = useState(false);
  const [modalContent, setModalContent] = useState<{ title: string; content: string } | null>(null);

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

  // Add useEffect to show undergraduate popup on mount
  useEffect(() => {
    if (programType === "undergraduate") {
      const hasShownUndergraduatePopup = localStorage.getItem('hasShownUndergraduatePopup');
      if (!hasShownUndergraduatePopup) {
        setModalContent({
          title: "Undergraduate Programs",
          content: `Applications for all our first-year undergraduate degrees must be made online through the JAMB E-facility Portal. Walk-in applicants who did not select AUST as their school of first choice will also need to visit the JAMB Portal to make the necessary changes to their choice of school on their page. For Direct Entry students applying for our 200 Level programs should send an email to admissions@aust.edu.ng or visit the Admissions Office (MH 113, Mandela Hall).

The minimum cutoff JAMB score for the University for the 2024/2025 Session is 140.

Applicants with a minimum score of 140 who had previously selected AUST as their first choice will automatically be given admission, after meeting the entry requirements for the program being applied for. Walk-in applicants who did not select AUST as their school of first choice, and have met the entry requirements for their program, should take the following steps:

• Visit the JAMB E-facility Portal at https://jamb.gov.ng/efacility and log in with your email address and password.
• Click on the 'Application for Correction of Data (2024)' from the list of services on the left panel.
• From the drop-down menu, select the 'Course/Institution' option and make the necessary changes to AUST.`,
        });
        setShowInfoModal(true);
        localStorage.setItem('hasShownUndergraduatePopup', 'true');
      }
    }
  }, [programType]); 

  return (
    <div className="min-h-screen bg-[hsl(var(--accent)/0.02)]">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              {programType === "undergraduate" && "Undergraduate Program"}
              {programType === "postgraduate" && "Postgraduate Program"}
              {programType === "phd" && "Ph.D. Program"}
              {programType === "foundation" && "FOUNDATION AND REMEDIAL STUDIES Program"}
            </h1>
            <p className="text-gray-600 mt-2">Please upload your required documents below</p>
          </div>
          
          <div className="space-y-6">
            {programType === "postgraduate" || programType === "msc" || programType === "phd" ? (
              <PostgraduateForm />
            ) : programType === "foundation" ? (
              <FoundationForm />
            ) : (
              <UndergraduateForm />
            )}
          </div>
        </div>
      </main>
      <Toaster />

      <Dialog open={showInfoModal} onOpenChange={setShowInfoModal}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#FF5500] flex items-center gap-2">
              <Info className="h-6 w-6" />
              {modalContent?.title}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Please read the following information carefully before proceeding with your application.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4 text-gray-700">
            {modalContent?.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentUpload; 