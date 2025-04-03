import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PortalNavProps {
  userName?: string;
}

const PortalNav = ({ userName = "User" }: PortalNavProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear all user data from localStorage
    localStorage.removeItem("userName");
    localStorage.removeItem("programType");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId");
    localStorage.removeItem("accessToken");
    
    // Redirect to home page
    navigate("/");
  };

  return (
    <nav className="bg-[hsl(var(--accent)/0.1)] border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-lg font-semibold text-gray-900">
              Welcome, {userName}
            </span>
          </div>
          
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default PortalNav; 