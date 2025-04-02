import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PortalNav = () => {
  const navigate = useNavigate();
  const user = {
    name: "John Doe", // This should come from your auth context
  };

  const handleLogout = () => {
    // Add your logout logic here
    navigate("/");
  };

  return (
    <nav className="bg-[hsl(var(--accent)/0.1)] border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-lg font-semibold text-gray-900">
              {user.name}
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