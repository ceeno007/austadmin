import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import austLogo from "@/assets/images/austlogo.webp";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location.pathname !== "/") return false;
    return location.pathname.startsWith(path);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="relative z-20 w-full backdrop-blur-md bg-white/80 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src={austLogo} 
                alt="AUST Logo" 
                className="h-12 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={cn(
                "font-medium transition-colors",
                isActive("/") ? "text-[#FF5500]" : "hover:text-[#FF5500]"
              )}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={cn(
                "font-medium transition-colors",
                isActive("/about") ? "text-[#FF5500]" : "hover:text-[#FF5500]"
              )}
            >
              About
            </Link>
            <Link 
              to="/programs" 
              className={cn(
                "font-medium transition-colors",
                isActive("/programs") ? "text-[#FF5500]" : "hover:text-[#FF5500]"
              )}
            >
              Programs
            </Link>
            <Link 
              to="/campus" 
              className={cn(
                "font-medium transition-colors",
                isActive("/campus") ? "text-[#FF5500]" : "hover:text-[#FF5500]"
              )}
            >
              Campus Life
            </Link>
            <Link 
              to="/hostels" 
              className={cn(
                "font-medium transition-colors",
                isActive("/hostels") ? "text-[#FF5500]" : "hover:text-[#FF5500]"
              )}
            >
              Hostels
            </Link>
            <Link 
              to="/contact" 
              className={cn(
                "font-medium transition-colors",
                isActive("/contact") ? "text-[#FF5500]" : "hover:text-[#FF5500]"
              )}
            >
              Contact
            </Link>
          </div>

          <div className="hidden md:flex items-center">
            <Button asChild variant="outline" className="mr-3">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild className="bg-[#FF5500] hover:bg-[#e64d00]">
              <Link to="/signup">Apply Now</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 invisible'} overflow-hidden`}>
        <div className="container mx-auto px-4 py-4 space-y-4">
          <Link 
            to="/" 
            className={cn(
              "block font-medium transition-colors",
              isActive("/") ? "text-[#FF5500]" : "hover:text-[#FF5500]"
            )}
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className={cn(
              "block font-medium transition-colors",
              isActive("/about") ? "text-[#FF5500]" : "hover:text-[#FF5500]"
            )}
          >
            About
          </Link>
          <Link 
            to="/programs" 
            className={cn(
              "block font-medium transition-colors",
              isActive("/programs") ? "text-[#FF5500]" : "hover:text-[#FF5500]"
            )}
          >
            Programs
          </Link>
          <Link 
            to="/campus" 
            className={cn(
              "block font-medium transition-colors",
              isActive("/campus") ? "text-[#FF5500]" : "hover:text-[#FF5500]"
            )}
          >
            Campus Life
          </Link>
          <Link 
            to="/hostels" 
            className={cn(
              "block font-medium transition-colors",
              isActive("/hostels") ? "text-[#FF5500]" : "hover:text-[#FF5500]"
            )}
          >
            Hostels
          </Link>
          <Link 
            to="/contact" 
            className={cn(
              "block font-medium transition-colors",
              isActive("/contact") ? "text-[#FF5500]" : "hover:text-[#FF5500]"
            )}
          >
            Contact
          </Link>
          <div className="flex flex-col space-y-3 pt-2">
            <Button asChild variant="outline">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild className="bg-[#FF5500] hover:bg-[#e64d00]">
              <Link to="/signup">Apply Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
