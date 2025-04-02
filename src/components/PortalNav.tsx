import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import austLogo from "@/assets/images/austlogo.webp";

const PortalNav = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Student";

  const handleSignOut = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("applicationDraft");
    navigate("/login");
  };

  return (
    <div className="bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <img 
              src={austLogo} 
              alt="AUST Logo" 
              className="h-10 w-auto object-contain"
            />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {userName}</span>
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="text-gray-700 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortalNav; 